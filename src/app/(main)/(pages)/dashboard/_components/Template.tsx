"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ActiveConnections from '@/app/(main)/(pages)/dashboard/_components/ActiveConnections';
import ConnectionDrawer from '@/components/connection/ConnectionDrawer';
import { useConnections } from '@/hooks/useConnections';
import TemplatesSection from './TemplatesSection';

const Template = () => {
  const router = useRouter();
  const { connections, isLoading, error, getTemplateTitle } = useConnections();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | undefined>(undefined);

  const handleConnect = (templateValue: string) => {
    setSelectedTemplate(templateValue);
    setSelectedConnectionId(undefined);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedConnectionId(undefined);
  };
 
  const handleManageConnection = (connectionId: string) => {
    const connection = connections.find(conn => conn.id === connectionId);
    if (connection) {
      setSelectedTemplate(connection.type);
      setSelectedConnectionId(connectionId);
      setDrawerOpen(true);
    }
  };
 
  const handleChatConnection = (connectionId: string) => {
    router.push(`/chat/${connectionId}`);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <TemplatesSection onConnect={handleConnect} />
           
            <ActiveConnections
              connections={connections}
              isLoading={isLoading}
              onManageConnection={handleManageConnection}
              onChatConnection={handleChatConnection}
              getTemplateTitle={getTemplateTitle}
            />
           
            {error && (
              <div className="p-4 mt-4 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleCloseDrawer}
        />
      )}
     
      <ConnectionDrawer
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        templateValue={selectedTemplate}
        connectionId={selectedConnectionId}
      />
    </div>
  );
};

export default Template;