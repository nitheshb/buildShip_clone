"use client"
import { useParams } from 'next/navigation';
import Chat from '../_components/chat';

export default function ChatWithConnection() {
  const params = useParams();
  const connectionId = params.connectionId;
  
  return <Chat connectionId={connectionId} />;
}