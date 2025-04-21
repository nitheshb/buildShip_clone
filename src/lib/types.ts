export interface MySQLFormData {
  host: string;
  port: string;
  username: string;
  password: string;
  databasename: string;
  connectionName: string;
  promptHelper?: string;
}

export interface PostgreSQLFormData {
  databaseUrl: string;
  connectionName: string;
  promptHelper?: string;
}

export interface MongoDBFormData {
  connectionString: string;
  database: string;
  username: string;
  password: string;
  connectionName: string;
  promptHelper?: string;
}

export interface SupabaseFormData {
  supabaseUrl: string;
  supabaseKey: string;
  connectionName: string;
  promptHelper?: string;
}

export interface FirebaseFormData {
  clientEmail: string;
  privateKeyId: string;
  privateKey: string;
  projectId: string;
  clientId: string;
  clientUrl: string;
  connectionName: string;
  promptHelper?: string;
}

export interface AIQueryFormData {
  filePath: string;
  connectionName: string;
}

export interface TableInfo {
    name: string;
    columns: ColumnInfo[];
}

export interface ColumnInfo {
    name: string;
    description: string;
}



