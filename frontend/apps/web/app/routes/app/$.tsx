import { Link } from "react-router";
import { getPage, getPages } from "../../api";
import type { Route } from "./+types/$";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return { page: await getPage(params["*"]), pages: await getPages(params["*"].split("/")[0]) };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: loaderData.page.title }];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <h1>{loaderData.page.title}</h1>
      <div>{loaderData.page.content}</div>
      {loaderData.pages.length > 1 && (
        <ul>
          {loaderData.pages.map(page => (
            <li key={page.id}>
              <Link to={`/app/${page.id}`}>{page.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
