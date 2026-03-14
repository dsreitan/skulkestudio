import { Link, Outlet } from "react-router";
import { getInitialState } from "../../auth";
import type { Route } from "./+types/layout";

export async function clientLoader() {
  return getInitialState();
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  const { isAuthenticated, sections } = loaderData;

  return (
    <>
      <header>
        <a href="/">home</a>
        {sections.map((s) => (
          <Link key={s.id} to={`/app/${s.id}`}>
            {s.title}
          </Link>
        ))}
        {isAuthenticated ? (
          <a href="/logout">logout</a>
        ) : (
          <a href="/login">login</a>
        )}
      </header>
      <Outlet />
    </>
  );
}
