import { Link } from "react-router";
import { getPage, getPages } from "../../api";
import type { Route } from "./+types/index";

const getData = async () => {
  return { page: await getPage("tv-aksjonen"), pages: await getPages("tv-aksjonen") };
};

export async function clientLoader() {
  return await getData();
}
export async function loader() {
  return await getData();
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: loaderData.page.title }];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <h1>{loaderData.page.title}</h1>
      <div>{loaderData.page.content}</div>
      <ul>
        {loaderData.pages.map(page => (
          <li key={page.id}>
            <Link to={`/${page.id}`}>{page.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
