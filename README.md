# Chat AI - OpenRouter AI Integration

A production-grade chat application built with Next.js 14 App Router, TypeScript, and Tailwind CSS, integrated with OpenRouter AI.

## Features

- ✅ Server-side API calls (no API keys exposed to client)
- ✅ TypeScript for type safety
- ✅ Modern UI with Tailwind CSS
- ✅ Message history with user and assistant roles
- ✅ Loading states and error handling
- ✅ Empty state handling
- ✅ Responsive design with dark mode support
- ✅ Clean component separation (server/client)

## Project Structure

```
chat_app/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API route handler for OpenRouter
│   ├── actions/
│   │   └── chat.ts               # Server action for chat
│   ├── components/
│   │   ├── Chat.tsx              # Main chat component (client)
│   │   ├── ChatInput.tsx         # Input component (client)
│   │   └── Message.tsx           # Message display component (client)
│   ├── globals.css               # Global styles with Tailwind
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── types/
│   └── chat.ts                   # TypeScript type definitions
├── .env.local             # Environment variables template
├── next.config.mjs               # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies

```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your OpenRouter API key:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_DEFAULT_MODEL=openai/gpt-3.5-turbo
```

**Getting an API Key:**

1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up or log in
3. Navigate to [API Keys](https://openrouter.ai/keys)
4. Create a new API key
5. Copy the key to your `.env.local` file

**Available Models:**

- `openai/gpt-3.5-turbo` (default, cost-effective)
- `openai/gpt-4` (more capable)
- `anthropic/claude-3-opus` (high quality)
- `anthropic/claude-3-sonnet` (balanced)
- See [OpenRouter Models](https://openrouter.ai/models) for full list

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Data Flow

### 1. User Input

- User types a message in `ChatInput` component
- Message is sent to `Chat` component via `handleSendMessage`

### 2. Client Component (`Chat.tsx`)

- Creates a user message object
- Adds it to local state
- Calls server action `sendMessage` with message history

### 3. Server Action (`app/actions/chat.ts`)

- Formats messages for API
- Makes HTTP request to `/api/chat` route handler
- Returns response or error

### 4. API Route Handler (`app/api/chat/route.ts`)

- Validates request
- Retrieves API key from environment variables
- Formats messages for OpenRouter API
- Makes authenticated request to OpenRouter
- Returns assistant response

### 5. Response Handling

- Response flows back through server action → client component
- Assistant message is added to state
- UI updates with new message
- Loading state is cleared

## Security Features

- ✅ API keys stored in environment variables (never exposed to client)
- ✅ All API calls happen on the server
- ✅ Server-side validation and error handling
- ✅ No sensitive data in client-side code
