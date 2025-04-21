import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req: NextRequest) {
  try {
    const { host, port, username, password, databasename } = await req.json();

    const connection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user: username,
      password,
      database: databasename 
    });

    await connection.end();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('MySQL connection error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    } else {
      console.error('Unexpected error:', error);
      return NextResponse.json({ success: false, error: 'Unexpected error occurred' }, { status: 500 });
    }
  }
}
