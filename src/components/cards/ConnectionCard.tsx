import React from 'react';
import { Database, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Connection } from '@/hooks/useConnections';
import Image from "next/image";

interface ConnectionCardProps {
  connection: Connection;
  onManage: (connectionId: string) => void;
  onChat: (connectionId: string) => void;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ connection, onManage, onChat }) => {
  const tables = connection.selectedTables || [];
  console.log("tables:", tables);
  const tableCount = tables.length;

  return (
    <div className="border border-border rounded-lg p-4 shadow-sm">
      <div className="flex items-center mb-3">
        {connection.icon && connection.icon.length > 0 ? (
          <div className="flex flex-row">
            {connection.icon.map((iconPath, i) => (
              <div key={i} className="dark:bg-white rounded-md p-1 mr-1 flex items-center justify-center">
                <Image
                  src={`/${iconPath}`}
                  alt={`${connection.type} icon ${i + 1}`}
                  width={32}
                  height={32}
                />
              </div>
            ))}
          </div>
        ) : (
          <Database size={24} className="text-gray-600" />
        )}
        <div className="ml-3">
          <h3 className="font-semibold">{connection.name}</h3>
          <p className="text-sm text-gray-500">
            {connection.type} • {tableCount} tables
          </p>
        </div>
      </div>
      <div className="flex space-x-2 mt-2">
        <button
          onClick={() => onManage(connection.id)}
          className="flex-1 py-1.5 border border-border rounded-md text-sm"
        >
          Manage
        </button>
        <Button
          onClick={() => onChat(connection.id)}
          className="flex-1 py-1.5"
        >
          <MessageSquare size={16} className="mr-1" />
          Chat
        </Button>
      </div>
    </div>
  );
};

export default ConnectionCard;
