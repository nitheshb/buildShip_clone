declare module 'deepseek' {
    export class DeepSeekEmbeddings {
      embedQuery(query: string): Promise<number[]>;
    }
  
    export class DeepSeek {
      query(options: { context: string; question: string }): Promise<{ answer: string }>;
    }
  }
  