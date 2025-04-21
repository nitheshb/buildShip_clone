import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { MySQLFormData, PostgreSQLFormData, MongoDBFormData, SupabaseFormData, FirebaseFormData, AIQueryFormData } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const ConnectionService = {
  async saveMySQLConnection(data: MySQLFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.host || !data.port || !data.username || !data.password || !data.databasename || !data.connectionName || !data.promptHelper) {
        return { success: false, error: 'All fields are required' };
      }

      const portAsNumber = parseInt(data.port, 10);
      if (isNaN(portAsNumber)) {
        return { success: false, error: 'Port must be a valid number' };
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      const connectionDetails = {
        host: data.host,
        port: portAsNumber,
        username: data.username,
        password: hashedPassword,
        database_name: data.databasename
      };

      const { error } = await supabase
        .from('connections')
        .insert([
          {
            connection_type: 'mysql',
            connection_name: data.connectionName,
            user_id: userId,
            connection_details: connectionDetails,
            prompt_helper: data.promptHelper
          }
        ]);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error saving MySQL connection:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to save connection'
      };
    }
  },

  async savePostgreSQLConnection(data: PostgreSQLFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.databaseUrl || !data.connectionName) {
        return { success: false, error: 'Database URL is required' };
      }

      const connectionDetails = {
        database_url: data.databaseUrl
      };

      const { error } = await supabase
        .from('connections')
        .insert([{
          connection_type: 'postgresql',
          connection_name: data.connectionName,
          user_id: userId,
          connection_details: connectionDetails,
          prompt_helper: data.promptHelper ? JSON.parse(data.promptHelper) : null
        }]);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error saving PostgreSQL connection:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to save connection'
      };
    }
  },

  async saveMongoDBConnection(data: MongoDBFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.connectionString || !data.database || !data.connectionName) {
        return { success: false, error: 'Connection string and database name are required' };
      }

      const connectionDetails = {
        connection_string: data.connectionString,
        database: data.database,
        username: data.username || null,
        password: data.password || null
      };

      const { error } = await supabase
        .from('connections')
        .insert([{
          connection_type: 'mongodb',
          connection_name: data.connectionName,
          user_id: userId,
          connection_details: connectionDetails,
          prompt_helper: data.promptHelper ? JSON.parse(data.promptHelper) : null
        }]);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error saving MongoDB connection:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to save connection'
      };
    }
  },

  async saveSupabaseConnection(data: SupabaseFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.supabaseUrl || !data.supabaseKey || !data.connectionName) {
        return { success: false, error: 'All fields are required' };
      }

      const connectionDetails = {
        supabase_url: data.supabaseUrl,
        supabase_key: data.supabaseKey
      };

      const { error } = await supabase
        .from('connections')
        .insert([{
          connection_type: 'supabase',
          connection_name: data.connectionName,
          user_id: userId,
          connection_details: connectionDetails,
          prompt_helper: data.promptHelper ? JSON.parse(data.promptHelper) : null
        }]);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error saving Supabase connection:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to save connection'
      };
    }
  },

  async saveFirebaseConnection(data: FirebaseFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.clientEmail || !data.privateKeyId || !data.privateKey ||
        !data.projectId || !data.clientId || !data.clientUrl || !data.connectionName) {
        return { success: false, error: 'All fields are required' };
      }

      const connectionDetails = {
        client_email: data.clientEmail,
        private_key_id: data.privateKeyId,
        private_key: data.privateKey,
        project_id: data.projectId,
        client_id: data.clientId,
        client_url: data.clientUrl
      };

      const { error } = await supabase
        .from('connections')
        .insert([{
          connection_type: 'firebase',
          connection_name: data.connectionName,
          user_id: userId,
          connection_details: connectionDetails,
          prompt_helper: data.promptHelper ? JSON.parse(data.promptHelper) : null
        }]);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error saving Firebase connection:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to save connection'
      };
    }
  },

  async checkConnectionNameExists(connectionName: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('connections')
        .select('connection_name')
        .eq('connection_name', connectionName)
        .single();

      if (error) throw error;

      return !!data;
    } catch (err) {
      console.error('Error checking connection name:', err);
      return false;
    }
  },
    
  async savePdfQuery(data: AIQueryFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.filePath || !data.connectionName) {
        return { success: false, error: 'File path is required' };
      }
  
      const { error } = await supabase
        .from('connections')
        .insert([{
          connection_type: 'pdfquery',
          connection_name: data.connectionName,
          file_path: data.filePath,
          user_id: userId,
        }]);
  
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error saving PDF query connection:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to save connection'
      };
    }
  },  

   async saveExcelQuery(data: AIQueryFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.filePath || !data.connectionName) {
        return { success: false, error: 'File path is required' };
      }
  
      const { error } = await supabase
        .from('connections')
        .insert([{
          connection_type: 'excelquery',
          connection_name: data.connectionName,
          file_path: data.filePath,
          user_id: userId,
        }]);
  
      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error saving Excel query connection:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to save connection'
      };
    }
  },
};