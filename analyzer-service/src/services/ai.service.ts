export class AIService {
  private static readonly OLLAMA_URL = 'http://localhost:11434/api/generate';
  private static readonly MODEL = 'llama3';

  static async analyzeLog(message: string, stack?: string | null, meta?: any): Promise<string> {
    try {
      const prompt = `
            [LOG_CONTEXT]
            Message: ${message}
            Stack_Trace: ${stack || 'N/A'}
            Metadata: ${meta ? JSON.stringify(meta, null, 2) : 'N/A'}
    
            Instructions:
            1. Act as a Senior DevOps and Security Engineer.
            2. Correlation: Check if Metadata fields (like IP, connection counts, or environment) explain the Message.
            3. Format:
               - TYPE: (Security/Infrastructure/App)
               - PRIORITY: (Low/Medium/High/Critical)
               - SUMMARY: (Technical root cause analysis)
               - ACTION: (Specific steps to fix this immediately)
          `;

      const response = await fetch(this.OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.MODEL,
          prompt: prompt.trim(),
          stream: false,
          options: {
            temperature: 0.3,
            top_p: 0.9,
          },
        }),
      });

      if (!response.ok) throw new Error(`Ollama_API_Error: ${response.statusText}`);

      // 'as' yerine tip güvenli json parse
      const data: { response: string } = await response.json();

      return data.response.trim();
    } catch (error) {
      console.error('[AI_SERVICE_EXCEPTION]:', error);
      return 'Analysis_Failed: Check Ollama service status and connectivity.';
    }
  }
}
