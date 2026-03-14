import type { Page } from "./types";

function getApiHost(): string {
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
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
