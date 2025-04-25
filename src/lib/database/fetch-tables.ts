export const fetchMysqlTables = async (credentials: any) => {
  const response = await fetch('/api/fetch-tables/mysql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const result = await response.json();

  if (result.success) {
    return result;
  } else {
    console.error('Failed to retrieve tables:', result.error);
    throw new Error(result.error || 'Failed to fetch tables');
  }
};

export const fetchPostgresTables = async (databaseUrl: string) => {
  try {
    const response = await fetch('/api/fetch-tables/postgresql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ databaseUrl }),
    });

    const result = await response.json();

    if (result.success) {
      return result;
    } else {
      console.error('Failed to retrieve tables:', result.error);
      throw new Error(result.error || 'Failed to fetch tables');
    }
  } catch (error) {
    console.error('Error fetching tables:', error);
    throw error;
  }
};

export const fetchNeonTables = async (databaseUrl: string) => {
  const response = await fetch('/api/fetch-tables/neon', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ databaseUrl }),
  });

  const result = await response.json();

  if (result.success) {
    return result;
  } else {
    console.error('Failed to retrieve tables:', result.error);
    throw new Error(result.error || 'Failed to fetch tables');
  }
};

export const fetchSupabaseTables = async (credentials: any) => {
  const response = await fetch('/api/fetch-tables/supabase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const result = await response.json();

  if (result.success) {
    return result;
  } else {
    console.error('Failed to retrieve tables:', result.error);
    throw new Error(result.error || 'Failed to fetch tables');
  }
};

export const fetchFirestoreCollections = async (credentials: any) => {
  const response = await fetch('/api/fetch-tables/firestore', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const result = await response.json();

  if (result.success) {
    return result;
  } else {
    console.error('Failed to retrieve collections:', result.error);
    throw new Error(result.error || 'Failed to fetch collections');
  }
};

