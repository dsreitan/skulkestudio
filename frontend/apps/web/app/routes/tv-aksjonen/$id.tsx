import { getPage } from "../../api";
import type { Route } from "./+types/$id";

export async function loader({ params }: Route.ClientLoaderArgs) {
  return await getPage(`tv-aksjonen/${params.id}`);
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return await getPage(`tv-aksjonen/${params.id}`);
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
