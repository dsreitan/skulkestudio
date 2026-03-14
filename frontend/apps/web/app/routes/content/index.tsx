import { Link } from "react-router";
import { getPage, getPages } from "../../api";
import type { Route } from "./+types/index";

const getData = async (section: string) => {
  const [page, pages] = await Promise.all([
    getPage(section),
    getPages(section),
  ]);
  return { page, pages };
};

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return getData(params.section);
}

export async function loader({ params }: Route.LoaderArgs) {
  return getData(params.section);
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: loaderData.page.title }];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <h1>{loaderData.page.title}</h1>
      <div>{loaderData.page.content}</div>
      {loaderData.pages.length > 0 && (
        <ul>
          {loaderData.pages.map((page) => (
            <li key={page.id}>
              <Link to={`/${page.id}`}>{page.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
