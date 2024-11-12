// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import fs from "fs";
import path from "path";
import { mistral } from "@ai-sdk/mistral";
import { cosineSimilarity, embed, embedMany, generateText } from "ai";
import { CachedData, EmbeddingDocument, ErrorResponse, ChatRequest,ChatResponse } from '@/app/types/chat';


// Constants
const EMBEDDINGS_PATH = path.join(process.cwd(), "data/cached_embeddings.json");
const FILE_PATH = path.join(process.cwd(), "data/faq.txt");

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
    const { query } = body;

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
      prompt: `Context: ${context}
Question: ${query}

Instructions for response:

1. Context Analysis:
- First, determine if the question is directly answerable from the provided context
- Identify relevant sections in the context that relate to the question
- Check if any critical information is missing to provide a complete answer

2. Response Guidelines:
- Begin with a friendly, direct answer if the question is within context
- Use natural, conversational language while maintaining professionalism
- Include specific details from the context when available
- Keep responses concise and focused on the main question

3. Boundaries:
- Only provide information explicitly stated in the context
- If the question is partially answerable, only address the parts covered in the context
- If the question is completely out of scope, respond with: "I apologize, but I don't have specific information about that in my current knowledge base. Would you like to know about [suggest related topic from context]?"

4. Format:
- Structure longer responses with bullet points or short paragraphs
- Include relevant quotes from the context when helpful
- Use natural transitions between points

5. Accuracy Check:
- Verify that every piece of information in your response is from the context
- Don't make assumptions or extrapolate beyond the given information
- If specific numbers/prices/dates are mentioned in the context, use them exactly

Response:`,
    });
    console.log(text);
    
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