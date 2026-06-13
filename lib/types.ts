// Core Data Blocks (Schemas & Resources)
export interface OpenApiReference {
  $ref: string;
}

export interface OpenApiSchema {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
  description?: string;
  [key: string]: unknown;
}

export type OpenApiSchemaNode = OpenApiSchema | OpenApiReference;

export interface ResourceDefinition<
  Select extends OpenApiSchema,
  Insert extends OpenApiSchema | undefined = undefined,
  Update extends OpenApiSchema | undefined = undefined,
> {
  select: Select;
  insert?: Insert;
  update?: Update;
}

export interface OpenApiParameter {
  name: string;
  in: "path" | "query" | "header" | "cookie";
  required: boolean;
  description?: string;
  schema: {
    type: "string" | "number" | "integer" | "boolean" | "array";
    [key: string]: unknown;
  };
}

// HTTP Payload Objects (Responses & Transports)
export interface ApiResponse {
  description?: string;
  content?: {
    "application/json"?: {
      schema: OpenApiSchemaNode;
    };
    [mediaType: string]: unknown; // Allows for future expansion (e.g., application/vnd.api+json)
  };
}

export type ResponseMap = Record<number, ApiResponse>;

// Route System Structures
export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  summary: string;
  description?: string;
  tag?: string;
  security?: Record<string, string[]>[];
  parameters?: OpenApiParameter[];
  requestBody?: {
    description?: string;
    content: {
      "application/json": {
        schema: OpenApiSchemaNode;
      };
    };
    required?: boolean;
  };
  responses: ResponseMap;
}

export interface OpenAPIBuilderOptions {
  title: string;
  version: string;
  description?: string;
  components?: {
    schemas?: Record<string, OpenApiSchema | undefined>;
  };
  routes: RouteDefinition[];
}
