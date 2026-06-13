// Core Data Blocks (Schemas & Resources)

export interface OpenApiSchema {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
  description?: string;
  [key: string]: unknown; // Allows for custom OpenAPI extensions (e.g., x-expand)
}

export interface ResourceDefinition<
  Select extends OpenApiSchema,
  Insert extends OpenApiSchema | undefined = undefined,
  Update extends OpenApiSchema | undefined = undefined,
> {
  select: Select;
  insert?: Insert;
  update?: Update;
}

// HTTP Payload Objects (Responses & Transports)

export interface ApiResponse {
  description?: string;
  content?: {
    "application/json"?: {
      schema: OpenApiSchema;
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
  requestBody?: {
    description?: string;
    content: {
      "application/json": {
        schema: OpenApiSchema;
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
  routes: RouteDefinition[];
}
