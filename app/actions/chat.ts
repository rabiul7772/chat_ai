'use server';

import type { Message } from '@/types/chat';

export async function sendMessage(
  messages: Omit<Message, 'id' | 'timestamp'>[],
  model?: string
): Promise<{ message: Message; error?: string }> {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    console.log(apiKey);
    if (!apiKey) {
      return {
        message: {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: '',
          timestamp: new Date()
        },
        error: 'Server configuration error'
      };
    }

    const defaultModel =
      process.env.OPENROUTER_DEFAULT_MODEL || 'openai/gpt-3.5-turbo';
    const selectedModel = model || defaultModel;

    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer':
            process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'Chat AI'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: formattedMessages
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        message: {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: '',
          timestamp: new Date()
        },
        error: errorData.error?.message || 'Failed to get response from AI'
      };
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      return {
        message: {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: '',
          timestamp: new Date()
        },
        error: 'Invalid response from AI'
      };
    }

    const responseMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: assistantMessage,
      timestamp: new Date()
    };

    return { message: responseMessage };
  } catch (error) {
    console.error('Send message error:', error);
    return {
      message: {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        timestamp: new Date()
      },
      error: 'Network error. Please try again.'
    };
  }
}
