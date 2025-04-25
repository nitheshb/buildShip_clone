import axios from 'axios';

export const testMySQLConnection = async (formData: { host: string; port: string; username: string; password: string; databasename: string  }) => {
  try {
    const response = await axios.post('/api/test-connection/mysql', formData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    console.error('An error occurred while testing the connection:', error);
    return { success: false, error: 'An error occurred while testing the connection.' };
  }
};

export const testPostgreSQLConnection = async (databaseUrl: string) => {
  try {
    const response = await axios.post('/api/test-connection/postgresql', { databaseUrl }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    console.error('An error occurred while testing the connection:', error);
    return { success: false, error: 'An error occurred while testing the connection.' };
  }
};

export const testNeonConnection = async (databaseUrl: string) => {
  try {
    const response = await axios.post('/api/test-connection/neon', { databaseUrl }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response.data; 
  } catch (error) {
    console.error('An error occurred while testing the connection:', error);
    return { success: false, error: 'An error occurred while testing the connection.' };
  }
};

export const testSupabaseConnection = async (databaseUrl: string) => {
  try {
    const response = await axios.post('/api/test-connection/supabase', { databaseUrl }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('An error occurred while testing the connection:', error);
    return { success: false, error: 'An error occurred while testing the connection.' };
  }
};

export const testFirestoreConnection = async (formData: { clientEmail: string, privateKey: string, projectId: string}) => {
  try {
    const response = await axios.post('/api/test-connection/firestore', formData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return response.data; 
  } catch (error) {
    console.error('An error occurred while testing the connection:', error);
    return { success: false, error: 'An error occurred while testing the connection.' };
  }
};
