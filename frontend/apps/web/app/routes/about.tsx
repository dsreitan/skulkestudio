import type { Route } from "./+types/about";

export function meta({ matches }: Route.MetaArgs) {
  const id = matches[matches.length - 1]?.id
  return [
    { title: id },
  ];
}

export default function Page() {
  return <main>about</main>;
}
