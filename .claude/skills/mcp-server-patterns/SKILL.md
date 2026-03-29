---
name: mcp-server-patterns
description: Build MCP servers with Node/TypeScript SDK — tools, resources, prompts, Zod validation, stdio vs Streamable HTTP.
origin: ECC (everything-claude-code)
---

# MCP Server Patterns

The Model Context Protocol (MCP) lets AI assistants call tools, read resources, and use prompts from your server.

## When to Use

- Implementing a new MCP server
- Adding tools or resources to an existing server
- Choosing stdio vs HTTP transport
- Upgrading the SDK
- Debugging MCP registration and transport issues

## Core Concepts

- **Tools**: Actions the model can invoke (e.g. search, run a command)
- **Resources**: Read-only data the model can fetch (e.g. file contents, API responses)
- **Prompts**: Reusable, parameterised prompt templates
- **Transport**: stdio for local clients; Streamable HTTP for remote

## Setup

```bash
npm install @modelcontextprotocol/sdk zod
```

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({ name: "casasvigo-mcp", version: "1.0.0" });
```

## Registering Tools

```typescript
server.tool(
  "search-rooms",
  "Search available rooms by criteria",
  {
    flat_id: z.string().optional().describe("Filter by flat ID"),
    max_price: z.number().optional().describe("Maximum monthly price"),
    status: z.enum(["available", "occupied", "reserved"]).optional()
  },
  async ({ flat_id, max_price, status }) => {
    const rooms = await searchRooms({ flat_id, max_price, status });
    return {
      content: [{ type: "text", text: JSON.stringify(rooms, null, 2) }]
    };
  }
);
```

## Registering Resources

```typescript
server.resource(
  "property-list",
  "casasvigo://properties",
  "List of all managed properties",
  async (uri) => ({
    contents: [{
      uri: uri.href,
      mimeType: "application/json",
      text: JSON.stringify(await getProperties())
    }]
  })
);

// Dynamic resource with URI template
server.resource(
  "room-details",
  "casasvigo://rooms/{roomId}",
  "Details for a specific room",
  async (uri) => {
    const roomId = uri.pathname.split("/").pop();
    const room = await getRoom(roomId);
    return {
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify(room)
      }]
    };
  }
);
```

## Transport: stdio vs HTTP

### stdio (local clients like Claude Desktop/Code)

```typescript
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const transport = new StdioServerTransport();
await server.connect(transport);
```

### Streamable HTTP (remote clients)

For Cursor, cloud, or other remote clients. Keep server logic independent of transport so you can plug in stdio or HTTP in the entrypoint.

## Best Practices

- **Schema first**: Define input schemas for every tool; document parameters and return shape
- **Errors**: Return structured errors the model can interpret; avoid raw stack traces
- **Idempotency**: Prefer idempotent tools where possible so retries are safe
- **Rate and cost**: For tools that call external APIs, consider rate limits and cost
- **Versioning**: Pin SDK version in package.json
- **Keep tools focused**: One tool = one action
- **Use descriptions**: Good descriptions help the model choose the right tool
