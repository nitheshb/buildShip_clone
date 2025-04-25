"use client";
import React from 'react';

interface QueryDisplayProps {
  query: string;
  results: string | { response: string } | any[] | null;
}

const QueryDisplay = ({ query, results }: QueryDisplayProps) => {
  if (!results) {
    return (
      <div className="text-sm font-medium text-yellow-700">
        No response received from the database.
      </div>
    );
  }
  
  let responseText: string;
  
  if (typeof results === 'string') {
    responseText = results;
  } else if (Array.isArray(results)) {
    if (results.length === 0) {
      responseText = "No matching data found.";
    } else {
      try {
        responseText = JSON.stringify(results, null, 2);
      } catch (e) {
        responseText = "Received data in array format.";
      }
    }
  } else if (results.response && typeof results.response === 'string') {
    responseText = results.response;
  } else {
    try {
      responseText = JSON.stringify(results, null, 2);
    } catch (e) {
      responseText = "Received response in an unknown format.";
    }
  }
  
  const formatText = (text: string) => {
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      const isBulletPoint = line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*');
      const isNumberedItem = /^\s*\d+\.\s/.test(line);
      
      let className = '';
      if (isBulletPoint || isNumberedItem) {
        className = 'pl-4 py-0.5';
      }
      
      return (
        <div key={index} className={className}>
          {line || '\u00A0'}
        </div>
      );
    });
  };
  
  return (
    <div className="text-sm whitespace-pre-wrap">
      {formatText(responseText)}
    </div>
  );
};

export default QueryDisplay;