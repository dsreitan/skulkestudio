import type { Page } from "./types";

const host = "http://localhost:5000";

export const getPages = async (parentId: string) => {
  const res = await fetch(`${host}/api/pages/${parentId}`);

  if (!res.ok) {
    throw new Error(
      `Failed to fetch pages for parentId ${parentId}: ${res.statusText}`
    );
  }

  return (await res.json()) as Page[];
};

export const getPage = async (id: string) => {
  const res = await fetch(`${host}/api/page/${id}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch page with id ${id}: ${res.statusText}`);
  }

  return (await res.json()) as Page;
};
