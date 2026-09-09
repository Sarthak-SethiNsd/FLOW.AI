import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Total 7-day rolling window quota in tokens.
 */
export const TOTAL_QUOTA = 15000;

/**
 * 15% admission threshold.
 * 15% of 15,000 = 2,250 tokens.
 * A request is admitted ONLY if available balance before admission is >= 2,250 tokens.
 */
export const MIN_ADMISSION_TOKENS = 2250;

/**
 * Server-side maximum token budget for a single chatbot request: 2,750 tokens.
 * Rationale:
 * - System prompt (fixed rules + website asanas list + active asana context): ~1,550 tokens
 * - Chat history window (last 6 messages max): ~400 tokens
 * - User message limit (capped at 400 chars, ~100 tokens max)
 * - Groq max_completion_tokens: configured at 400 tokens
 * Total worst-case actual consumption: ~2,450 tokens.
 * 2,750 tokens provides a safe, conservative ceiling while preventing concurrent requests
 * from collectively exceeding 15,000 tokens.
 */
export const MAX_REQUEST_TOKEN_BUDGET = 2750;

/**
 * Rolling window length: exactly 7 days in milliseconds.
 */
export const WINDOW_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Helper to get the user's aiUsage document reference in Firestore.
 */
export function getAiUsageDocRef(uid) {
  return doc(db, 'users', uid, 'aiUsage', 'current');
}

/**
 * Reads public quota status for the user without mutating Firestore.
 * Strictly calculates remaining percentage and never returns raw token counts.
 */
export async function getUserQuotaStatus(uid) {
  try {
    const docRef = getAiUsageDocRef(uid);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return {
        remainingPercentage: 100,
        windowExpiresAt: null,
        hasActiveWindow: false,
        isLowQuota: false
      };
    }

    const data = snap.data();
    const now = Date.now();
    const windowExpiresAtMs = data.windowExpiresAt ? new Date(data.windowExpiresAt).getTime() : 0;

    // If window has expired, treat user as having full 100% until next accepted request
    if (!windowExpiresAtMs || now >= windowExpiresAtMs) {
      return {
        remainingPercentage: 100,
        windowExpiresAt: null,
        hasActiveWindow: false,
        isLowQuota: false
      };
    }

    const tokensUsed = Number(data.tokensUsed) || 0;
    const reservedTokens = Number(data.reservedTokens) || 0;
    const effectiveCommitted = tokensUsed + reservedTokens;
    const tokensAvailable = Math.max(0, TOTAL_QUOTA - effectiveCommitted);
    const remainingPercentage = Math.max(0, Math.min(100, Math.round((tokensAvailable / TOTAL_QUOTA) * 100)));
    const isLowQuota = tokensAvailable < MIN_ADMISSION_TOKENS || remainingPercentage < 15;

    return {
      remainingPercentage,
      windowExpiresAt: data.windowExpiresAt,
      hasActiveWindow: true,
      isLowQuota
    };
  } catch (err) {
    console.error('[quota] Error fetching quota status:', err);
    return {
      remainingPercentage: 100,
      windowExpiresAt: null,
      hasActiveWindow: false,
      isLowQuota: false
    };
  }
}

/**
 * STEP 1: Pre-Groq Atomic Reservation Transaction
 * Atomically:
 * 1. Checks if an active rolling 7-day window exists or has expired.
 * 2. If expired or non-existent, calculates state with fresh 15,000 allowance.
 * 3. Checks the 15% admission threshold (tokensAvailable >= 2,250 tokens).
 * 4. If remaining < 15%, rejects the request BEFORE calling Groq.
 * 5. If admitted, atomically reserves MAX_REQUEST_TOKEN_BUDGET (2,750 tokens),
 *    preventing concurrent requests from collectively exceeding the 15,000 quota.
 * 6. Records whether this is a new window initialization.
 *
 * Returns: { admitted: boolean, isNewWindow: boolean, windowExpiresAt: string, remainingPercentage: number, isLowQuota: boolean }
 */
