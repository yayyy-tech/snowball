import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export async function callClaude(
  messages: ClaudeMessage[],
  options: ClaudeOptions = {}
): Promise<string> {
  const {
    model = 'claude-opus-4-1',
    maxTokens = 4096,
    temperature = 0.7,
    systemPrompt,
  } = options;

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const firstContent = response.content[0];
    if (firstContent.type === 'text') {
      return firstContent.text;
    }

    throw new Error('Unexpected response format from Claude');
  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error(`Claude API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function callClaudeWithRetry(
  messages: ClaudeMessage[],
  options: ClaudeOptions = {},
  maxRetries = 3
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await callClaude(messages, options);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.error(`Claude API attempt ${attempt} failed:`, lastError.message);
      
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Claude API call failed after retries');
}

export async function streamClaude(
  messages: ClaudeMessage[],
  options: ClaudeOptions = {},
  onChunk: (chunk: string) => void
): Promise<void> {
  const {
    model = 'claude-opus-4-1',
    maxTokens = 4096,
    temperature = 0.7,
    systemPrompt,
  } = options;

  try {
    const stream = await anthropic.messages.stream({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        onChunk(chunk.delta.text);
      }
    }
  } catch (error) {
    console.error('Claude streaming error:', error);
    throw new Error(`Claude streaming failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
