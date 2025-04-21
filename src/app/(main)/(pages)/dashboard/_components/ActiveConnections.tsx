import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import ConnectionCard from '../../../../../components/cards/ConnectionCard';
import { Connection } from '@/hooks/useConnections';

interface ActiveConnectionsProps {
  connections: Connection[];
  isLoading: boolean;
  onManageConnection: (connectionId: string) => void;
  onChatConnection: (connectionId: string) => void;
}

const ActiveConnections: React.FC<ActiveConnectionsProps> = ({ 
  connections, 
  isLoading,
  onManageConnection, 
  onChatConnection 
}) => {
  const [showActiveConnections, setShowActiveConnections] = useState(true);
  const [searchConnections, setSearchConnections] = useState('');

  const toggleActiveConnections = () => {
    setShowActiveConnections(!showActiveConnections);
  };

  const handleSearchConnections = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchConnections(e.target.value);
  };

  const filteredConnections = connections.filter(connection => 
    connection.name.toLowerCase().includes(searchConnections.toLowerCase()) || 
    connection.type.toLowerCase().includes(searchConnections.toLowerCase())
  );

  if (connections.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="mt-8">
      <div 
        className="flex items-center cursor-pointer mb-4"
        onClick={toggleActiveConnections}
      >
        <h2 className="text-xl font-bold">Active Connections</h2>
        {showActiveConnections ? (
          <ChevronUp className="ml-2" size={20} />
        ) : (
          <ChevronDown className="ml-2" size={20} />
        )}
      </div>
      
      {showActiveConnections && (
        <div>
          {/* Search input for Active Connections */}
          <div className="flex items-center justify-end mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="search"
                placeholder="Search active connections..."
                value={searchConnections}
                onChange={handleSearchConnections}
                className="pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-700 w-[300px]"
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredConnections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt">
              {filteredConnections.map((connection) => (
                <ConnectionCard 
                  key={connection.id}
                  connection={connection}
                  onManage={onManageConnection}
                  onChat={onChatConnection}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-gray-500">
              No connections match your search
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActiveConnections;