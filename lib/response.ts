import type { ApiResponse, OpenApiSchema } from "./types.js";

export function ok(
  schema: OpenApiSchema,
  description = "Success",
): ApiResponse {
  return {
    description,
    content: {
      "application/json": {
        schema,
      },
    },
  };
}

export function noContent(description = "No Content"): ApiResponse {
  return {
    description,
  };
}
