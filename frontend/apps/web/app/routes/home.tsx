import { Button } from "ui/Button.tsx";
import type { Route } from "./+types/home";

export function meta({ matches }: Route.MetaArgs) {
  const id = matches[matches.length - 1]?.id
  return [
    { title: id },
  ];
}

export default function Page() {
  return (
    <main>
      <div>home</div>
      <Button>UI button</Button>
    </main>
  );
}
