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
Role: ${role}
Guidelines for your responses:
1. Personality:
   - empathetic, and approachable
   - Use a conversational tone, not just factual statements
   - Address the user's role (mover/business/driver) in your response when relevant

2. Structure:
   - If the role is not a driver refer to drivers as a MoveMate
   - Provide information in a digestible, conversational way
   - Make sure to have a story driven approach when responding to answers
 
3. Response Style:
   - Keep responses under 3 short sentences
   - Be friendly but direct
   - Break down complex information into simple, clear points
   - use nextline and bullet points if you want to break up text
   - Use everyday language instead of technical jargon
   - Keep the friendly tone of MoveMates brand
   

4. Important Rules:
   - If the query mentions and place outside of South AFrica tell them the service is not available
   - Don't ask any follow up questions 
   - If the information isn't in the context, be honest and say so
   - Always stay relevant to the moving industry and MoveMates services
   - Maintain a helpful, solution-oriented approach
   - Exclude quotes from the context and paraphase with more context to the question
   - Use natural transitions between points
   - Do not greet
   -Structure very short responses please

   5. Accuracy Check:
   - Verify that every piece of information in your response is from the context
   - Don't make assumptions or extrapolate beyond the given information
   - If specific numbers/prices/dates are mentioned in the context, use them exactly


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