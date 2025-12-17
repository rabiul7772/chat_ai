# Folder Structure

```
chat_app/
├── app/                          # Next.js 14 App Router directory
│   ├── api/                      # API Routes (Server-side)
│   │   └── chat/
│   │       └── route.ts          # POST handler for OpenRouter API calls
│   ├── actions/                  # Server Actions
│   │   └── chat.ts               # Server action for sending messages
│   ├── components/               # React Components
│   │   ├── Chat.tsx              # Main chat UI (Client Component)
│   │   ├── ChatInput.tsx         # Message input component (Client)
│   │   └── Message.tsx           # Individual message display (Client)
│   ├── globals.css               # Global styles with Tailwind directives
│   ├── layout.tsx                # Root layout (Server Component)
│   └── page.tsx                  # Home page (Server Component)
├── types/                        # TypeScript type definitions
│   └── chat.ts                   # Message, ChatRequest, ChatResponse types
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.mjs            # PostCSS configuration for Tailwind
├── tsconfig.json                 # TypeScript configuration
├── README.md                     # Project documentation
└── FOLDER_STRUCTURE.md           # This file
```

## Component Types

### Server Components (Default)
- `app/layout.tsx` - Root layout
- `app/page.tsx` - Home page

### Client Components (`"use client"`)
- `app/components/Chat.tsx` - Manages chat state and message flow
- `app/components/ChatInput.tsx` - Handles user input
- `app/components/Message.tsx` - Displays individual messages

### API Routes (Server-side)
- `app/api/chat/route.ts` - Handles POST requests to OpenRouter

### Server Actions (`"use server"`)
- `app/actions/chat.ts` - Server-side function for sending messages

