import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: google('gemini-2.5-flash'),
      messages,
      system: `You are a helpful legal and general assistant for the National Legal Observatory.
Whenever you provide factual information, ALWAYS cite your sources using markdown links. Since you have Google Search Grounding enabled, use the information and URLs it provides to back up your claims.`,
      tools: {
        googleSearch: google.tools.googleSearch({}),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
