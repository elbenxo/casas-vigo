---
name: claude-api
description: Anthropic Claude API patterns for TypeScript and Python. Covers Messages API, streaming, tool use, vision, extended thinking, batches, prompt caching, and agent loops.
origin: ECC (everything-claude-code)
---

# Claude API

Build applications with the Anthropic Claude API and SDKs.

## When to Activate

- Building applications that call the Claude API
- Code imports `anthropic` or `@anthropic-ai/sdk`
- Implementing agent workflows or tool use
- Optimizing API costs, token usage, or latency

## Model Selection

| Model | ID | Best For |
|-------|-----|----------|
| Opus 4.6 | `claude-opus-4-6` | Complex reasoning, architecture |
| Sonnet 4.6 | `claude-sonnet-4-6` | Balanced coding tasks |
| Haiku 4.5 | `claude-haiku-4-5-20251001` | Fast, high-volume, cost-sensitive |

## TypeScript SDK

```bash
npm install @anthropic-ai/sdk
```

```typescript
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

const message = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello" }],
});
```

### Streaming

```typescript
const stream = client.messages.stream({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Write a haiku" }],
});

for await (const event of stream) {
  if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
    process.stdout.write(event.delta.text);
  }
}
```

## Tool Use

```typescript
const tools = [{
  name: "search_rooms",
  description: "Search available rooms",
  input_schema: {
    type: "object",
    properties: {
      max_price: { type: "number" },
      status: { type: "string", enum: ["available", "occupied"] }
    }
  }
}];

const message = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  tools,
  messages: [{ role: "user", content: "Show available rooms under 350 EUR" }]
});

for (const block of message.content) {
  if (block.type === "tool_use") {
    const result = await searchRooms(block.input);
    // Send tool_result back to continue conversation
  }
}
```

## Prompt Caching

```typescript
const message = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  system: [
    { type: "text", text: largeSystemPrompt, cache_control: { type: "ephemeral" } }
  ],
  messages: [{ role: "user", content: "Question" }]
});
```

## Agentic Loop

```typescript
let messages = [{ role: "user", content: "Review the tenant contract" }];

while (true) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    tools,
    messages,
  });
  if (response.stop_reason === "end_turn") break;
  messages.push({ role: "assistant", content: response.content });
  // Execute tools and append tool_result messages
}
```

## Cost Optimization

| Strategy | Savings |
|----------|---------|
| Prompt caching | Up to 90% on cached tokens |
| Batches API | 50% |
| Haiku vs Sonnet | ~75% |
| Shorter max_tokens | Variable |

## Error Handling

```typescript
try {
  const message = await client.messages.create({ ... });
} catch (error) {
  if (error instanceof Anthropic.RateLimitError) await sleep(60000);
  else if (error instanceof Anthropic.APIError) console.error(error.status, error.message);
}
```

Never hardcode API keys. Always use environment variables.
