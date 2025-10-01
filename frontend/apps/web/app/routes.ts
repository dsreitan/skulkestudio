import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("app", "routes/app.home.tsx"),
  route("app/page-a", "routes/app.page-a.tsx"),
  route("app/page-b", "routes/app.page-b.tsx"),
] satisfies RouteConfig;
