import type { Page } from "./types";

function getApiHost(): string {
  // In the browser, always use relative URLs. During dev Vite proxies
  // /api/* to the .NET backend; in production the .NET server serves
  // both the static files and the API on the same origin.
  if (typeof window !== "undefined") return "";

  // During build / prerender (Node context) we need a full URL.
  if (typeof process !== "undefined" && process.env?.VITE_API_URL) {
    return process.env.VITE_API_URL;
  }
  return "http://localhost:5000";
}

export const getPages = async (parentId: string) => {
  const res = await fetch(`${getApiHost()}/api/pages/${parentId}`);

  if (!res.ok) {
    throw new Error(
      `Failed to fetch pages for parentId ${parentId}: ${res.statusText}`,
    );
  }

  return (await res.json()) as Page[];
};

export const getPage = async (id: string) => {
  const res = await fetch(`${getApiHost()}/api/page/${id}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch page with id ${id}: ${res.statusText}`);
  }

  return (await res.json()) as Page;
};
