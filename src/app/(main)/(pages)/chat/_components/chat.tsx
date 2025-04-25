"use client";
import React, { useState, useEffect } from "react";
import SidePanel from "./sidePanel";
import ChatBody from "./chatBody";
import { PanelRight } from "lucide-react";
import { useConnections } from "@/hooks/useConnections";

interface ChatProps {
  connectionId: any;
}

const Chat = ({ connectionId }: ChatProps) => {
  const [connection, setConnection] = useState<any | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const { connections, error, getTemplateTitle } = useConnections();

  // useEffect(() => {
  //   const parentScroller = document.querySelector('.overflow-auto');
  //   if (parentScroller) {
  //     const originalStyle = parentScroller.getAttribute('style') || '';
  //     parentScroller.setAttribute('style', `${originalStyle}; overflow: hidden !important`);
  //     return () => {
  //       parentScroller.setAttribute('style', originalStyle);
  //     };
  //   }
  // }, []);

  useEffect(() => {
    if (connections && connections.length > 0 && connectionId) {
      const foundConnection = connections.find((conn) => conn.id === connectionId);
      
      if (foundConnection) {
        setConnection(foundConnection);
      }
    }
  }, [connections, connectionId]);

  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  if (!connection) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-row h-screen">
        <div className={`flex-1 transition-all duration-300 p-4 flex items-center justify-center ${showPanel ? 'w-3/4' : 'w-full'}`}>
          <ChatBody connectionId={connectionId} connection={connection} getTemplateTitle={getTemplateTitle}/>
        </div>
        
        <div className={`h-full transition-all duration-300 ${showPanel ? 'w-1/4' : 'w-0 overflow-hidden'}`}>
          <SidePanel tables={connection.selectedTables} isVisible={showPanel} />
        </div>
      </div>
      
      <button 
        onClick={togglePanel}
        className="absolute top-[80px] right-4 rounded-lg border p-2 shadow-md"
        aria-label={showPanel ? "Close panel" : "Open panel"}
      >
        <PanelRight size={20} className={`transition-transform ${showPanel ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};

export default Chat;