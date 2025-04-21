import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

interface ConnectionParams {
  host: string;
  port: string;
  username: string;
  password: string;
  databasename: string;
}

interface TableInfo {
  name: string;
  columns: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { host, port, username, password, databasename } = await req.json();
    const result = await fetchDatabaseTables({ host, port, username, password, databasename });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json({ success: false, error: 'Unexpected error occurred' }, { status: 500 });
  }
}

async function fetchDatabaseTables({ host, port, username, password, databasename }: ConnectionParams) {
  let connection;

  try {
    connection = await mysql.createConnection({
      host,
      port: parseInt(port, 10),
      user: username,
      password,
      database: databasename,
    });

    const [tablesResult] = await connection.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`, 
      [databasename]
    );

    const tables: TableInfo[] = [];

    for (const table of tablesResult as any[]) {
      const tableName = table.TABLE_NAME;

      const [columnsResult] = await connection.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
        [databasename, tableName]
      );

      const columns = (columnsResult as any[]).map(col => col.COLUMN_NAME);

      tables.push({
        name: tableName,
        columns
      });
    }

    return { success: true, tables };
  } catch (error) {
    console.error('Error fetching database tables:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch database tables' 
    };
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing MySQL connection:', err);
      }
    }
  }
}
