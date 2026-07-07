import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { message, history = [], asanaContext = null } = await request.json();

    const apiKey = process.env.GROQ_API_KEY;
    const isAssistantEnabled = process.env.NEXT_PUBLIC_ENABLE_AI_ASSISTANT === 'true';

    if (!isAssistantEnabled || !apiKey || apiKey === 'gsk_placeholder_key') {
      return NextResponse.json({ error: 'AI Assistant is not active' }, { status: 403 });
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
        model: 'llama-3.1-8b-instant',
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
