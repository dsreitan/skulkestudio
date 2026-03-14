import { defineConfig } from "orval";

export default defineConfig({
  skulkestudio: {
    input: {
      target: "./openapi.json",
    },
    output: {
      target: "./app/gen/api.ts",
      schemas: "./app/gen/schemas",
      client: "react-query",
      mode: "tags-split",
      override: {
        mutator: {
          path: "./app/gen/fetcher.ts",
          name: "customFetch",
        },
        zod: {
          strict: { body: true, response: true, param: true, query: true },
          generateEachHttpStatus: true,
        },
      },
    },
  },
  skulkestudioZod: {
    input: {
      target: "./openapi.json",
    },
    output: {
      target: "./app/gen/zod",
      client: "zod",
      mode: "tags-split",
      fileExtension: ".zod.ts",
      override: {
        zod: {
          strict: { body: true, response: true, param: true, query: true },
          generateEachHttpStatus: true,
        },
      },
    },
  },
});
