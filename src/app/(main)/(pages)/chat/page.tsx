"use client"
import { useParams } from 'next/navigation';
import Chat from './_components/chat';

export default function ChatPage() {
  const params = useParams();
  const connectionId = params.connectionId;
  
  return <Chat connectionId={connectionId} />;
}