import axios from 'axios';

export const generateColumnDescriptions = async (tables: Array<{name: string, columns: string[]}>) => {
  try {
    if (!tables || !Array.isArray(tables) || tables.length === 0) {
      return {
        success: false,
        error: 'No tables provided',
        descriptions: {}
      };
    }

    const response = await axios.post('/api/generate-descriptions', 
      { tables },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data && response.data.descriptions) {
      return {
        success: true,
        descriptions: response.data.descriptions
      };
    } else {
      console.error('Invalid response format:', response.data);
      return {
        success: false,
        error: 'Invalid response from description generator',
        descriptions: {}
      };
    }
  } catch (error) {
    console.error('Error generating column descriptions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      descriptions: {}
    };
  }
}; 