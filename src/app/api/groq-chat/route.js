import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    // 1. Authentication Check — Enforce Bearer token in Authorization header
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required to access the AI Yoga Coach.' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1]?.trim();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Invalid authentication token.' }, { status: 401 });
    }

    // Optional: Validate Firebase token with Google Identity Toolkit if configured with live credentials
    const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (firebaseApiKey && firebaseApiKey !== 'your_api_key_here') {
      try {
        const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: token })
        });
        if (!verifyRes.ok) {
          return NextResponse.json({ error: 'Unauthorized: Invalid or expired authentication session.' }, { status: 401 });
        }
      } catch (verifyErr) {
        console.error('[groq-chat] Firebase token verification error:', verifyErr);
      }
    }

    const { message, history = [], asanaContext = null } = await request.json();

    const apiKey = process.env.GROQ_API_KEY;
    // Model is configurable via GROQ_MODEL env var.
    // Intended value: openai/gpt-oss-20b
    const model = process.env.GROQ_MODEL;
    const isAssistantEnabled = process.env.NEXT_PUBLIC_ENABLE_AI_ASSISTANT === 'true';

    if (!isAssistantEnabled || !apiKey) {
      return NextResponse.json({ error: 'AI Assistant is not active' }, { status: 403 });
    }

    if (!model) {
      console.error('[groq-chat] GROQ_MODEL environment variable is not set.');
      return NextResponse.json({ error: 'AI model is not configured' }, { status: 503 });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Attempt to read custom system prompt from private file prompts/yoga_coach_system_prompt.txt
    let systemPrompt = "You are FLOW.AI, an expert virtual yoga assistant. Provide concise, friendly, and helpful advice on yoga postures, breathing, and flexibility. Limit responses to 3-4 sentences.";
    
    const promptPath = path.join(process.cwd(), 'prompts', 'yoga_coach_system_prompt.txt');
    if (fs.existsSync(promptPath)) {
      try {
        systemPrompt = fs.readFileSync(promptPath, 'utf8');
      } catch (err) {
        console.error('Failed to read system prompt file:', err);
      }
    }

    // Inject active asana context if present
    if (asanaContext) {
      systemPrompt = systemPrompt
        .replace(/{{ASANA_NAME}}/g, asanaContext.name || 'Yoga')
        .replace(/{{ASANA_SANSKRIT}}/g, asanaContext.sanskrit || '')
        .replace(/{{CURRENT_STEP}}/g, asanaContext.currentStep || '1')
        .replace(/{{TOTAL_STEPS}}/g, asanaContext.totalSteps || '1')
        .replace(/{{STEP_INSTRUCTION}}/g, asanaContext.instruction || 'Breath naturally');
    }

    // Format chat messages
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6), // Keep last 6 messages to preserve context and token safety
      { role: 'user', content: message }
    ];

    // Call Groq API completions
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,           // Reads from GROQ_MODEL env var — intended: openai/gpt-oss-20b
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!groqResponse.ok) {
      const errData = await groqResponse.json();
      console.error('Groq API Error:', errData);
      return NextResponse.json({ error: 'Inference request failed' }, { status: 502 });
    }

    const data = await groqResponse.json();
    const reply = data.choices[0]?.message?.content || 'No reply generated.';

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('API Server Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
