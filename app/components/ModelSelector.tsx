'use client';

import { useState, useRef, useEffect } from 'react';

export interface ModelOption {
  id: string;
  name: string;
  provider: string;
  description?: string;
}

// Free models available on OpenRouter
const MODELS: ModelOption[] = [
  {
    id: 'openrouter/auto',
    name: 'Auto (Best Free)',
    provider: 'OpenRouter',
    description: 'Automatically selects the best free model'
  },
  {
    id: 'openai/gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'Free GPT model'
  },
  {
    id: 'meta-llama/llama-3-8b-instruct',
    name: 'Llama 3 8B',
    provider: 'Meta',
    description: 'Open source, well-tuned'
  },

  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    description: 'Fast Claude model'
  },


  {
    id: 'gryphe/mythomax-l2-13b',
    name: 'MythoMax L2 13B',
    provider: 'Gryphe',
    description: 'Large context, high quality'
  },
  {
    id: 'mistralai/mixtral-8x7b-instruct',
    name: 'Mixtral 8x7B',
    provider: 'Mistral AI',
    description: 'High quality, free model'
  }
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  disabled?: boolean;
}

export default function ModelSelector({
  selectedModel,
  onModelChange,
  disabled = false
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedModelData =
    MODELS.find(m => m.id === selectedModel) || MODELS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);

      // Check if we should open upward
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 224; // max-h-56 = 14rem = 224px

        // Open upward if not enough space below but enough space above
        setOpenUpward(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (modelId: string) => {
    onModelChange(modelId);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-between gap-1 px-2 py-1 text-[10px] font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span className="truncate text-left flex-1 text-[10px]">
          {selectedModelData.name}
        </span>
        <svg
          className={`w-2.5 h-2.5 flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-50 max-h-56 overflow-y-auto ${
            openUpward ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
        >
          <div className="py-0.5">
            {MODELS.map(model => (
              <button
                key={model.id}
                type="button"
                onClick={() => handleSelect(model.id)}
                className={`w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  selectedModel === model.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[10px] truncate">
                      {model.name}
                    </div>
                    <div className="text-[9px] text-gray-500 dark:text-gray-400 truncate">
                      {model.provider}
                    </div>
                  </div>
                  {selectedModel === model.id && (
                    <svg
                      className="w-3 h-3 flex-shrink-0 text-blue-600 dark:text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { MODELS };
