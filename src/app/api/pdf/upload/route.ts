import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Client } from "pg";
import fs from "fs/promises";
import path from "path";
import os from "os";

// PostgreSQL client
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
await client.connect();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, file.name);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    // Load and split PDF
    const loader = new PDFLoader(filePath);
    const rawDocs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const docs = await splitter.splitDocuments(rawDocs);

    const embedder = new OpenAIEmbeddings();
    const insertedEmbeddings: { content: string; embedding: number[] }[] = [];

    for (const doc of docs) {
      const embedding = await embedder.embedQuery(doc.pageContent);

      // Fix: Convert JS array to Postgres array string
      const formattedVector = `[${embedding.join(",")}]`;

      await client.query(
        "INSERT INTO pdf_chunks (content, embedding) VALUES ($1, $2::vector)",
        [doc.pageContent, formattedVector]
      );

      insertedEmbeddings.push({
        content: doc.pageContent,
        embedding,
      });
    }

    return NextResponse.json({
      message: "PDF stored successfully.",
      insertedChunks: insertedEmbeddings,
    });
  } catch (error: any) {
    console.error("❌ PDF Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
