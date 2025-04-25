import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { tables } = await req.json();

    if (!tables || !Array.isArray(tables) || tables.length === 0) {
      return NextResponse.json(
        { error: 'Tables data is required' },
        { status: 400 }
      );
    }

    const allDescriptions: Record<string, Record<string, string>> = {};

    for (const table of tables) {
      const { name: tableName, columns } = table;
      
      if (!columns || columns.length === 0) continue;

      const prompt = `You are a database expert. Given the table "${tableName}" with the following columns: 
      ${columns.join(', ')}, please provide:
      
      1. A short, concise description of the table's purpose (what data it stores, its role in the database)
      2. A short, concise description (max 10 words each) for each column
      
      Respond in JSON format as follows:
      {
        "__table_description": "Description of the table's purpose",
        "columnName1": "description1",
        "columnName2": "description2",
        ...
      }
      Only include the JSON object with proper keys and values.`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that writes concise database table and column descriptions in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message?.content?.trim() || '{}';
      
      try {
        const descriptions = JSON.parse(content);
        allDescriptions[tableName] = descriptions;
      } catch (error) {
        console.error(`Error parsing AI response JSON for table ${tableName}:`, error);
        
        const emptyDescriptions: Record<string, string> = {
          "__table_description": `Table containing ${tableName} data`
        };
        
        columns.forEach((col: string) => {
          emptyDescriptions[col] = '';
        });
        
        allDescriptions[tableName] = emptyDescriptions;
      }
    }

    return NextResponse.json({ descriptions: allDescriptions });
  } catch (error) {
    console.error('Error generating descriptions:', error);
    return NextResponse.json(
      { error: 'Failed to generate descriptions' },
      { status: 500 }
    );
  }
} 