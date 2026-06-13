import type { ResourceDefinition, OpenApiSchema } from "./types.js";

export function resource<
  Select extends OpenApiSchema,
  Insert extends OpenApiSchema | undefined = undefined,
  Update extends OpenApiSchema | undefined = undefined,
>(
  config: ResourceDefinition<Select, Insert, Update>,
): ResourceDefinition<Select, Insert, Update> {
  return config;
}
