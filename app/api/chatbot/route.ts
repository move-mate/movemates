// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { mistral } from "@ai-sdk/mistral";
import { cosineSimilarity, embed, embedMany, generateText } from "ai";
import { EmbeddingDocument } from '@/app/types/chat';
import { corsHeaders } from '@/libs/cors';

// In-memory cache (note: this will reset on each cold start)
let embeddingsCache: {
  data: EmbeddingDocument[] | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0
};

const CACHE_DURATION = 3600000; // 1 hour in milliseconds

async function getEmbeddings(): Promise<EmbeddingDocument[]> {
  try {
    // Check cache first
    const now = Date.now();
    if (embeddingsCache.data && (now - embeddingsCache.timestamp) < CACHE_DURATION) {
      return embeddingsCache.data;
    }

    // Get the FAQ content
    const headersList = await headers();
    const host = headersList.get('host') || '';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const faqUrl = `${protocol}://${host}/assets/faq.txt`;
    
    const response = await fetch(faqUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch FAQ content');
    }
    
    const faqContent = await response.text();
    
    // Generate embeddings
    const chunks = faqContent
      .split(".")
      .map((chunk) => chunk.trim())
      .filter((chunk) => chunk.length > 0 && chunk !== "\n");

    const { embeddings } = await embedMany({
      model: mistral.textEmbeddingModel("mistral-embed"),
      values: chunks,
    });

    const db: EmbeddingDocument[] = embeddings.map((e, i) => ({
      embedding: e,
      value: chunks[i],
    }));

    // Update cache
    embeddingsCache = {
      data: db,
      timestamp: now
    };

    return db;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw new Error(
      `Error generating embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function POST(request: Request) {
  const cors = corsHeaders(request);

  try {
    const { query, role } = await request.json();

    if (!query?.trim()) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400, headers: cors }
      );
    }

    const db = await getEmbeddings();
    console.log(query)
    const { embedding } = await embed({
      model: mistral.textEmbeddingModel("mistral-embed"),
      value: query,
    });

    const context = db
      .map((item) => ({
        document: item,
        similarity: cosineSimilarity(embedding, item.embedding),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)
      .map((r) => r.document.value)
      .join("\n");
      console.log(query);
      
    const { text } = await generateText({
      model: mistral("open-mixtral-8x7b"),
      prompt: `You are MoveMates's friendly AI assistant, trained to help users with questions about moving services. ${role ? `You are speaking to a ${role}.` : ''}

        Context: ${context}
        Question: ${query}
        Role: ${role}
        Guidelines for your responses:
        1. Personality:
          - empathetic, and approachable
          - Set clear user expectations upfront
          - Establish boundaries of capabilities
          - Use a conversational tone, not just factual statements
          - Match tone to brand/audience
          

        2. Structure:
          - If the role is not a driver refer to drivers as a MoveMate
          - Provide information in a digestible, conversational way
          - Make sure to have a story driven approach when responding to answers
          - Keep responses under 3 short sentences
        
        3. Response Style:
          - Be friendly but direct
          - Keep responses concise but complete
          - Break long responses into digestible chunks
          - Use formatting for readability
          - Include clear calls-to-action
          - Keep the friendly tone of MoveMates brand
          

        4. Important Rules:
          - Tell the customer to sign up on the waitlist and that the application is coming soon
          - Do not go above 20 characters
          - Keep context across multiple turns
          - Include graceful fallbacks for misunderstandings
        5. Accuracy Check:
          - Verify that every piece of information in your response is from the context
          - Don't make assumptions or extrapolate beyond the given information
          - If specific numbers/prices/dates are mentioned in the context, use them exactly


        Response:`,
    });

    return NextResponse.json({ response: text }, { headers: cors });
    
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: cors }
    );
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request),
  });
}
