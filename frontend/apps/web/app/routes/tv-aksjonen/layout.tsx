import { Link, Outlet } from "react-router";

export default function Layout() {
  return (
    <>
      <header>
        <Link to="/">home</Link>
        <Link to="/tv-aksjonen">TV-aksjonen</Link>
        <a href="/login">login</a>
      </header>
      <Outlet />
    </>
  );
}
