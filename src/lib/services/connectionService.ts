import { createClient } from '@supabase/supabase-js';
import { MySQLFormData, PostgreSQLFormData, MongoDBFormData, SupabaseFormData, FirestoreFormData, AIQueryFormData, NeonFormData, PDFFormData, ExcelFormData, ImageFormData } from '../types';
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

  async savePDFConnection(data: PDFFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.filePath || !data.connectionName || !data.promptHelper) {
        return { success: false, error: 'All fields are required' };
      }

      const connectionDetails = {
        file_path: data.filePath
      };

      const { error } = await supabase
        .from('connections')
        .insert([
          {
            connection_type: 'chat_with_pdf',
            connection_name: data.connectionName,
            user_id: userId,
            connection_details: connectionDetails,
            prompt_helper: data.promptHelper
          }]);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error saving PDF connection:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to save connection'
      };
    }
  },

  async saveExcelConnection(data: ExcelFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.filePath || !data.connectionName || !data.promptHelper) {
        return { success: false, error: 'All fields are required' };
      }

      const connectionDetails = {
        file_path: data.filePath
      };

      const { error } = await supabase
        .from('connections')
        .insert([
          {
            connection_type: 'chat_with_excel',
            connection_name: data.connectionName,
            user_id: userId,
            connection_details: connectionDetails,
            prompt_helper: data.promptHelper
          }]);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error saving Excel connection:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to save connection'
      };
    }
  },

  async saveImageConnection(data: ImageFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate that all required fields are provided
      if (!data.filePath || !data.connectionName || !data.promptHelper) {
        return { success: false, error: 'All fields are required' };
      }
  
      // Connection details to store in Supabase
      const connectionDetails = {
        file_path: data.filePath
      };
  
      // Insert the image connection details into the Supabase 'connections' table
      const { error } = await supabase
        .from('connections')
        .insert([{
          connection_type: 'chat_with_image',   // Connection type for image
          connection_name: data.connectionName, // The name of the connection
          user_id: userId,                      // User ID
          connection_details: connectionDetails, // Image connection details (file path)
          prompt_helper: data.promptHelper      // Prompt helper (could include other metadata)
        }]);
  
      // If there is an error with the database insert, throw it
      if (error) throw error;
  
      return { success: true };
    } catch (err) {
      console.error('Error saving Image connection:', err);
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

  async uploadFile(file: File, userId: string, type: string): Promise<{ success: boolean; filePath?: string; error?: string }> {
    try {
      if (!file || !userId || !type) {
        return { success: false, error: 'File, user ID, and type are required' };
      }

      // Generate a unique file path
      const filePath = `uploads/${userId}/${type}/${Date.now()}_${file.name}`;
      
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      
      // Record the upload
      const { error } = await supabase
        .from('file_uploads')
        .insert([{
          user_id: userId,
          file_name: file.name,
          file_type: file.type,
          file_path: filePath,
          upload_type: type
        }]);

      if (error) throw error;
      
      return { 
        success: true,
        filePath: filePath
      };
    } catch (err) {
      console.error('Error uploading file:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to upload file' 
      };
    }
  },

  async queryFile(type: string, filePath: string, query: string, userId: string): Promise<{ 
    success: boolean; 
    answer?: string; 
    error?: string 
  }> {
    try {
      if (!userId || !filePath || !query || !type) {
        return { 
          success: false, 
          error: 'User ID, file path, query, and type are required' 
        };
      }

      // Validate file type
      if (!['pdf', 'excel', 'image'].includes(type.toLowerCase())) {
        return {
          success: false,
          error: 'Invalid file type. Supported types are pdf, excel, and image'
        };
      }

      // Log the query for analytics purposes
      const { error: logError } = await supabase
        .from('query_logs')
        .insert([{
          user_id: userId,
          file_path: filePath,
          query: query,
          query_type: type
        }]);

      if (logError) {
        console.error('Error logging query:', logError);
        // Continue execution even if logging fails
      }

      // Here you would typically send the query to an AI model
      // This is a placeholder - replace with actual AI service integration
      let answer = '';
      
      // Simulate different processing logic based on file type
      if (type === 'pdf') {
        // PDF processing logic - integrate with a PDF parser/AI service
        answer = `Here is the answer to your question about the PDF: "${query}"`;
      } else if (type === 'excel') {
        // Excel processing logic - integrate with a spreadsheet parser/AI service
        answer = `Here is the answer to your question about the Excel file: "${query}"`;
      } else if (type === 'image') {
        // Image processing logic - integrate with image analysis AI service
        answer = `Here is the answer to your question about the image: "${query}"`;
        
        // Record the image analysis in a dedicated table
        const { error: imageAnalysisError } = await supabase
          .from('image_analysis')
          .insert([{
            user_id: userId,
            image_path: filePath,
            query: query,
            result: answer
          }]);

        if (imageAnalysisError) {
          console.error('Error recording image analysis:', imageAnalysisError);
        }
      }

      // Save the result to the database
      const { error: resultError } = await supabase
        .from('query_results')
        .insert([{
          user_id: userId,
          file_path: filePath,
          query: query,
          answer: answer,
          query_type: type
        }]);

      if (resultError) {
        console.error('Error saving query result:', resultError);
        // Continue execution even if saving result fails
      }

      return {
        success: true,
        answer: answer
      };
    } catch (err) {
      console.error(`Error querying ${type} file:`, err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : `Failed to process ${type} query` 
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

  async updatePDFConnection(connectionId: string, data: PDFFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.filePath || !data.connectionName || !data.promptHelper) {
        return { success: false, error: 'All fields are required' };
      }

      const connectionDetails = {
        file_path: data.filePath
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
      console.error('Error updating PDF connection:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update connection'
      };
    }
  },

  async updateExcelConnection(connectionId: string, data: ExcelFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.filePath || !data.connectionName || !data.promptHelper) {
        return { success: false, error: 'All fields are required' };
      }

      const connectionDetails = {
        file_path: data.filePath
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
      console.error('Error updating Excel connection:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update connection'
      };
    }
  },

  async updateImageConnection(connectionId: string, data: ImageFormData, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!data.filePath || !data.connectionName || !data.promptHelper) {
        return { success: false, error: 'All fields are required' };
      }

      const connectionDetails = {
        file_path: data.filePath
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
      console.error('Error updating Image connection:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update connection'
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
        return this.updatePDFConnection(connectionId, formData, userId);
      case 'chat_with_excel':
        return this.updateExcelConnection(connectionId, formData, userId);
      case 'chat_with_image':
        return this.updateImageConnection(connectionId, formData, userId);
      default:
        return { success: false, error: 'Unknown connection type' };
    }
  },
};