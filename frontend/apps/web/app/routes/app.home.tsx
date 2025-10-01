import { Link } from "react-router";
import type { Route } from "./+types/about.home";

export function meta({ matches }: Route.MetaArgs) {
  const id = matches[matches.length - 1]?.id
  return [
    { title: id },
  ];
}

export default function Page() {
  return <main>
    <div>app</div>
    <header>
      <Link to="/app/page-a">a</Link>
      <Link to="/app/page-b">b</Link>
    </header>
  </main>;
}
