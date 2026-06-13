import { OpenAPIBuilderOptions } from "./types.js";

export function generateOpenApiSpec(
  options: OpenAPIBuilderOptions,
): Record<string, unknown> {
  const paths: Record<string, any> = {};

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

  return {
    openapi: "3.1.0",
    info: {
      title: options.title,
      version: options.version,
      ...(options.description && { description: options.description }),
    },
    paths,
  };
}
