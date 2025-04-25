import { Tables } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';


export async function POST(req: NextRequest) {
  try {
    const { databaseUrl } = await req.json();

    const result = await fetchDatabaseTables(databaseUrl);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json({ success: false, error: 'Unexpected error occurred' }, { status: 500 });
  }
}

async function fetchDatabaseTables(databaseUrl: string) {
  let client;

  try {
    const parsedUrl = new URL(databaseUrl);
    const username = parsedUrl.username;
    const password = parsedUrl.password;
    const host = parsedUrl.hostname;
    const databasename = parsedUrl.pathname.split('/')[1];

    client = new Client({
      host,
      user: username,
      password,
      database: databasename,
      ssl: false,
    });

    await client.connect();

    const tablesResult = await client.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    );

    const tables: Tables[] = [];

    for (const table of tablesResult.rows) {
      const tableName = table.table_name;

      const columnsResult = await client.query(
        `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1`,
        [tableName]
      );

      const columns = columnsResult.rows.map(col => col.column_name);

      tables.push({
        name: tableName,
        columns,
      });
    }

    return { success: true, tables };
  } catch (error) {
    console.error('Error fetching database tables:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch database tables',
    };
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (err) {
        console.error('Error closing PostgreSQL connection:', err);
      }
    }
  }
}
