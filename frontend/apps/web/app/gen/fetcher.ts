function getBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  if (typeof process !== "undefined" && process.env?.VITE_API_URL) {
    return process.env.VITE_API_URL;
  }
  return "http://localhost:5000";
}

export async function customFetch<T>(
  url: string,
  options: RequestInit,
): Promise<T> {
  const baseUrl = getBaseUrl();

  const response = await fetch(`${baseUrl}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `${options.method ?? "GET"} ${url}: ${response.status} ${response.statusText}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export default customFetch;
