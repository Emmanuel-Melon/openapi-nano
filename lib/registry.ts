import type { OpenAPIBuilderOptions } from "./types.js";

export function generateOpenApiSpec(
  options: OpenAPIBuilderOptions,
): Record<string, unknown> {
  const paths: Record<string, Record<string, unknown>> = {};

  for (const route of options.routes) {
    if (!paths[route.path]) {
      paths[route.path] = {};
    }

    paths[route.path][route.method] = {
      summary: route.summary,
      ...(route.description && { description: route.description }),
      ...(route.tag && { tags: [route.tag] }),
      ...(route.security && { security: route.security }),
      ...(route.parameters && { parameters: route.parameters }),
      ...(route.requestBody && { requestBody: route.requestBody }),
      responses: route.responses,
    };
  }

  const cleanComponents = options.components?.schemas
    ? {
        schemas: Object.fromEntries(
          Object.entries(options.components.schemas).filter(
            ([_, schema]) => schema !== undefined,
          ),
        ),
      }
    : undefined;

  return {
    openapi: "3.1.0",
    info: {
      title: options.title,
      version: options.version,
      ...(options.description && { description: options.description }),
    },
    ...(cleanComponents && { components: cleanComponents }),
    paths,
  };
}