export async function reserveQuotaAtomic(uid) {
  const docRef = getAiUsageDocRef(uid);

  return await runTransaction(db, async (transaction) => {
    const docSnap = await transaction.get(docRef);
    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();

    let isNewWindow = false;
    let windowStartedAt;
    let windowExpiresAt;
    let tokensUsed = 0;
    let reservedTokens = 0;
    let requestCount = 0;

    if (!docSnap.exists()) {
      isNewWindow = true;
      windowStartedAt = nowIso;
      windowExpiresAt = new Date(nowMs + WINDOW_DURATION_MS).toISOString();
    } else {
      const currentData = docSnap.data();
      const existingExpiresMs = currentData.windowExpiresAt ? new Date(currentData.windowExpiresAt).getTime() : 0;

      if (!existingExpiresMs || nowMs >= existingExpiresMs) {
        // Window expired — start fresh 7-day window
        isNewWindow = true;
        windowStartedAt = nowIso;
        windowExpiresAt = new Date(nowMs + WINDOW_DURATION_MS).toISOString();
        tokensUsed = 0;
        reservedTokens = 0;
        requestCount = 0;
      } else {
        // Active window
        windowStartedAt = currentData.windowStartedAt;
        windowExpiresAt = currentData.windowExpiresAt;
        tokensUsed = Number(currentData.tokensUsed) || 0;
        reservedTokens = Number(currentData.reservedTokens) || 0;
        requestCount = Number(currentData.requestCount) || 0;
      }
    }

    // Available tokens before reservation
    const effectiveCommitted = tokensUsed + reservedTokens;
    const tokensAvailable = Math.max(0, TOTAL_QUOTA - effectiveCommitted);
    const remainingPercentage = Math.max(0, Math.min(100, Math.round((tokensAvailable / TOTAL_QUOTA) * 100)));

    // 15% hard admission barrier (2,250 tokens)
    if (tokensAvailable < MIN_ADMISSION_TOKENS || remainingPercentage < 15) {
      return {
        admitted: false,
        isNewWindow: false,
        windowExpiresAt,
        hasActiveWindow: true,
        remainingPercentage,
        isLowQuota: true
      };
    }

    // Check if remaining capacity can safely absorb the reservation
    const newReservedTokens = reservedTokens + MAX_REQUEST_TOKEN_BUDGET;

    // Read activeReservationsCount from the existing document (0 for a new window)
    const previousActiveCount = docSnap.exists()
      ? (Number(docSnap.data().activeReservationsCount) || 0)
      : 0;
    // On a new/reset window the previous count is irrelevant — start from 0
    const baseActiveCount = isNewWindow ? 0 : previousActiveCount;
    const newActiveCount = baseActiveCount + 1;

    // Atomically commit the reservation (including the incremented activeReservationsCount)
    transaction.set(docRef, {
      windowStartedAt,
      windowExpiresAt,
      tokensUsed,
      reservedTokens: newReservedTokens,
      requestCount,
      activeReservationsCount: newActiveCount,
      lastRequestAt: nowIso,
      updatedAt: nowIso
    }, { merge: true });

    const postReservationAvailable = Math.max(0, TOTAL_QUOTA - (tokensUsed + newReservedTokens));
    const postRemainingPercentage = Math.max(0, Math.min(100, Math.round((postReservationAvailable / TOTAL_QUOTA) * 100)));

    return {
      admitted: true,
      isNewWindow,
      windowExpiresAt,
      hasActiveWindow: true,
      remainingPercentage: postRemainingPercentage,
      isLowQuota: postReservationAvailable < MIN_ADMISSION_TOKENS
    };
  });
}

/**
 * STEP 2: Post-Groq Reconciliation Transaction
 * When Groq succeeds:
 * 1. Decrements reservedTokens by MAX_REQUEST_TOKEN_BUDGET.
 * 2. Increments tokensUsed by actualTokens consumed.
 * 3. Increments requestCount by 1.
 * 4. Ensures tokensUsed is clamped to TOTAL_QUOTA if exceeded.
 *
 * Returns updated public quota state (percentage only, no raw tokens).
 */
