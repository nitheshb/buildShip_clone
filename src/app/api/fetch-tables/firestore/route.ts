import { NextRequest, NextResponse } from 'next/server';
import { Firestore } from '@google-cloud/firestore';
import { Tables } from '@/lib/types';

interface FirestoreParams {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}


export async function POST(req: NextRequest) {
  try {
    const { projectId, clientEmail, privateKey } = await req.json();
    const result = await fetchFirestoreTables({ projectId, clientEmail, privateKey });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json({ success: false, error: 'Unexpected error occurred' }, { status: 500 });
  }
}

async function fetchFirestoreTables({ projectId, clientEmail, privateKey }: FirestoreParams) {
  const firestore = new Firestore({
    projectId,
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
    },
  });

  try {
    const collections = await firestore.listCollections();

    const tables: Tables[] = [];

    for (const collection of collections) {
      const columns: string[] = [];

      const documentSnapshot = await collection.limit(1).get();
      documentSnapshot.forEach(doc => {
        Object.keys(doc.data()).forEach(field => {
          if (!columns.includes(field)) {
            columns.push(field);
          }
        });
      });

      tables.push({
        name: collection.id,
        columns,
      });
    }

    return { success: true, tables};
  } catch (error) {
    console.error('Error fetching Firestore tables:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Firestore tables',
    };
  }
}
