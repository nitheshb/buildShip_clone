import { Connection } from "@/hooks/useConnections";
import { cryptoService } from "./cryptoService";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function executeQuery(
  endpoint: string, 
  query: string,
  connection?: Connection
): Promise<any> {
  try {
    
    const payload: any = { query };
    
    if (connection && connection.connectionDetails) {
      const credentials: any = {};
      
      switch (connection.type) {
        case 'chat_with_mysql':
          const decryptedPassword = await cryptoService.decrypt(
            connection.connectionDetails.password
          );
          Object.assign(credentials, {
            host: connection.connectionDetails.host,
            port: String(connection.connectionDetails.port),
            username: connection.connectionDetails.username,
            password: decryptedPassword,
            database_name: connection.connectionDetails.database_name,
          });
          break;
        case 'chat_with_postgresql':
          Object.assign(credentials, {
            database_url: connection.connectionDetails.database_url,
          });
          break;
        case 'chat_with_neon':
          Object.assign(credentials, {
            database_url: connection.connectionDetails.database_url,
          });
          break;
        case 'chat_with_supabase':
          Object.assign(credentials, {
            supabase_url: connection.connectionDetails.supabase_url,
            supabase_key: connection.connectionDetails.supabase_key,
            database_url: connection.connectionDetails.database_url,
          });
          break;
        case 'chat_with_firestore':
          Object.assign(credentials, {
            client_email: connection.connectionDetails.client_email,
            private_key: connection.connectionDetails.private_key,
            project_id: connection.connectionDetails.project_id,
          });
          break;
        case 'chat_with_mongodb':
          Object.assign(credentials, {
            database_url: connection.connectionDetails.database_url,
          });
          break;
      }
      
      payload.credentials = credentials;
    }
        
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`HTTP error ${response.status}: ${errorText || response.statusText}`);
    }

    try {
      const data = await response.json();
      return data;
    } catch (parseError) {
      const textData = await response.text();
      return textData;
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. The server took too long to respond.');
      }
      console.error("Error executing query:", error.message);
    } else {
      console.error("Unknown error executing query");
    }
    throw error;
  }
}

export function getEndpointByType(type: string): string {
  const typeMap: Record<string, string> = {
    'chat_with_mysql': 'mysql_query',
    'chat_with_postgresql': 'postgresql_query',
    'chat_with_firestore': 'firestore_query',
    'chat_with_supabase': 'supabase_query',
    'chat_with_neon': 'neon_query',
  };
  
  return typeMap[type.toLowerCase()] || 'mysql_query';
}