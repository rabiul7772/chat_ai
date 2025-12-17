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
├── .env.example                  # Environment variables template
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

### 5. Tailwind CSS v4 Setup

- Tailwind is imported in `app/globals.css` via `@import "tailwindcss";`.
- PostCSS uses the official `@tailwindcss/postcss` plugin (see `postcss.config.mjs`).
- No `tailwind.config` file is required unless you need custom theming; use `@theme` blocks in CSS when needed.

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

## Key Components

### Server Components
- `app/layout.tsx` - Root layout (server component)
- `app/page.tsx` - Home page (server component)

### Client Components
- `app/components/Chat.tsx` - Main chat interface with state management
- `app/components/ChatInput.tsx` - Message input with auto-resize
- `app/components/Message.tsx` - Individual message display

### API Routes
- `app/api/chat/route.ts` - OpenRouter API integration

### Server Actions
- `app/actions/chat.ts` - Server-side message handling

## Customization

### Change Default Model

Edit `.env.local`:
```env
OPENROUTER_DEFAULT_MODEL=anthropic/claude-3-opus
```

### Modify UI Styling

Edit `app/globals.css` or component files. Tailwind utility classes are used throughout.

### Add Features

- **Streaming responses**: ✅ Already implemented! See [Streaming Responses](#streaming-responses) section below
- **Model selection**: Add a dropdown in `Chat.tsx` to select models
- **Message persistence**: Add database integration (e.g., PostgreSQL, MongoDB)
- **User authentication**: Add NextAuth.js or similar

## Streaming Responses

The application now supports **streaming responses** using ReadableStream and Server-Sent Events (SSE). This provides a better user experience by displaying the AI's response as it's being generated, rather than waiting for the complete response.

### How Streaming Works

#### 1. **Client Request** (`Chat.tsx`)
- User sends a message
- Client creates a placeholder assistant message
- Makes a POST request to `/api/chat/stream`

#### 2. **API Route Handler** (`app/api/chat/stream/route.ts`)
- Receives the request and validates it
- Makes a streaming request to OpenRouter API with `stream: true`
- Creates a `ReadableStream` to pipe the response
- Processes Server-Sent Events (SSE) format from OpenRouter
- Parses each chunk: `data: {"choices":[{"delta":{"content":"..."}}]}`
- Streams parsed content chunks back to the client

#### 3. **Stream Processing**
```typescript
// OpenRouter sends SSE format:
// data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n
// data: {"choices":[{"delta":{"content":" world"}}]}\n\n
// data: [DONE]\n\n

// Our handler extracts the content and streams it:
// data: {"content":"Hello"}\n\n
// data: {"content":" world"}\n\n
```

#### 4. **Client-Side Streaming** (`Chat.tsx`)
- Reads the stream using `response.body.getReader()`
- Decodes chunks as they arrive
- Parses SSE format (`data: {...}`)
- Updates the assistant message incrementally
- Auto-scrolls as content streams in
- Finalizes the message when stream completes

### Benefits of Streaming

1. **Better UX**: Users see responses appear in real-time
2. **Perceived Performance**: Feels faster even for long responses
3. **Progressive Loading**: Can start reading before the full response arrives
4. **Lower Latency**: First token appears faster than waiting for complete response

### Technical Details

- **ReadableStream**: Browser API for handling streaming data
- **Server-Sent Events (SSE)**: Standard format for streaming text data
- **TextDecoder**: Decodes binary chunks to text
- **Incremental Updates**: React state updates as chunks arrive

### Fallback

The non-streaming endpoint (`/api/chat/route.ts`) is still available if you need to switch back. Simply modify `Chat.tsx` to use the non-streaming `sendMessage` server action instead of the streaming fetch call.

## Troubleshooting

### "Server configuration error"
- Ensure `OPENROUTER_API_KEY` is set in `.env.local`
- Restart the dev server after adding environment variables

### "Failed to get response from AI"
- Check your API key is valid
- Verify you have credits on OpenRouter
- Check the model name is correct

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npm run lint`

## License

MIT

