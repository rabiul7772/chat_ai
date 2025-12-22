'use client';

import { useState, useRef, useEffect } from 'react';
import type { Message } from '@/types/chat';
import MessageComponent from './Message';
import ChatInput from './ChatInput';
import Logo from './Logo';
import { MODELS } from './ModelSelector';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );
  // Load selected model from localStorage or use default
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    // Always use the default on initial render to avoid hydration mismatch
    return MODELS[0].id; // Default to Auto (Best Free)
  });

  // Sync with localStorage after component mounts (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedModel');
      if (saved && MODELS.some(m => m.id === saved)) {
        setSelectedModel(saved);
      }
    }
  }, []); // Run only once on mount
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Persist model selection to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedModel', selectedModel);
    }
  }, [selectedModel]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Create a placeholder assistant message for streaming
    const assistantMessageId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setStreamingMessageId(assistantMessageId);

    try {
      const formattedMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Use streaming endpoint
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: formattedMessages,
          model: selectedModel
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || 'Failed to get response from AI');
        setIsLoading(false);
        // Remove the empty assistant message on error
        setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
        return;
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // Decode the chunk
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6); // Remove "data: " prefix

            if (data === '[DONE]') {
              break;
            }

            try {
              const json = JSON.parse(data);
              const content = json.content;

              if (content) {
                accumulatedContent += content;
                // Update the assistant message incrementally
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
                // Auto-scroll as content streams in
                setTimeout(scrollToBottom, 0);
              }
            } catch (e) {
              // Skip invalid JSON
              console.error('Error parsing stream data:', e);
            }
          }
        }
      }

      // Finalize the message
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, content: accumulatedContent }
            : msg
        )
      );
      setStreamingMessageId(null);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error sending message:', err);
      // Remove the empty assistant message on error
      setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
      setStreamingMessageId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-300 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8 flex-shrink-0" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Chat AI
            </h1>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Clear Chat
            </button>
          )}
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Start a conversation
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Send a message to begin chatting with the AI assistant.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map(message => (
              <MessageComponent
                key={message.id}
                message={message}
                isStreaming={streamingMessageId === message.id}
              />
            ))}
            {/* Loading indicator only shows if no assistant message is being streamed */}
            {isLoading &&
              !messages.some(
                msg => msg.role === 'assistant' && msg.content === ''
              ) && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-200 dark:bg-gray-800 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div
                          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-6 py-2 bg-red-100 dark:bg-red-900/30 border-t border-red-300 dark:border-red-700">
          <p className="text-sm text-red-800 dark:text-red-200">
            Error: {error}
          </p>
        </div>
      )}

      {/* Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />
    </div>
  );
}
