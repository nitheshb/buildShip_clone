import { NextRequest, NextResponse } from 'next/server';
import { Firestore } from '@google-cloud/firestore';

export async function POST(req: NextRequest) {
  try {
    const { projectId, clientEmail, privateKey } = await req.json();

    if (!clientEmail || !privateKey) {
      return NextResponse.json({ success: false, error: 'client_email and private_key are required' }, { status: 400 });
    }

    const firestore = new Firestore({
      projectId,
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
    });

    await firestore.doc('test/connectionCheck').get();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Firestore connection error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    } else {
      console.error('Unexpected error:', error);
      return NextResponse.json({ success: false, error: 'Unexpected error occurred' }, { status: 500 });
    }
  }
}
