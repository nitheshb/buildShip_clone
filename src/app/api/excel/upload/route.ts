import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";
import * as XLSX from "xlsx";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  if (!client.connect) {
    await client.connect();
  }
})();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetNames = workbook.SheetNames;
    const sheet = workbook.Sheets[sheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    const content = rows.map((row) => JSON.stringify(row)).join("\n");

    // Generate embeddings using DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        input: content,
        model: "text-embedding-002" // Use correct model name
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.statusText}`);
    }

    const data = await response.json();
    const embedding = data.data[0].embedding;
    const formattedVector = "[" + embedding.join(",") + "]";

    await client.query(
      "INSERT INTO excel_data (content, embedding) VALUES ($1, $2::vector)",
      [content, formattedVector]
    );

    return NextResponse.json({
      message: "Excel file stored successfully.",
    });
  } catch (error: any) {
    console.error("❌ Excel Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}