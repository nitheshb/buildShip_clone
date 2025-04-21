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
    console.log('Tables:', result.tables);
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
    console.log('Collections:', result.collections);
    return result;
  } else {
    console.error('Failed to retrieve collections:', result.error);
    throw new Error(result.error || 'Failed to fetch collections');
  }
};
