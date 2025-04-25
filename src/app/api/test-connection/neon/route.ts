import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(req: NextRequest) {
  try {
    const { databaseUrl } = await req.json();

    const client = new Client({
      connectionString: databaseUrl,
    });

    await client.connect();

    await client.end();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('NeonDB connection error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    } else {
      console.error('Unexpected error:', error);
      return NextResponse.json({ success: false, error: 'Unexpected error occurred' }, { status: 500 });
    }
  }
}