export async function reconcileQuotaAtomic(uid, actualTokens) {
  const docRef = getAiUsageDocRef(uid);

  return await runTransaction(db, async (transaction) => {
    const docSnap = await transaction.get(docRef);
    if (!docSnap.exists()) {
      return {
        remainingPercentage: 100,
        windowExpiresAt: null,
        hasActiveWindow: false,
        isLowQuota: false
      };
    }

    const currentData = docSnap.data();
    const nowIso = new Date().toISOString();

    const previousUsed = Number(currentData.tokensUsed) || 0;
    const previousReserved = Number(currentData.reservedTokens) || 0;
    const previousRequests = Number(currentData.requestCount) || 0;
    const previousActiveCount = Number(currentData.activeReservationsCount) || 0;

    // Release reservation and decrement in-flight counter
    const newReserved = Math.max(0, previousReserved - MAX_REQUEST_TOKEN_BUDGET);
    const newActiveCount = Math.max(0, previousActiveCount - 1);

    // Add actual consumption, safely bounded
    const consumed = Math.max(0, Number(actualTokens) || 0);
    const newUsed = Math.min(TOTAL_QUOTA, previousUsed + consumed);
    const newRequests = previousRequests + 1;

    transaction.update(docRef, {
      tokensUsed: newUsed,
      reservedTokens: newReserved,
      requestCount: newRequests,
      activeReservationsCount: newActiveCount,
      lastRequestAt: nowIso,
      updatedAt: nowIso
    });

    const tokensAvailable = Math.max(0, TOTAL_QUOTA - (newUsed + newReserved));
    const remainingPercentage = Math.max(0, Math.min(100, Math.round((tokensAvailable / TOTAL_QUOTA) * 100)));
    const isLowQuota = tokensAvailable < MIN_ADMISSION_TOKENS || remainingPercentage < 15;

    return {
      remainingPercentage,
      windowExpiresAt: currentData.windowExpiresAt,
      hasActiveWindow: true,
      isLowQuota
    };
  });
}

/**
 * STEP 3: Rollback on Groq Failure
 * If Groq call fails or throws:
 * 1. Releases reservedTokens by MAX_REQUEST_TOKEN_BUDGET.
 * 2. If this was the user's first request and the window was created specifically
 *    for it (requestCount === 0 and tokensUsed === 0), deletes/resets the window
 *    so it does NOT leave behind an active 7-day window.
 */
export async function rollbackReservationAtomic(uid, isNewWindow = false) {
  const docRef = getAiUsageDocRef(uid);

  try {
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(docRef);
      if (!docSnap.exists()) return;

      const currentData = docSnap.data();
      const previousRequests = Number(currentData.requestCount) || 0;
      const previousUsed = Number(currentData.tokensUsed) || 0;
      const previousReserved = Number(currentData.reservedTokens) || 0;
      const previousActiveCount = Number(currentData.activeReservationsCount) || 0;

      // Decrement the in-flight counter for THIS request's reservation
      const newActiveCount = Math.max(0, previousActiveCount - 1);
      const newReserved = Math.max(0, previousReserved - MAX_REQUEST_TOKEN_BUDGET);

      // Only delete the document when ALL of the following hold:
      //   1. This reservation created the window (isNewWindow === true)
      //   2. After decrementing, no other active reservations remain (newActiveCount === 0)
      //   3. No successful requests have ever been recorded (requestCount === 0)
      //      (requestCount only increments in reconcileQuotaAtomic on Groq success)
      //
      // This prevents a failing first request from wiping a window that a
      // concurrent sibling request — still in-flight — legitimately reserved.
      if (isNewWindow && newActiveCount === 0 && previousRequests === 0 && previousUsed === 0) {
        transaction.delete(docRef);
        return;
      }

      // Otherwise just release this request's reservation and update the counters
      transaction.update(docRef, {
        reservedTokens: newReserved,
        activeReservationsCount: newActiveCount,
        updatedAt: new Date().toISOString()
      });
    });
  } catch (err) {
    console.error('[quota] Error rolling back reservation:', err);
  }
}
