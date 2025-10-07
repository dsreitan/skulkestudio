import { Link, Outlet } from "react-router";

export default function Layout() {
  return (
    <>
      <header>
        <a href="/">home</a>
        <Link to="/tv-aksjonen">TV-aksjonen</Link>
        <Link to="/app/magasin">magasin</Link>
        <a href="/logout">logout</a>
      </header>
      <Outlet />
    </>
  );
}
