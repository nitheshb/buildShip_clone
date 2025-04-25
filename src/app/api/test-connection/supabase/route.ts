import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(req: NextRequest) {
  try {
    const { databaseUrl } = await req.json();

    const client = new Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();

    const res = await client.query('SELECT 1');

    await client.end();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error testing connection:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error occurred',
    }, { status: 500 });
  }
}
