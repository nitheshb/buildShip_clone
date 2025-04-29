import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import fs from "fs/promises";
import path from "path";
import os from "os";
import sharp from "sharp"; // Image processing
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

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

    // Temporary directory for storing the uploaded image
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, file.name);

    // Convert file to buffer and save it temporarily
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    // Process the image (resize or any other processing you want)
    const processedImageBuffer = await sharp(buffer)
      .resize(800) // Example resizing step
      .toBuffer();

    // Convert the image buffer to base64 string
    const base64Image = processedImageBuffer.toString("base64");

    // Here, we assume the OpenAI embedding model can process the image (as base64)
    const embedder = new OpenAIEmbeddings();
    const imageFeatures = await embedder.embedQuery(base64Image);  // Pass the base64 string

    // Format the embedding vector as a Postgres array string
    const formattedVector = `[${imageFeatures.join(",")}]`;

    // Insert the image embedding into PostgreSQL
    await client.query(
      "INSERT INTO image_data (content, embedding) VALUES ($1, $2::vector)",
      [file.name, formattedVector]
    );

    return NextResponse.json({
      message: "Image stored successfully.",
      insertedEmbedding: {
        content: file.name,
        embedding: imageFeatures,
      },
    });
  } catch (error: any) {
    console.error("❌ Image Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
