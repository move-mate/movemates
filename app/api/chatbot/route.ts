// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { mistral } from "@ai-sdk/mistral";
import { cosineSimilarity, embed, embedMany, generateText } from "ai";
import { EmbeddingDocument } from '@/app/types/chat';

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
  try {
    const { query, role } = await request.json();

    if (!query?.trim()) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const db = await getEmbeddings();

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

    const { text } = await generateText({
      model: mistral("open-mixtral-8x7b"),
      prompt: `You are MoveMates's friendly AI assistant, trained to help users with questions about moving services. ${role ? `You are speaking to a ${role}.` : ''}

Context: ${context}
Question: ${query}

Guidelines for your responses:
1. Personality:
   - Be friendly, empathetic, and approachable
   - Use a conversational tone, not just factual statements
   - Address the user's role in your response when relevant

2. Structure:
   - Start with a brief acknowledgment of their question
   - Provide information in a digestible, conversational way
   - End with a supportive statement or follow-up question when appropriate

Response:`,
    });

    return NextResponse.json({ response: text });
    
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}