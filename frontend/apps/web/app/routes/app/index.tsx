import { Button } from "ui/Button.tsx";
import type { Route } from "./+types/index";

export function meta({ matches }: Route.MetaArgs) {
  const id = matches[matches.length - 1]?.id;
  return [{ title: id }];
}

export default function Page() {
  return (
    <main>
      <h1>app</h1>
      <div>Innlogga SPA.</div>
      <Button>UI button funker i SPA</Button>
    </main>
  );
}
