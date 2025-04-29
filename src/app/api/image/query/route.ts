import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

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

    const result = await client.query(
      "SELECT content FROM image_data WHERE content LIKE $1 LIMIT 3",
      [`%${question}%`]
    );

    const context = result.rows.map((row) => row.content).join("\n---\n");

    const answer = `Based on the content from the image: ${context}`;

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("Error querying Image", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
