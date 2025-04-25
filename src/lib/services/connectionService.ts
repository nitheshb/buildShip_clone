import { createClient } from '@supabase/supabase-js';
import { MySQLFormData, PostgreSQLFormData, MongoDBFormData, SupabaseFormData, FirestoreFormData, AIQueryFormData, NeonFormData } from '../types';
import { Connection } from '@/hooks/useConnections';
import { cryptoService } from './cryptoService';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

export const ConnectionService = {
  async getConnectionById(connectionId: string): Promise<Connection | null> {
    try {
      const { data, error } = await supabase
        .from('connections')
        .select('*')
        .eq('id', connectionId)
        .single();

      if (error) throw error;
      if (!data) return null;

      const { connection_details } = data;

      return {
        id: data.id,
        name: data.connection_name,
        type: data.connection_type,
        userId: data.user_id,
        connectionDetails: connection_details,
        promptHelper: data.prompt_helper,
        createdAt: data.created_at
      };
    } catch (err) {
      console.error('Error fetching connection by ID:', err);
      return null;
    }
  },

  async saveMySQLConnection(data: MySQLFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.host || !data.port || !data.username || !data.password || !data.databasename || !data.connectionName || !data.promptHelper) {
        return { success: false, error: 'All fields are required' };
      }

      const portAsNumber = parseInt(data.port, 10);
      if (isNaN(portAsNumber)) {
        return { success: false, error: 'Port must be a valid number' };
      }

      const encryptedPassword = await cryptoService.encrypt(data.password);

      const connectionDetails = {
        host: data.host,
        port: portAsNumber,
        username: data.username,
        password: encryptedPassword,
        database_name: data.databasename
      };

      const { error } = await supabase
        .from('connections')
        .insert([
          {
            connection_type: 'chat_with_mysql',
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
      if (!data.databaseUrl || !data.connectionName || !data.promptHelper) {
        return { success: false, error: 'All fields are required' };
      }

      const connectionDetails = {
        database_url: data.databaseUrl
      };

      const { error } = await supabase
        .from('connections')
        .insert([
          {
            connection_type: 'chat_with_postgresql',
            connection_name: data.connectionName,
            user_id: userId,
            connection_details: connectionDetails,
            prompt_helper: data.promptHelper
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

  async saveNeonConnection(data: NeonFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.databaseUrl || !data.connectionName || !data.promptHelper) {
        return { success: false, error: 'All fields are required' };
      }

      const connectionDetails = {
        database_url: data.databaseUrl
      };

      const { error } = await supabase
        .from('connections')
        .insert([
          {
            connection_type: 'chat_with_neon',
            connection_name: data.connectionName,
            user_id: userId,
            connection_details: connectionDetails,
            prompt_helper: data.promptHelper
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

  async saveSupabaseConnection(data: SupabaseFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.supabaseUrl || !data.supabaseKey || !data.databaseUrl || !data.connectionName || !data.promptHelper) {
        return { success: false, error: 'All fields are required' };
      }

      const connectionDetails = {
        supabase_url: data.supabaseUrl,
        supabase_key: data.supabaseKey,
        database_url: data.databaseUrl
      };

      const { error } = await supabase
        .from('connections')
        .insert([
          {
            connection_type: 'chat_with_supabase',
            connection_name: data.connectionName,
            user_id: userId,
            connection_details: connectionDetails,
            prompt_helper: data.promptHelper
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

  async saveFirestoreConnection(data: FirestoreFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.clientEmail || !data.privateKey ||
        !data.projectId || !data.connectionName || !data.promptHelper) {
        return { success: false, error: 'All fields are required' };
      }

      const connectionDetails = {
        client_email: data.clientEmail,
        private_key: data.privateKey,
        project_id: data.projectId,
      };

      const { error } = await supabase
        .from('connections')
        .insert([
          {
            connection_type: 'chat_with_firestore',
            connection_name: data.connectionName,
            user_id: userId,
            connection_details: connectionDetails,
            prompt_helper: data.promptHelper
          }]);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error saving Firestore connection:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to save connection'
      };
    }
  },

  async saveMongoDBConnection(data: MongoDBFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.databaseUrl || !data.database || !data.connectionName || !data.promptHelper) {
        return { success: false, error: 'All fields are required' };
      }

      const connectionDetails = {
        database_url: data.databaseUrl,
        database: data.database,
        username: data.username || null,
        password: data.password || null
      };

      const { error } = await supabase
        .from('connections')
        .insert([
          {
            connection_type: 'chat_with_mongodb',
            connection_name: data.connectionName,
            user_id: userId,
            connection_details: connectionDetails,
            prompt_helper: data.promptHelper
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

  async checkConnectionNameExists(connectionName: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('connections')
        .select('connection_name')
        .eq('connection_name', connectionName);

        if (error) {
          console.error('Error checking connection name:', error);
          return false;
      }

      return Array.isArray(data) && data.length > 0;
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
        .from('pdf_query')
        .insert([{
          connection_type: 'chat_with_pdf',
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
        .from('excel_query')
        .insert([{
          connection_type: 'chat_with_excel',
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
  async updateMySQLConnection(connectionId: string, data: MySQLFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.host || !data.port || !data.username || !data.databasename || !data.connectionName || !data.promptHelper) {
        return { success: false, error: 'All fields are required' };
      }

      const portAsNumber = parseInt(data.port, 10);
      if (isNaN(portAsNumber)) {
        return { success: false, error: 'Port must be a valid number' };
      }

      const encryptedPassword = await cryptoService.encrypt(data.password);

      const connectionDetails = {
        host: data.host,
        port: portAsNumber,
        username: data.username,
        password: encryptedPassword,
        database_name: data.databasename
      };

      const { error } = await supabase
        .from('connections')
        .update({
          connection_name: data.connectionName,
          connection_details: connectionDetails,
          prompt_helper: data.promptHelper
        })
        .eq('id', connectionId)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error updating MySQL connection:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update connection'
      };
    }
  },

  async updatePostgreSQLConnection(connectionId: string, data: PostgreSQLFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.databaseUrl || !data.connectionName || !data.promptHelper) {
        return { success: false, error: 'All fields are required' };
      }

      const connectionDetails = {
        database_url: data.databaseUrl
      };

      const { error } = await supabase
        .from('connections')
        .update({
          connection_name: data.connectionName,
          connection_details: connectionDetails,
          prompt_helper: data.promptHelper
        })
        .eq('id', connectionId)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error updating PostgreSQL connection:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update connection'
      };
    }
  },

  async updateNeonConnection(connectionId: string, data: NeonFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.databaseUrl || !data.connectionName || !data.promptHelper) {
        return { success: false, error: 'All fields are required' };
      }

      const connectionDetails = {
        database_url: data.databaseUrl
      };

      const { error } = await supabase
        .from('connections')
        .update({
          connection_name: data.connectionName,
          connection_details: connectionDetails,
          prompt_helper: data.promptHelper
        })
        .eq('id', connectionId)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error updating Neon connection:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update connection'
      };
    }
  },

  async updateSupabaseConnection(connectionId: string, data: SupabaseFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.supabaseUrl || !data.supabaseKey || !data.databaseUrl || !data.connectionName || !data.promptHelper) {
        return { success: false, error: 'All fields are required' };
      }

      const connectionDetails = {
        supabase_url: data.supabaseUrl,
        supabase_key: data.supabaseKey,
        database_url: data.databaseUrl
      };

      const { error } = await supabase
        .from('connections')
        .update({
          connection_name: data.connectionName,
          connection_details: connectionDetails,
          prompt_helper: data.promptHelper
        })
        .eq('id', connectionId)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error updating Supabase connection:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update connection'
      };
    }
  },

  async updateFirestoreConnection(connectionId: string, data: FirestoreFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.clientEmail || !data.projectId || !data.connectionName || !data.promptHelper) {
        return { success: false, error: 'All fields are required' };
      }

      const connectionDetails = {
        client_email: data.clientEmail,
        project_id: data.projectId,
        private_key: data.privateKey
      };

      const { error } = await supabase
        .from('connections')
        .update({
          connection_name: data.connectionName,
          connection_details: connectionDetails,
          prompt_helper: data.promptHelper
        })
        .eq('id', connectionId)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error updating Firestore connection:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update connection'
      };
    }
  },

  async updateMongoDBConnection(connectionId: string, data: MongoDBFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.databaseUrl || !data.database || !data.connectionName || !data.promptHelper) {
        return { success: false, error: 'All fields are required' };
      }

      let connectionDetails: any = {
        database_url: data.databaseUrl,
        database: data.database
      };

      if (data.username) connectionDetails.username = data.username;
      if (data.password) connectionDetails.password = data.password;

      const { error } = await supabase
        .from('connections')
        .update({
          connection_name: data.connectionName,
          connection_details: connectionDetails,
          prompt_helper: data.promptHelper
        })
        .eq('id', connectionId)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error updating MongoDB connection:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update connection'
      };
    }
  },

  async updatePdfQuery(connectionId: string, data: AIQueryFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.filePath || !data.connectionName) {
        return { success: false, error: 'File path and connection name are required' };
      }

      const { error } = await supabase
        .from('pdf_query')
        .update({
          connection_name: data.connectionName,
          file_path: data.filePath
        })
        .eq('id', connectionId)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error updating PDF query connection:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update PDF query connection'
      };
    }
  },

  async updateExcelQuery(connectionId: string, data: AIQueryFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.filePath || !data.connectionName) {
        return { success: false, error: 'File path and connection name are required' };
      }

      const { error } = await supabase
        .from('excel_query')
        .update({
          connection_name: data.connectionName,
          file_path: data.filePath
        })
        .eq('id', connectionId)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error updating Excel query connection:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update Excel query connection'
      };
    }
  },
  async updateConnection(connectionId: string, formData: any, connectionType: string, userId: string): Promise<{ success: boolean; error?: string }> {   
    switch (connectionType) {
      case 'chat_with_mysql':
        return this.updateMySQLConnection(connectionId, formData, userId);
      case 'chat_with_postgresql':
        return this.updatePostgreSQLConnection(connectionId, formData, userId);
      case 'chat_with_neon':
        return this.updateNeonConnection(connectionId, formData, userId);
      case 'chat_with_supabase':
        return this.updateSupabaseConnection(connectionId, formData, userId);
      case 'chat_with_firestore':
        return this.updateFirestoreConnection(connectionId, formData, userId);
      case 'chat_with_mongodb':
        return this.updateMongoDBConnection(connectionId, formData, userId);
      case 'chat_with_pdf':
        return this.updatePdfQuery(connectionId, formData, userId);
      case 'chat_with_excel':
        return this.updateExcelQuery(connectionId, formData, userId);
      default:
        return { success: false, error: 'Unknown connection type' };
    }
  },
};