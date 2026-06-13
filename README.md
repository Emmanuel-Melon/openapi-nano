# @emelon/openapi-nano

A lightweight, ultra-fast, zero-dependency presentation layer engine for building strict, compliance-ready OpenAPI (Swagger) specifications using pure JavaScript object structures. 100% framework-agnostic design built for modern, cloud-native architectures.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![NPM Version](https://img.shields.io/npm/v/@emelon/openapi-nano)

---

## Installation

```bash
npm install @emelon/openapi-nano
```

## Complete API Lifecycle Integration

Below is an end-to-end example demonstrating how to map data resource shapes, declare clean routes using shorthand response/error helpers, and generate a final document manifest.

```typescript
import {
  resource,
  route,
  response,
  errors,
  generateOpenApiSpec,
} from "@emelon/openapi-nano";

// 1. Define plain OpenAPI object schemas for your domain model
const ShinobiSchema = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    clan: { type: "string" },
  },
  required: ["id", "name"],
};

const CreateShinobiSchema = {
  type: "object" as const,
  properties: {
    name: { type: "string" },
    clan: { type: "string" },
  },
  required: ["name"],
};

// 2. Group schemas together logically as a core domain resource
export const shinobiResource = resource({
  select: ShinobiSchema,
  insert: CreateShinobiSchema,
});

// 3. Declare individual endpoint path operations contextually
export const getShinobiRoute = route({
  method: "get",
  path: "/shinobi/{id}",
  summary: "Get shinobi character details",
  tag: "Shinobi",
  responses: {
    ...response(200, shinobiResource.select, "Character profile found"),
    ...errors(401, 404),
  },
});

export const createShinobiRoute = route({
  method: "post",
  path: "/shinobi",
  summary: "Register a new shinobi character entry",
  tag: "Shinobi",
  requestBody: {
    content: {
      "application/json": {
        schema: shinobiResource.insert,
      },
    },
  },
  responses: {
    ...response(201, shinobiResource.select, "Character registration complete"),
    ...errors(400, 401),
  },
});

// 4. Compile everything together into a valid OpenAPI documentation graph
const apiSpecification = generateOpenApiSpec({
  title: "Hidden Leaf Village Shinobi Directory",
  version: "1.0.0",
  description:
    "Core presentation documentation system for Hidden Leaf Ninja data assets.",
  routes: [getShinobiRoute, createShinobiRoute],
});

// Expose the resulting `apiSpecification` object directly in Express, Fastify, Nest.js,
// or write it out straight to an explicit JSON file on your machine!
console.log(JSON.stringify(apiSpecification, null, 2));
```

## Why openapi-nano?

- 🪶 Zero dependencies – Keeps your deployment footprints clean and small.
- ⚡ No Magic or Overhead – You write plain objects, and it outputs a plain OpenAPI schema tree.
- 🧩 100% Extensible – Because schemas are plain objects, you can append any custom extensions (x-hooks, x-expand) natively without waiting for helper updates.

## License

MIT © [Emmanuel Gatwech](https://github.com/Emmanuel-Melon)