import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import { DeepSeekEmbeddings } from "deepseek"; // Correct import from deepseek
import { DeepSeek } from "deepseek"; // Correct import from deepseek

// PostgreSQL client
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

    // 1. Generate the question embedding using DeepSeek
    const embedder = new DeepSeekEmbeddings(); // DeepSeek for question embedding
    const questionEmbedding = await embedder.embedQuery(question);

    // Format question embedding to Postgres-compatible vector
    const formattedEmbedding = `[${questionEmbedding.join(",")}]`;

    // 2. Find top 3 most similar chunks from excel data
    const result = await client.query(
      `
      SELECT content
      FROM excel_data
      ORDER BY embedding <#> $1::vector
      LIMIT 3
    `,
      [formattedEmbedding]
    );

    // 3. Combine the top 3 most similar rows as context
    const context = result.rows.map((row) => row.content).join("\n---\n");

    // 4. Use DeepSeek's querying to get the answer based on context
    const deepSeek = new DeepSeek();
    const completion = await deepSeek.query({
      context,
      question,
    });

    return NextResponse.json({ answer: completion.answer });
  } catch (error: any) {
    console.error("Error querying Excel", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
