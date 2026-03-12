import type { LogData } from '../schemas/log.schemas.js';

export class AIService {
  private static readonly OLLAMA_URL = 'http://localhost:11434/api/generate';
  private static readonly MODEL = 'llama3'; // Kendi modeline göre (llama3, mistral vb.) güncelleyebilirsin

  /**
   * Log verisini alır ve Ollama üzerinden AI analizi yapar.
   * Yeni şemadaki 'env' bilgisini de prompt içine dahil eder.
   */
  static async analyzeLog(
    message: string,
    stack?: string | null,
    meta?: LogData['meta'],
    env?: string // Yeni şemadan gelen KeyEnv (PRODUCTION, DEVELOPMENT vb.)
  ): Promise<string> {
    try {
      const prompt = `
            [LOG_CONTEXT]
            ENVIRONMENT: ${env || 'UNKNOWN'}
            MESSAGE: ${message}
            STACK_TRACE: ${stack || 'N/A'}
            METADATA: ${meta ? JSON.stringify(meta, null, 2) : 'N/A'}
    
            INSTRUCTIONS:
            1. Act as a Senior DevOps and Security Engineer.
            2. Analyze the log based on the ENVIRONMENT. (Errors in PRODUCTION are higher priority).
            3. Correlation: Check if Metadata fields explain the Message.
            4. Format your response strictly as follows:
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
            temperature: 0.2, // Daha tutarlı yanıtlar için sıcaklığı biraz düşürdük
            top_p: 0.9,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama_API_Error: ${response.statusText}`);
      }

      // Ollama genelde { response: "..." } şeklinde döner
      const data = (await response.json()) as { response: string };

      return data.response.trim();
    } catch (error) {
      console.error('[AI_SERVICE_EXCEPTION]:', error);
      return 'Analysis_Failed: AI servisine şu an ulaşılamıyor.';
    }
  }
}
