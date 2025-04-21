"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ActiveConnections from '@/app/(main)/(pages)/dashboard/_components/ActiveConnections';
import ConnectionDrawer from '@/components/forms/ConnectionDrawer';
import { useConnections } from '@/hooks/useConnections';
import TemplatesSection from './TemplatesSection';

const Template = () => {
  const router = useRouter();
  const { connections, isLoading, error } = useConnections();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isConnectionForEdit, setIsConnectionForEdit] = useState(false);
  const [selectedConnectionId, setSelectedConnectionId] = useState('');

  const handleConnect = (templateTitle: string) => {
    setSelectedTemplate(templateTitle);
    setIsConnectionForEdit(false);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };
  
  const handleManageConnection = (connectionId: string) => {
    const connection = connections.find(conn => conn.id === connectionId);
    if (connection) {
      setSelectedTemplate(connection.type);
      setSelectedConnectionId(connectionId);
      setIsConnectionForEdit(true);
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
        templateTitle={selectedTemplate}
        // isEditing={isConnectionForEdit}
        // connectionId={selectedConnectionId}
      />
    </div>
  );
};

export default Template;