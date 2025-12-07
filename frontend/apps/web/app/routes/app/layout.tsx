import { Link, Outlet } from "react-router";
import { getAuthStatus } from "../../auth";
import type { Route } from "./+types/layout";

export async function clientLoader() {
  return getAuthStatus();
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  const { isAuthenticated } = loaderData;

  return (
    <>
      <header>
        <a href="/">home</a>
        <Link to="/tv-aksjonen">TV-aksjonen</Link>
        <Link to="/app/magasin">magasin</Link>
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
