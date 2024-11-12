// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import fs from "fs";
import path from "path";
import { mistral } from "@ai-sdk/mistral";
import { cosineSimilarity, embed, embedMany, generateText } from "ai";
import { CachedData, EmbeddingDocument, ErrorResponse, ChatRequest,ChatResponse } from '@/app/types/chat';
// const EMBEDDINGS_PATH_FILE ="data/cached_embeddings.json"
// const RAG_FILE_PATH = "data/faq.txt"
// Constants
const EMBEDDINGS_PATH = path.join(process.cwd(), process.env.EMBEDDINGS_PATH_FILE as string);
const FILE_PATH = path.join(process.cwd(), process.env.RAG_FILE_PATH as string);

// Custom error class for better error handling
class ChatError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'ChatError';
  }
}

// Helper function to validate cache data
function isCachedData(data: unknown): data is CachedData {
  const cached = data as CachedData;
  return (
    typeof cached === 'object' &&
    cached !== null &&
    typeof cached.essayHash === 'string' &&
    Array.isArray(cached.embeddings) &&
    cached.embeddings.every(
      (item): item is EmbeddingDocument =>
        Array.isArray(item.embedding) &&
        typeof item.value === 'string'
    )
  );
}

// Function to load or generate embeddings
async function getEmbeddings(): Promise<EmbeddingDocument[]> {
  try {
    // Check if cached embeddings exist
    if (fs.existsSync(EMBEDDINGS_PATH)) {
      const rawData = fs.readFileSync(EMBEDDINGS_PATH, 'utf8');
      const cachedData = JSON.parse(rawData);
      
      if (!isCachedData(cachedData)) {
        throw new ChatError('Invalid cache data format', 500);
      }

      const essayContent = fs.readFileSync(FILE_PATH, 'utf8');
      
      // Verify if essay content matches the cached version
      if (cachedData.essayHash === Buffer.from(essayContent).toString('base64')) {
        return cachedData.embeddings;
      }
    }

    // Generate new embeddings if cache doesn't exist or essay changed
    const essay = fs.readFileSync(FILE_PATH, "utf8");
    const chunks = essay
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

    // Cache the embeddings with essay hash
    const cacheData: CachedData = {
      essayHash: Buffer.from(essay).toString('base64'),
      embeddings: db
    };
    
    // Ensure the directory exists
    const dir = path.dirname(EMBEDDINGS_PATH);
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(EMBEDDINGS_PATH, JSON.stringify(cacheData));
    return db;
  } catch (error) {
    if (error instanceof ChatError) {
      throw error;
    }
    throw new ChatError(
      `Error loading/generating embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500
    );
  }
}

// Request handler
export async function POST(
  request: Request
): Promise<NextResponse<ChatResponse | ErrorResponse>> {
  try {
    const body = await request.json() as ChatRequest;
    const { query, role } = body;
    if (!query?.trim()) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    console.log(role)

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
      prompt: `You are MoveMates's friendly AI assistant, trained to help users with questions about moving services, whether they're movers, businesses, or drivers. Always engage in a warm, conversational manner while using the following context to inform your responses:

Context: ${context}
Question: ${query}
Role: ${role}

Guidelines for your responses:
1. Personality:
   - empathetic, and approachable
   - Use a conversational tone, not just factual statements
   - Address the user's role (mover/business/driver) in your response when relevant

2. Structure:
   - Provide information in a digestible, conversational way

3. Response Style:
   - Keep responses under 3 sentences
   - Be friendly but direct
   - Break down complex information into simple, clear points
   - use nextline and bullet points if you want to break up text
   - Use everyday language instead of technical jargon
   - Keep the friendly tone of MoveMates brand
   

4. Important Rules:
   - Keep responses under 2 concise and short sentences
   - If the information isn't in the context, be honest and say so
   - Always stay relevant to the moving industry and MoveMates services
   - Maintain a helpful, solution-oriented approach
   - Focus on the user's specific role and their needs

Remember: You are an informative chatbot that provide information based on what is asked
Response:`,
    });
    
    return NextResponse.json({ response: text });
    
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    
    if (error instanceof ChatError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}