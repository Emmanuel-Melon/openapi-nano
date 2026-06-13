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

Below is an end-to-end example demonstrating how to organize domain types, declare clean paths with structural `$ref` component pointers using shorthand helpers, and compile a final deduplicated document manifest tree.

### 1. Define Domain Blueprints (`shinobi.types.ts`)

```typescript
import { resource } from "@emelon/openapi-nano";

const ShinobiSelectSchema = {
  type: "object" as const,
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    clan: { type: "string" },
  },
  required: ["id", "name"],
};

const ShinobiInsertSchema = {
  type: "object" as const,
  properties: {
    name: { type: "string" },
    clan: { type: "string" },
  },
  required: ["name"],
};

export const shinobiResource = resource({
  select: ShinobiSelectSchema,
  insert: ShinobiInsertSchema,
});
```

### 2. Declare Path Presentation Layers (`shinobi.docs.ts`)

```typescript
import { route, response, errors } from "@emelon/openapi-nano";
import type { OpenApiReference } from "@emelon/openapi-nano";

// Use standard type-safe pointers to reference shared components
const SHINOBI_REF: OpenApiReference = { $ref: "#/components/schemas/Shinobi" };
const SHINOBI_INSERT_REF: OpenApiReference = {
  $ref: "#/components/schemas/ShinobiInsert",
};

export const getShinobiDoc = route({
  method: "get",
  path: "/shinobi/{id}",
  summary: "Get shinobi character details",
  tag: "Shinobi v1",
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      description: "The unique registration ID of the character",
      schema: { type: "string" },
    },
  ],
  responses: {
    ...response(200, SHINOBI_REF, "Character profile found safely"),
    ...errors(401, 404),
  },
});

export const createShinobiDoc = route({
  method: "post",
  path: "/shinobi",
  summary: "Register a new shinobi character",
  tag: "Shinobi v1",
  requestBody: {
    content: {
      "application/json": {
        schema: SHINOBI_INSERT_REF,
      },
    },
  },
  responses: {
    ...response(201, SHINOBI_REF, "Character registration complete"),
    ...errors(400, 401),
  },
});

export const shinobiDocSuite = [getShinobiDoc, createShinobiDoc];
```

### 3. Compile the Standard OpenAPI Tree (`openapi.ts`)

```typescript
import { generateOpenApiSpec } from "@emelon/openapi-nano";
import { shinobiDocSuite } from "./shinobi.docs.js";
import { shinobiResource } from "./shinobi.types.js";

export const standardSpecification = generateOpenApiSpec({
  title: "Hidden Leaf Village API Docs",
  version: "1.0.0",
  description: "Enterprise domain-driven data presentation schemas.",
  components: {
    schemas: {
      // Registering here assigns pointers used by your paths automatically
      Shinobi: shinobiResource.select,
      ShinobiInsert: shinobiResource.insert,
    },
  },
  routes: [...shinobiDocSuite],
});
```

---

## Advanced Ecosystem Modules

### JSON:API Specification Extensions (`@emelon/openapi-nano/jsonapi`)

If you are leveraging a strict JSON:API architecture (e.g., using `@emelon/jsonapi-nano`), you can import our subpath compiler module. This module instantly projects your domain resource configurations into valid top-level compound documents containing `data`, `attributes`, `relationships`, and `links` arrays without structural code duplication:

```typescript
import { generateOpenApiSpec } from "@emelon/openapi-nano";
import { compileJsonApiSchemas } from "@emelon/openapi-nano/jsonapi";
import { shinobiDocSuite } from "./shinobi.docs.js";
import { shinobiResource } from "./shinobi.types.js";

// Compiles fully wrapped resource, singleResponse, and collectionResponse documentation schemas
const shinobiJsonApiSuite = compileJsonApiSchemas({
  type: "shinobi",
  pascalName: "Shinobi",
  schema: shinobiResource.select,
});

export const jsonApiSpecification = generateOpenApiSpec({
  title: "Hidden Leaf Village API Docs (JSON:API Compliant)",
  version: "1.0.0",
  components: {
    schemas: {
      ShinobiInsert: shinobiResource.insert,
      ShinobiObject: shinobiJsonApiSuite.resourceSchema,
      ShinobiSingleResponse: shinobiJsonApiSuite.singleResponseSchema,
      ShinobiCollectionResponse: shinobiJsonApiSuite.collectionResponseSchema,
    },
  },
  routes: shinobiDocSuite,
});
```

---

## Why openapi-nano?

- 🪶 **Zero dependencies** – Keeps your deployment footprints clean and small.
- ⚡ **No Magic or Overhead** – You write plain objects, and it outputs a plain OpenAPI schema tree.
- 🧩 **100% Extensible** – Because schemas are plain objects, you can append any custom extensions (`x-hooks`, `x-expand`) natively without waiting for helper updates.
- 🗜️ **Deduplicated Payload Structure** – Native support for shared `components.schemas` definitions using type-safe structural `$ref` references.

## License

MIT © [Emmanuel Gatwech](https://github.com/Emmanuel-Melon)
