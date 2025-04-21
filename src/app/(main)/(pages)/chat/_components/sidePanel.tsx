"use client";

import { Database } from "lucide-react";
import React from "react";

interface SidePanelProps {
  tables: string[];
  isVisible: boolean;
}

const SidePanel = ({ tables, isVisible }: SidePanelProps) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="h-full border-l overflow-y-auto">
      <div className="p-4 border-b">
        <div className="flex items-center">
        <div className="bg-gray-100 p-2 rounded-full mr-3">
          <Database className="text-gray-600" size={18} />
          </div>
          <h3 className="font-medium">Database Tables</h3>
        </div>
      </div>

      <div className="p-2">
      {tables && tables.length > 0 ? (
        tables.map((table) => (
          <div
            key={table}
            className="px-4 py-2 rounded cursor-pointer flex items-center"
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            {table}
          </div>
        ))
    ) : (
      <div className="px-4 py-2 text-gray-500">No tables available</div>
    )}
      </div>
    </div>
  );
};

export default SidePanel;