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
You help users understand legal documents, cases, procedures, and research published on the observatory.
Whenever you provide factual information, cite your sources using markdown links where possible.
Keep answers concise, accurate, and professional.`,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Chat API Error:', message, error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
