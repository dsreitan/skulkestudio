import { getPage } from "../../api";
import type { Route } from "./+types/$id";

export async function loader({ params }: Route.LoaderArgs) {
  return getPage(`${params.section}/${params.id}`);
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return getPage(`${params.section}/${params.id}`);
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: loaderData.title }];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <h1>{loaderData.title}</h1>
      <div>{loaderData.content}</div>
    </main>
  );
}
