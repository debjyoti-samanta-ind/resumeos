import type { AppSettings } from '../types';

export interface AIPrompt {
  system: string;
  user: string;
}

export interface AIResponse {
  success: boolean;
  data: unknown;
  raw: string;
  error?: string;
}

// ─── Free mode ────────────────────────────────────────────────────────────────
// Returns the prompt text formatted for copy-pasting into Claude.ai

export function formatPromptForDisplay(prompt: AIPrompt): string {
  return `[SYSTEM INSTRUCTIONS — paste the full message below into Claude.ai]\n\n${prompt.system}\n\n---\n\n[YOUR MESSAGE TO CLAUDE]\n\n${prompt.user}`;
}

// ─── API mode ─────────────────────────────────────────────────────────────────

export async function callAI(prompt: AIPrompt, settings: AppSettings): Promise<AIResponse> {
  if (!settings.apiKey) {
    return { success: false, data: null, raw: '', error: 'No API key configured. Add it in Settings.' };
  }

  try {
    const response = await fetch('/api/anthropic/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': settings.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: settings.model || 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: prompt.system,
        messages: [{ role: 'user', content: prompt.user }],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`API ${response.status}: ${body.slice(0, 200)}`);
    }

    const json = await response.json() as { content: { text: string }[] };
    const raw = json.content[0]?.text ?? '';
    const data = parseAIJSON(raw);
    return { success: true, data, raw };
  } catch (err) {
    return {
      success: false,
      data: null,
      raw: '',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ─── JSON parsing (shared by free + API mode) ─────────────────────────────────

/** Strip markdown fences and parse JSON. Throws on failure. */
export function parseAIJSON(raw: string): unknown {
  let text = raw.trim();
  // Strip ```json ... ``` or ``` ... ``` wrapping
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  return JSON.parse(text);
}

/** Validate that a parsed AI response has the minimum expected shape. */
export function validateJDAnalysisResponse(data: unknown): string | null {
  if (!data || typeof data !== 'object') return 'Response is not a JSON object.';
  const obj = data as Record<string, unknown>;
  if (typeof obj['overallScore'] !== 'number') return 'Missing or invalid "overallScore".';
  if (!obj['jobFitAnalysis'] || typeof obj['jobFitAnalysis'] !== 'object')
    return 'Missing "jobFitAnalysis". Make sure you pasted the full response.';
  if (!obj['breakdown'] || typeof obj['breakdown'] !== 'object') return 'Missing "breakdown".';
  return null; // valid
}
