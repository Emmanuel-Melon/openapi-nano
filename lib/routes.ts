import type {
  OpenApiSchemaNode,
  ResponseMap,
  RouteDefinition,
} from "./types.js";

export function route(def: RouteDefinition): RouteDefinition {
  return def;
}

/**
 * Generates a partial ResponseMap for successful outcomes.
 * Accepts both raw literal objects and structural OpenApiReference pointers safely.
 */
export function response(
  statusCode: number,
  schema: OpenApiSchemaNode,
  description = "Success",
): ResponseMap {
  return {
    [statusCode]: {
      description,
      content: {
        "application/json": {
          schema,
        },
      },
    },
  };
}

export function errors(...statusCodes: number[]): ResponseMap {
  const map: ResponseMap = {};
  const defaultDescriptions: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
  };

  for (const code of statusCodes) {
    map[code] = {
      description: defaultDescriptions[code] || "Error Response",
    };
  }
  return map;
}
