import type { OpenApiSchema } from "./types.js";

export interface JsonApiResourceOptions {
  type: string;
  pascalName: string;
  schema: OpenApiSchema;
}

export interface JsonApiCompiledSchemas {
  resourceSchema: OpenApiSchema;
  singleResponseSchema: OpenApiSchema;
  collectionResponseSchema: OpenApiSchema;
}

export function compileJsonApiSchemas(
  options: JsonApiResourceOptions,
): JsonApiCompiledSchemas {
  const resourceSchema: OpenApiSchema = {
    type: "object",
    properties: {
      type: { type: "string", example: options.type },
      id: { type: "string" },
      attributes: {
        type: "object",
        properties: options.schema.properties,
        required: options.schema.required,
      },
      relationships: {
        type: "object",
        additionalProperties: {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                type: { type: "string" },
                id: { type: "string" },
              },
            },
          },
        },
      },
      links: {
        type: "object",
        properties: {
          self: { type: "string" },
        },
      },
    },
    required: ["type", "id", "attributes"],
  };

  const singleResponseSchema: OpenApiSchema = {
    type: "object",
    properties: {
      jsonapi: {
        type: "object",
        properties: { version: { type: "string", example: "1.0" } },
      },
      data: resourceSchema,
      included: {
        type: "array",
        items: { type: "object", additionalProperties: true },
      },
      links: {
        type: "object",
        properties: { self: { type: "string" } },
      },
    },
    required: ["data"],
  };

  const collectionResponseSchema: OpenApiSchema = {
    type: "object",
    properties: {
      jsonapi: {
        type: "object",
        properties: { version: { type: "string", example: "1.0" } },
      },
      data: {
        type: "array",
        items: resourceSchema,
      },
      included: {
        type: "array",
        items: { type: "object", additionalProperties: true },
      },
      links: {
        type: "object",
        properties: {
          self: { type: "string" },
          first: { type: "string" },
          last: { type: "string" },
        },
      },
    },
    required: ["data"],
  };

  return {
    resourceSchema,
    singleResponseSchema,
    collectionResponseSchema,
  };
}
