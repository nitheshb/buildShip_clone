import { NextRequest, NextResponse } from 'next/server';
import { Firestore } from '@google-cloud/firestore';

interface FirestoreParams {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

interface FieldInfo {
  name: string;
  type: string;
}

export async function POST(req: NextRequest) {
  try {
    const { projectId, clientEmail, privateKey } = await req.json();
    const result = await fetchFirestoreCollections({ projectId, clientEmail, privateKey });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json({ success: false, error: 'Unexpected error occurred' }, { status: 500 });
  }
}

async function fetchFirestoreCollections({ projectId, clientEmail, privateKey }: FirestoreParams) {
  const firestore = new Firestore({
    projectId,
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
    },
  });

  try {
    const collections = await firestore.listCollections();

    const collectionsInfo = [];

    for (const collection of collections) {
      const fields: FieldInfo[] = [];

      const documentSnapshot = await collection.limit(1).get();
      documentSnapshot.forEach(doc => {
        Object.keys(doc.data()).forEach(field => {
          if (!fields.some(f => f.name === field)) {
            fields.push({
              name: field,
              type: typeof doc.data()[field],
            });
          }
        });
      });

      collectionsInfo.push({
        collection: collection.id,
        fields,
      });
    }

    return { success: true, collections: collectionsInfo };
  } catch (error) {
    console.error('Error fetching Firestore collections:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch Firestore collections',
    };
  }
}
