# Streaming Responses Implementation Guide

## Overview

This application implements **streaming responses** using ReadableStream and Server-Sent Events (SSE) to provide real-time AI responses. Instead of waiting for the complete response, users see the AI's message appear word-by-word as it's generated.

## Architecture Flow

```
┌─────────────┐
│   Client    │
│  (Chat.tsx) │
└──────┬──────┘
       │ POST /api/chat/stream
       │ { messages: [...] }
       ▼
┌─────────────────────┐
│  API Route Handler   │
│ (/api/chat/stream)  │
└──────┬──────────────┘
       │ POST to OpenRouter
       │ stream: true
       ▼
┌─────────────────────┐
│   OpenRouter API    │
│  (Streaming SSE)    │
└──────┬──────────────┘
       │ SSE chunks:
       │ data: {"choices":[...]}\n\n
       ▼
┌─────────────────────┐
│  ReadableStream     │
│  (Processes SSE)   │
└──────┬──────────────┘
       │ Parsed chunks:
       │ data: {"content":"..."}\n\n
       ▼
┌─────────────────────┐
│   Client Reader     │
│  (Updates UI)       │
└─────────────────────┘
```

## How It Works

### 1. Client Initiates Stream (`Chat.tsx`)

```typescript
// Create placeholder assistant message
const assistantMessage: Message = {
  id: assistantMessageId,
  role: 'assistant',
  content: '', // Empty initially
  timestamp: new Date()
};

// Make streaming request
const response = await fetch('/api/chat/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: formattedMessages })
});
```

### 2. API Route Creates ReadableStream (`app/api/chat/stream/route.ts`)

The route handler:
- Makes a streaming request to OpenRouter with `stream: true`
- Creates a `ReadableStream` to process the response
- Reads chunks from OpenRouter's SSE stream
- Parses each chunk and extracts content
- Streams parsed content back to the client

```typescript
const stream = new ReadableStream({
  async start(controller) {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      // Process SSE format: "data: {...}\n\n"
      const buffer += decoder.decode(value);
      // Parse and extract content
      // Enqueue to client: "data: {"content":"..."}\n\n"
    }
  }
});
```

### 3. OpenRouter SSE Format

OpenRouter sends Server-Sent Events in this format:

```
data: {"id":"...","choices":[{"delta":{"content":"Hello"}}]}\n\n
data: {"id":"...","choices":[{"delta":{"content":" world"}}]}\n\n
data: {"id":"...","choices":[{"delta":{"content":"!"}}]}\n\n
data: [DONE]\n\n
```

### 4. Our Processing

We extract the `delta.content` from each chunk and reformat:

```
data: {"content":"Hello"}\n\n
data: {"content":" world"}\n\n
data: {"content":"!"}\n\n
```

### 5. Client Reads Stream (`Chat.tsx`)

```typescript
const reader = response.body?.getReader();
const decoder = new TextDecoder();
let accumulatedContent = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  // Parse "data: {...}\n\n"
  const json = JSON.parse(data);
  accumulatedContent += json.content;
  
  // Update React state incrementally
  setMessages(prev =>
    prev.map(msg =>
      msg.id === assistantMessageId
        ? { ...msg, content: accumulatedContent }
        : msg
    )
  );
}
```

## Key Concepts

### ReadableStream

A browser API that allows reading data asynchronously in chunks. Perfect for streaming responses.

```typescript
const stream = new ReadableStream({
  async start(controller) {
    // Read from source
    // controller.enqueue(data) - send chunk to client
    // controller.close() - end stream
  }
});
```

### Server-Sent Events (SSE)

A standard format for streaming text data:
- Format: `data: {json}\n\n`
- Each line starting with `data: ` contains JSON
- Double newline (`\n\n`) separates events
- `[DONE]` signals end of stream

### TextDecoder

Converts binary chunks (Uint8Array) to text strings:

```typescript
const decoder = new TextDecoder();
const text = decoder.decode(binaryChunk, { stream: true });
```

The `stream: true` option handles multi-byte characters that might be split across chunks.

## Benefits

1. **Better UX**: Users see responses in real-time
2. **Perceived Performance**: Feels faster even for long responses
3. **Lower Latency**: First token appears immediately
4. **Progressive Loading**: Can start reading before completion

## Error Handling

- Network errors: Caught and displayed to user
- Parsing errors: Invalid JSON chunks are skipped
- Stream errors: Controller.error() closes stream gracefully
- Empty responses: Placeholder message is removed on error

## Performance Considerations

- **Auto-scrolling**: Uses `setTimeout` to batch scroll updates
- **State Updates**: React batches multiple rapid updates
- **Memory**: Accumulated content stored in state (consider limits for very long responses)

## Testing

To test streaming:
1. Send a message that will generate a long response
2. Watch the response appear word-by-word
3. Verify auto-scrolling works
4. Test error scenarios (network issues, invalid API key)

## Fallback to Non-Streaming

If you need to switch back to non-streaming:
1. Modify `Chat.tsx` to use `sendMessage` from `app/actions/chat.ts`
2. Remove the streaming fetch logic
3. The non-streaming endpoint (`/api/chat/route.ts`) is still available

## Troubleshooting

**Stream not working?**
- Check browser console for errors
- Verify OpenRouter API key is set
- Check network tab for streaming response
- Ensure `stream: true` is sent to OpenRouter

**Content not updating?**
- Verify ReadableStream is being read
- Check SSE parsing logic
- Ensure React state updates are happening

**Performance issues?**
- Consider debouncing state updates
- Limit max response length
- Add request cancellation support

