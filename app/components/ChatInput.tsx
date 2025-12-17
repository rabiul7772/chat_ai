'use client';

import { useState, useRef, useEffect } from 'react';
import ModelSelector from './ModelSelector';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
}

export default function ChatInput({
  onSendMessage,
  disabled,
  selectedModel,
  onModelChange
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"
    >
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {/* Model Selector */}
        {selectedModel && onModelChange && (
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Model:
            </span>
            <div className="flex-1 max-w-[200px]">
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={onModelChange}
                disabled={disabled}
              />
            </div>
          </div>
        )}
        <div className="flex gap-2 sm:gap-3 items-center">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={disabled}
            rows={1}
            className="flex-1 min-h-[44px] sm:min-h-[44] max-h-[200] resize-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all leading-relaxed scrollbar-hide-desktop overflow-y-auto"
          />
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className="shrink-0 h-[44px] sm:h-[44] min-h-[44px] sm:min-h-[44] rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md disabled:shadow-none flex items-center justify-center"
          >
            <span>Send</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 px-1 hidden sm:block">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </form>
  );
}
