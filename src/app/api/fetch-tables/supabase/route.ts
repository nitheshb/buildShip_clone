import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Client } from 'pg';
import { Tables } from '@/lib/types';


export async function POST(req: NextRequest) {
  try {
    const { supabaseUrl, supabaseKey, databaseUrl } = await req.json();

    const pgClient = new Client({ connectionString: databaseUrl });
    await pgClient.connect();

    const checkFunctionSQL = `
      SELECT 1
      FROM pg_proc
      JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid
      WHERE proname = 'execute_sql'
        AND pg_namespace.nspname = 'public'
        AND pg_proc.proargtypes::text = '25';
    `;

    const { rows: exists } = await pgClient.query(checkFunctionSQL);

    if (exists.length === 0) {
      const createFunctionSQL = `
        CREATE OR REPLACE FUNCTION public.execute_sql(query text)
        RETURNS JSONB
        LANGUAGE plpgsql
        SECURITY DEFINER
        SET search_path = public
        AS $$
        DECLARE
            result JSONB;
        BEGIN
            EXECUTE format('SELECT json_agg(t) FROM (%s) t', query) INTO result;
            RETURN COALESCE(result, '[]'::jsonb);
        EXCEPTION WHEN OTHERS THEN
            RETURN jsonb_build_object(
                'error', SQLERRM,
                'detail', SQLSTATE
            );
        END;
        $$;

        GRANT EXECUTE ON FUNCTION public.execute_sql(text) TO authenticated;
        GRANT EXECUTE ON FUNCTION public.execute_sql(text) TO anon;
      `;
      await pgClient.query(createFunctionSQL);
    }

    await pgClient.end();

    const supabase = createClient(supabaseUrl, supabaseKey);

    const fetchTablesSQL = `
      SELECT table_name, column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `;

    const { data, error } = await supabase.rpc('execute_sql', { query: fetchTablesSQL });

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 500 });
    }

    const grouped: Record<string, string[]> = {};
    for (const row of data) {
      if (!grouped[row.table_name]) grouped[row.table_name] = [];
      grouped[row.table_name].push(row.column_name);
    }

    const result: Tables[] = Object.entries(grouped).map(([name, columns]) => ({
      name,
      columns,
    }));

    return NextResponse.json({
      success: true,
      tables: result,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error',
    }, { status: 500 });
  }
}
