// /app/api/pdf/query/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatOpenAI } from "@langchain/openai";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
await client.connect();

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const embedder = new OpenAIEmbeddings();
    const questionEmbedding = await embedder.embedQuery(question);

    // ✅ Convert embedding to Postgres-compatible vector string
    const formattedEmbedding = `[${questionEmbedding.join(",")}]`;

    // 🧠 Cosine similarity match using vector
    const result = await client.query(
      `
      SELECT content
      FROM pdf_chunks
      ORDER BY embedding <#> $1::vector
      LIMIT 3
    `,
      [formattedEmbedding]
    );

    const context = result.rows.map((row) => row.content).join("\n---\n");

    const model = new ChatOpenAI({ temperature: 0 });

    const completion = await model.call([
      {
        role: "system",
        content: "You are a helpful assistant. Answer based on the given context.",
      },
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion: ${question}`,
      },
    ]);

    return NextResponse.json({ answer: completion.text });
  } catch (error: any) {
    console.error("❌ Query Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
