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

export interface NeonFormData {
  databaseUrl: string;
  connectionName: string;
  promptHelper?: string;
}

export interface SupabaseFormData {
  supabaseUrl: string;
  supabaseKey: string;
  databaseUrl: string;
  connectionName: string;
  promptHelper?: string;
}

export interface FirestoreFormData {
  clientEmail: string;
  privateKey: string;
  projectId: string;
  connectionName: string;
  promptHelper?: string;
}

export interface MongoDBFormData {
  databaseUrl: string;
  database: string;
  username: string;
  password: string;
  connectionName: string;
  promptHelper?: string;
}

export interface AIQueryFormData {
  filePath: string;
  connectionName: string;
  type: 'pdf' | 'excel' | 'image';
  query: string;
}

export interface TableInfo {
    name: string;
    columns: ColumnInfo[];
}

export interface ColumnInfo {
    name: string;
    description: string;
}

export interface Tables {
  name: string;
  columns: string[];
}

export interface ApiResponse {
  generated_query?: string;
  results?: any[];
  response?: string;
}

export interface Message {
  id: string;
  type: "user" | "ai" | "system";
  content: string;
  queryData?: {
    query: string;
    results: any[];
  };
}

export interface PDFFormData {
  filePath: string;
  connectionName: string;
  promptHelper: string;
  query: string;  // Add this line
}

export interface ExcelFormData {
  filePath: string;
  connectionName: string;
  promptHelper: string;
}

export interface ImageFormData {
  filePath: string;
  connectionName: string;
  promptHelper: string;
}