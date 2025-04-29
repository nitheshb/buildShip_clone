import { useState } from 'react';
import { 
  MySQLFormData, 
  PostgreSQLFormData, 
  MongoDBFormData, 
  SupabaseFormData, 
  AIQueryFormData,
  FirestoreFormData,
  NeonFormData,
  PDFFormData,
  ExcelFormData,
  ImageFormData
} from '@/lib/types';
import { ConnectionService } from '@/lib/services/connectionService';

export const useMySQLForm = () => {
  const [formData, setFormData] = useState<MySQLFormData>({
    host: '',
    port: '3306',
    username: '',
    password: '',
    databasename: '',
    connectionName:'',
    promptHelper: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (userId: string) => {
    setIsSubmitting(true);
    setError(null);
    
    const result = await ConnectionService.saveMySQLConnection(formData, userId);
    
    setIsSubmitting(false);
    if (!result.success && result.error) {
      setError(result.error);
    }
    
    return result;
  };

  const handleUpdate = async (connectionId: string, userId: string) => {
    setIsSubmitting(true);
    setError(null);
    
    const result = await ConnectionService.updateMySQLConnection(connectionId, formData, userId);
    
    setIsSubmitting(false);
    if (!result.success && result.error) {
      setError(result.error);
    }
    
    return result;
  };

  const resetForm = () => {
    setFormData({
      host: '',
      port: '3306',
      username: '',
      password: '',
      databasename: '',
      connectionName: '',
      promptHelper: ''
    });
    setError(null);
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    handleUpdate,
    resetForm,
    isSubmitting,
    error
  };
};

export const usePostgreSQLForm = () => {
  const [formData, setFormData] = useState<PostgreSQLFormData>({
    databaseUrl: '',
    connectionName: '',
    promptHelper: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (userId: string) => {
    setIsSubmitting(true);
    setError(null);
    
    const result = await ConnectionService.savePostgreSQLConnection(formData, userId);
    
    setIsSubmitting(false);
    if (!result.success && result.error) {
      setError(result.error);
    }
    
    return result;
  };

  const handleUpdate = async (connectionId: string, userId: string) => {
    setIsSubmitting(true);
    setError(null);
    
    const result = await ConnectionService.updatePostgreSQLConnection(connectionId, formData, userId);
    
    setIsSubmitting(false);
    if (!result.success && result.error) {
      setError(result.error);
    }
    
    return result;
  };

  const resetForm = () => {
    setFormData({ 
      databaseUrl: '', 
      connectionName: '',
      promptHelper: ''
    });
    setError(null);
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    handleUpdate,
    resetForm,
    isSubmitting,
    error
  };
};

export const useNeonForm = () => {
  const [formData, setFormData] = useState<NeonFormData>({
    databaseUrl: '',
    connectionName: '',
    promptHelper: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (userId: string) => {
    setIsSubmitting(true);
    setError(null);
    
    const result = await ConnectionService.saveNeonConnection(formData, userId);
    
    setIsSubmitting(false);
    if (!result.success && result.error) {
      setError(result.error);
    }
    
    return result;
  };

  const handleUpdate = async (connectionId: string, userId: string) => {
    setIsSubmitting(true);
    setError(null);
    
    const result = await ConnectionService.updateNeonConnection(connectionId, formData, userId);
    
    setIsSubmitting(false);
    if (!result.success && result.error) {
      setError(result.error);
    }
    
    return result;
  };

  const resetForm = () => {
    setFormData({ 
      databaseUrl: '', 
      connectionName: '',
      promptHelper: ''
    });
    setError(null);
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    handleUpdate,
    resetForm,
    isSubmitting,
    error
  };
};

export const useSupabaseForm = () => {
  const [formData, setFormData] = useState<SupabaseFormData>({
    supabaseUrl: '',
    supabaseKey: '',
    databaseUrl: '',
    connectionName: '',
    promptHelper: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (userId: string) => {
    setIsSubmitting(true);
    setError(null);
    
    const result = await ConnectionService.saveSupabaseConnection(formData, userId);
    
    setIsSubmitting(false);
    if (!result.success && result.error) {
      setError(result.error);
    }
    
    return result;
  };

  const handleUpdate = async (connectionId: string, userId: string) => {
    setIsSubmitting(true);
    setError(null);
    
    const result = await ConnectionService.updateSupabaseConnection(connectionId, formData, userId);
    
    setIsSubmitting(false);
    if (!result.success && result.error) {
      setError(result.error);
    }
    
    return result;
  };

  const resetForm = () => {
    setFormData({
      supabaseUrl: '',
      supabaseKey: '',
      databaseUrl: '',
      connectionName: '',
      promptHelper: ''
    });
    setError(null);
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    handleUpdate,
    resetForm,
    isSubmitting,
    error
  };
};

export const useFirestoreForm = () => {
  const [formData, setFormData] = useState<FirestoreFormData>({
    clientEmail: '',
    privateKey: '',
    projectId: '',
    connectionName: '',
    promptHelper: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (userId: string) => {
    setIsSubmitting(true);
    setError(null);
    
    const result = await ConnectionService.saveFirestoreConnection(formData, userId);
    
    setIsSubmitting(false);
    if (!result.success && result.error) {
      setError(result.error);
    }
    
    return result;
  };

  const handleUpdate = async (connectionId: string, userId: string) => {
    setIsSubmitting(true);
    setError(null);
    
    const result = await ConnectionService.updateFirestoreConnection(connectionId, formData, userId);
    
    setIsSubmitting(false);
    if (!result.success && result.error) {
      setError(result.error);
    }
    
    return result;
  };

  const resetForm = () => {
    setFormData({
      clientEmail: '',
      privateKey: '',
      projectId: '',
      connectionName: '',
      promptHelper: ''
    });
    setError(null);
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    handleUpdate,
    resetForm,
    isSubmitting,
    error
  };
};

export const useMongoDBForm = () => {
  const [formData, setFormData] = useState<MongoDBFormData>({
    databaseUrl: '',
    connectionName: '',
    promptHelper: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (userId: string) => {
    setIsSubmitting(true);
    setError(null);
    
    const result = await ConnectionService.saveMongoDBConnection(formData, userId);
    
    setIsSubmitting(false);
    if (!result.success && result.error) {
      setError(result.error);
    }
    
    return result;
  };

  const handleUpdate = async (connectionId: string, userId: string) => {
    setIsSubmitting(true);
    setError(null);
    
    const result = await ConnectionService.updateMongoDBConnection(connectionId, formData, userId);
    
    setIsSubmitting(false);
    if (!result.success && result.error) {
      setError(result.error);
    }
    
    return result;
  };

  const resetForm = () => {
    setFormData({
      databaseUrl: '',
      connectionName: '',
      promptHelper: ''
    });
    setError(null);
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    handleUpdate,
    resetForm,
    isSubmitting,
    error
  };
};

// PDF form hook
export const usePdfQueryForm = () => {
  const [fileObj, setFileObj] = useState<File | null>(null);
  const [formData, setFormData] = useState<PDFFormData>({
    filePath: '',
    connectionName: '',
    promptHelper: '',
    query: ''  // Initialize query here
  });
  const [queryData, setQueryData] = useState<{query: string}>({
    query: ''
  });
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target;
    
    if (id === 'fileUpload' && files && files[0]) {
      const file = files[0];
      setFileObj(file);
      setFormData(prev => ({
        ...prev,
        filePath: URL.createObjectURL(file)
      }));
    } else if (id === 'query') {
      setQueryData(prev => ({ ...prev, query: value }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (userId: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const result = await ConnectionService.savePDFConnection(formData, userId);
      
      setIsSubmitting(false);
      if (!result.success && result.error) {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setIsSubmitting(false);
      const errorMsg = err instanceof Error ? err.message : 'Failed to save connection';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const handleUpdate = async (connectionId: string, userId: string) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await ConnectionService.updateConnection(connectionId, formData, 'pdf', userId);
      
      setIsSubmitting(false);
      if (!result.success && result.error) {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setIsSubmitting(false);
      const errorMsg = err instanceof Error ? err.message : 'Failed to update connection';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const askQuestion = async (userId: string, filePath: string, query: string) => {
    setIsSubmitting(true);
    setError(null);
    setQueryResult(null);

    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      if (!filePath) {
        throw new Error('File path is required');
      }

      if (!query) {
        throw new Error('Query is required');
      }
      
      const result = await ConnectionService.queryFile('pdf', filePath, query, userId);
      
      setIsSubmitting(false);
      
      if (result.success) {
        setQueryResult(result.answer || 'No answer received');
        return result;
      } else {
        setError(result.error || 'Query failed');
        return { success: false, error: result.error };
      }
    } catch (err) {
      setIsSubmitting(false);
      const errorMsg = err instanceof Error ? err.message : 'Failed to process query';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const resetForm = () => {
    if (fileObj && formData.filePath) {
      URL.revokeObjectURL(formData.filePath);
    }
    setFileObj(null);
    setFormData({
      filePath: '',
      connectionName: '',
      promptHelper: '',
      query: ''  // Initialize query here
    });
    setQueryData({
      query: ''
    });
    setQueryResult(null);
    setError(null);
  };

  return {
    formData,
    fileObj,
    queryData,
    queryResult,
    setFormData,
    handleInputChange,
    handleSubmit,
    handleUpdate,
    askQuestion,
    resetForm,
    isSubmitting,
    error
  };
};

// Excel form hook
export const useExcelQueryForm = () => {
  const [fileObj, setFileObj] = useState<File | null>(null);
  const [formData, setFormData] = useState<ExcelFormData>({
    filePath: '',
    connectionName: '',
    promptHelper: ''
  });
  const [queryData, setQueryData] = useState<{query: string}>({
    query: ''
  });
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target;
    
    if (id === 'fileUpload' && files && files[0]) {
      const file = files[0];
      setFileObj(file);
      setFormData(prev => ({
        ...prev,
        filePath: URL.createObjectURL(file)
      }));
    } else if (id === 'query') {
      setQueryData(prev => ({ ...prev, query: value }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (userId: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const result = await ConnectionService.saveExcelConnection(formData, userId);
      
      setIsSubmitting(false);
      if (!result.success && result.error) {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setIsSubmitting(false);
      const errorMsg = err instanceof Error ? err.message : 'Failed to save connection';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const handleUpdate = async (connectionId: string, userId: string) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await ConnectionService.updateConnection(connectionId, formData, 'excel', userId);
      
      setIsSubmitting(false);
      if (!result.success && result.error) {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      setIsSubmitting(false);
      const errorMsg = err instanceof Error ? err.message : 'Failed to update connection';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const askQuestion = async (userId: string, filePath: string, query: string) => {
    setIsSubmitting(true);
    setError(null);
    setQueryResult(null);

    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      if (!filePath) {
        throw new Error('File path is required');
      }

      if (!query) {
        throw new Error('Query is required');
      }
      
      const result = await ConnectionService.queryFile('excel', filePath, query, userId);
      
      setIsSubmitting(false);
      
      if (result.success) {
        setQueryResult(result.answer || 'No answer received');
        return result;
      } else {
        setError(result.error || 'Query failed');
        return { success: false, error: result.error };
      }
    } catch (err) {
      setIsSubmitting(false);
      const errorMsg = err instanceof Error ? err.message : 'Failed to process query';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const resetForm = () => {
    if (fileObj && formData.filePath) {
      URL.revokeObjectURL(formData.filePath);
    }
    setFileObj(null);
    setFormData({
      filePath: '',
      connectionName: '',
      promptHelper: ''
    });
    setQueryData({
      query: ''
    });
    setQueryResult(null);
    setError(null);
  };

  return {
    formData,
    fileObj,
    queryData,
    queryResult,
    setFormData,
    handleInputChange,
    handleSubmit,
    handleUpdate,
    askQuestion,
    resetForm,
    isSubmitting,
    error
  };
};

// Image form hook
export const useImageQueryForm = () => {
  const [fileObj, setFileObj] = useState<File | null>(null);
  const [formData, setFormData] = useState<ImageFormData>({
    filePath: '',
    connectionName: '',
    promptHelper: ''
  });
  const [queryData, setQueryData] = useState<{query: string}>({
    query: ''
  });
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target;
    
    if (id === 'fileUpload' && files && files[0]) {
      const file = files[0];
      setFileObj(file);
      setFormData(prev => ({
        ...prev,
        filePath: URL.createObjectURL(file)
      }));
    } else if (id === 'query') {
      setQueryData(prev => ({ ...prev, query: value }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (userId: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const result = await ConnectionService.saveImageConnection(formData, userId);

      setIsSubmitting(false);
      if (!result.success && result.error) {
        setError(result.error);
      }

      return result;
    } catch (err) {
      setIsSubmitting(false);
      const errorMsg = err instanceof Error ? err.message : 'Failed to save connection';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const handleUpdate = async (connectionId: string, userId: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await ConnectionService.updateConnection(connectionId, formData, 'image', userId);

      setIsSubmitting(false);
      if (!result.success && result.error) {
        setError(result.error);
      }

      return result;
    } catch (err) {
      setIsSubmitting(false);
      const errorMsg = err instanceof Error ? err.message : 'Failed to update connection';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const askQuestion = async (userId: string, filePath: string, query: string) => {
    setIsSubmitting(true);
    setError(null);
    setQueryResult(null);

    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      if (!filePath) {
        throw new Error('File path is required');
      }

      if (!query) {
        throw new Error('Query is required');
      }

      const result = await ConnectionService.queryFile('image', filePath, query, userId);

      setIsSubmitting(false);

      if (result.success) {
        setQueryResult(result.answer || 'No answer received');
        return result;
      } else {
        setError(result.error || 'Query failed');
        return { success: false, error: result.error };
      }
    } catch (err) {
      setIsSubmitting(false);
      const errorMsg = err instanceof Error ? err.message : 'Failed to process query';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const resetForm = () => {
    if (fileObj && formData.filePath) {
      URL.revokeObjectURL(formData.filePath);
    }
    setFileObj(null);
    setFormData({
      filePath: '',
      connectionName: '',
      promptHelper: ''
    });
    setQueryData({
      query: ''
    });
    setQueryResult(null);
    setError(null);
  };

  return {
    formData,
    fileObj,
    queryData,
    queryResult,
    setFormData,
    handleInputChange,
    handleSubmit,
    handleUpdate,
    askQuestion,
    resetForm,
    isSubmitting,
    error
  };
};
