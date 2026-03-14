import type { Config } from "@react-router/dev/config";
import { getSections, getPages } from "./app/api";

export default {
  ssr: false,
  buildDirectory: "dist",

  async prerender() {
    const sections = await getSections();

    const childPaths = await Promise.all(
      sections.map(async (section) => {
        const children = await getPages(section.id);
        return children.map((child) => `/${child.id}`);
      }),
    );

    return [
      "/",
      ...sections.map((s) => `/${s.id}`),
      ...childPaths.flat(),
    ];
  },
} satisfies Config;
