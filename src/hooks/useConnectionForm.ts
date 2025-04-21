import { useState } from 'react';
import { 
  MySQLFormData, 
  PostgreSQLFormData, 
  MongoDBFormData, 
  SupabaseFormData, 
  FirebaseFormData, 
  AIQueryFormData
} from '@/lib/types';
import { ConnectionService } from '@/lib/connectionService';

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
    resetForm,
    isSubmitting,
    error
  };
};

export const useMongoDBForm = () => {
  const [formData, setFormData] = useState<MongoDBFormData>({
    connectionString: '',
    database: '',
    username: '',
    password: '',
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

  const resetForm = () => {
    setFormData({
      connectionString: '',
      database: '',
      username: '',
      password: '',
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
    resetForm,
    isSubmitting,
    error
  };
};

export const useSupabaseForm = () => {
  const [formData, setFormData] = useState<SupabaseFormData>({
    supabaseUrl: '',
    supabaseKey: '',
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

  const resetForm = () => {
    setFormData({
      supabaseUrl: '',
      supabaseKey: '',
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
    resetForm,
    isSubmitting,
    error
  };
};

export const useFirebaseForm = () => {
  const [formData, setFormData] = useState<FirebaseFormData>({
    clientEmail: '',
    privateKeyId: '',
    privateKey: '',
    projectId: '',
    clientId: '',
    clientUrl: '',
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
    
    const result = await ConnectionService.saveFirebaseConnection(formData, userId);
    
    setIsSubmitting(false);
    if (!result.success && result.error) {
      setError(result.error);
    }
    
    return result;
  };

  const resetForm = () => {
    setFormData({
      clientEmail: '',
      privateKeyId: '',
      privateKey: '',
      projectId: '',
      clientId: '',
      clientUrl: '',
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
    resetForm,
    isSubmitting,
    error
  };
};

export const usePdfQueryForm = () => {
  const [formData, setFormData] = useState<AIQueryFormData>({
    filePath: '',
    connectionName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'fileUpload' ? (e.target.files?.[0]?.name || '') : value,
    }));

    if (id === 'fileUpload' && e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, filePath: URL.createObjectURL(e.target.files![0]) }));
    }
  };

  const handleSubmit = async (userId: string) => {
    setIsSubmitting(true);
    setError(null);

    const result = await ConnectionService.savePdfQuery(formData, userId);

    setIsSubmitting(false);
    if (!result.success && result.error) {
      setError(result.error);
    }

    return result;
  };

  const resetForm = () => {
    setFormData({
      filePath: '',
      connectionName: '',
    });
    setError(null);
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    resetForm,
    isSubmitting,
    error,
  };
};

export const useExcelQueryForm = () => {
  const [formData, setFormData] = useState<AIQueryFormData>({
    filePath: '',
    connectionName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'fileUpload' ? (e.target.files?.[0]?.name || '') : value,
    }));

    if (id === 'fileUpload' && e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, filePath: URL.createObjectURL(e.target.files![0]) }));
    }
  };

  const handleSubmit = async (userId: string) => {
    setIsSubmitting(true);
    setError(null);

    const result = await ConnectionService.saveExcelQuery(formData, userId);

    setIsSubmitting(false);
    if (!result.success && result.error) {
      setError(result.error);
    }

    return result;
  };

  const resetForm = () => {
    setFormData({
      filePath: '',
      connectionName: '',
    });
    setError(null);
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    resetForm,
    isSubmitting,
    error,
  };
};




