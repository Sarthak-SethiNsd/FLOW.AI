import { NextResponse } from 'next/server';
import { getUserQuotaStatus } from '@/lib/quota';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1]?.trim();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token.' }, { status: 401 });
    }

    let uid = null;
    const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

    if (firebaseApiKey && firebaseApiKey !== 'your_api_key_here') {
      try {
        const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: token })
        });
        if (!verifyRes.ok) {
          return NextResponse.json({ error: 'Unauthorized: Invalid session.' }, { status: 401 });
        }
        const verifyData = await verifyRes.json();
        uid = verifyData.users?.[0]?.localId;
      } catch (verifyErr) {
        console.error('[quota-route] Identity toolkit verification error:', verifyErr);
      }
    }

    // Fallback: decode JWT payload if API key validation wasn't reached or in dev/mock
    if (!uid) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          uid = payload.user_id || payload.sub;
        }
      } catch (decodeErr) {
        console.error('[quota-route] JWT decode error:', decodeErr);
      }
    }

    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized: Could not determine user identity.' }, { status: 401 });
    }

    const quotaStatus = await getUserQuotaStatus(uid);

    // Ensure ONLY public fields are sent (never raw tokens)
    return NextResponse.json({
      quota: {
        remainingPercentage: quotaStatus.remainingPercentage,
        windowExpiresAt: quotaStatus.windowExpiresAt,
        hasActiveWindow: quotaStatus.hasActiveWindow,
        isLowQuota: quotaStatus.isLowQuota
      }
    });
  } catch (err) {
    console.error('[quota-route] Server error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
