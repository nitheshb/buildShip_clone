"use client";
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Database, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Connection } from '@/hooks/useConnections';
import QueryDisplay from "./queryDisplay";
import { Message } from "@/lib/types";
import { executeQuery, getEndpointByType } from "@/lib/services/api";

interface ChatBodyProps {
  connectionId: string;
  connection: Connection;
  getTemplateTitle: (value: string) => string;
}

const ChatBody = ({ connectionId, connection, getTemplateTitle }: ChatBodyProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setConnectionStatus('checking');
        const endpoint = getEndpointByType(connection.type);
        await executeQuery(endpoint, "SELECT 1", connection);
        setConnectionStatus('connected');
      } catch (error) {
        console.error("Connection check failed:", error);
        setConnectionStatus('disconnected');
      }
    };
    
    if (connection) {
      checkConnection();
    }
  }, [connection]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const endpoint = getEndpointByType(connection.type);
      const data = await executeQuery(endpoint, inputMessage, connection);      
      setConnectionStatus('connected');
            
      let results: any = null;
      let generatedQuery = "";
      
      if (data && typeof data === "object") {
        if (data.results !== undefined) {
          results = data.results;
        }
        if (data.generated_query !== undefined) {
          generatedQuery = data.generated_query;
        }
        if (data.response !== undefined) {
          results = data.response;
        }
      } else if (typeof data === "string") {
        results = data;
      }
      
      if (!results || (Array.isArray(results) && results.length === 0)) {
        const noResultsMessage: Message = {
          id: Date.now().toString(),
          type: "ai",
          content: "I don't have any information on that query. Could you try asking something else about your data?",
        };
        setMessages((prev) => [...prev, noResultsMessage]);
      } else {
        const aiMessage: Message = {
          id: Date.now().toString(),
          type: "ai",
          content: "",
          queryData: {
            query: generatedQuery,
            results: results
          }
        };
        
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error fetching from API:", error);
      
      if (error instanceof Error && 
         (error.message.includes('NetworkError') || 
          error.message.includes('Failed to fetch') ||
          error.message.includes('connect'))) {
        setConnectionStatus('disconnected');
      }
      
      let errorContent = "I don't have information on that. Please try asking a different question about your data.";
      
      if (error instanceof Error) {
        if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          errorContent = "I can't connect to the database right now. Please check if the database is running and try again.";
        } else if (error.message.includes('HTTP error 404')) {
          errorContent = "I'm having trouble processing queries for this type of database. Please try a different question.";
        } else if (error.message.includes('HTTP error 500')) {
          errorContent = "I'm having trouble understanding that question in relation to your data. Could you rephrase your question?";
        }
      }
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "ai",
        content: errorContent,
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col rounded-lg shadow-lg w-full max-w-4xl h-5/6 overflow-hidden border">
      <div className="flex items-center px-4 py-3 border-b rounded">
        <button
          onClick={handleBack}
          className="mr-3 p-2 rounded-full"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex items-center">
          {connection.icon && connection.icon.length > 0 ? (
            <div className="flex flex-row mr-3">
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
          
          <div>
            <h2 className="font-medium text-lg">{connection.name}</h2>
            <div className="flex items-center">
              <div 
                className={`mr-2 h-3 w-3 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500' : 
                  connectionStatus === 'disconnected' ? 'bg-red-500' : 
                  'bg-yellow-500 animate-pulse'
                }`} 
                title={`Connection status: ${connectionStatus}`}
              />
              <p className="text-sm text-gray-500">{getTemplateTitle(connection.type)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="flex w-full"
          >
            <div
              className={`${
                message.type === "user"
                  ? "ml-auto bg-blue-600 text-white"
                  : message.type === "system"
                  ? "mx-auto bg-gray-200 text-gray-700"
                  : "mr-auto bg-gray-100 text-gray-600"
              } rounded-lg p-3 ${message.type === "user" ? "max-w-[50%]" : "max-w-[70%]"}`}
            >
              {message.type === "ai" && message.queryData ? (
                <QueryDisplay query={message.queryData.query} results={message.queryData.results} />
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="mr-auto bg-gray-100 text-gray-600 rounded-lg p-3 max-w-[10%] flex items-center">
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-3 rounded-b-lg">
        <div className="flex items-center bg-gray-100 border rounded-full px-3 py-1">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask a question about your data..."
            className="flex-1 bg-transparent text-gray-600 px-3 py-2 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className={`p-2 rounded-lg ${
              inputMessage.trim() && !isLoading
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-500'
            }`}
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBody;