"use client";
import React, { useState } from "react";
import { ArrowLeft, Send, Database } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Connection } from '@/hooks/useConnections';

interface ChatBodyProps {
  connectionId: string;
  connection: Connection;
}

const ChatBody = ({ connectionId, connection }: ChatBodyProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `This is a simulated response to your query: "${inputMessage}"`,
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleBack = () => {
    router.push("/dashboard");
  };
  console.log("connection.icon", connection.icon)

  return (
    <div className="flex flex-col rounded-lg shadow-lg w-full max-w-4xl h-5/6 overflow-hidden border">
      {/* Header */}
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
            <p className="text-sm text-gray-500">{connection.type}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
        className={`${
                          message.type === "user"
                            ? "ml-auto bg-blue-600 text-white"
                            : message.type === "system"
                            ? "mx-auto bg-gray-200 text-gray-700"
                            : "mr-auto bg-gray-100 text-gray-600"
                        } rounded-lg p-3 max-w-[75%]`}
                      >
            {message.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t p-3 rounded-b-lg">
         <div className="flex items-center bg-gray-100 border rounded-full px-3 py-1">
           <input
             type="text"
             value={inputMessage}
             onChange={(e) => setInputMessage(e.target.value)}
             onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
             placeholder="Ask a question about your data..."
             className="flex-1 bg-transparent text-gray-600 px-3 py-2 focus:outline-none"
           />
           <button
             onClick={handleSendMessage}
             className={`p-2 rounded-lg ${inputMessage.trim() ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'}`}
           >
             <Send size={18} />
           </button>
         </div>
       </div>
     </div>
  );
};

export default ChatBody;
