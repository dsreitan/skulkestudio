import {
  index,
  layout,
  prefix,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/site/layout.tsx", [index("./routes/site/index.tsx")]),
  ...prefix("tv-aksjonen", [
    layout("./routes/tv-aksjonen/layout.tsx", [
      index("./routes/tv-aksjonen/index.tsx"),
      route(":id", "./routes/tv-aksjonen/$id.tsx"),
    ]),
  ]),
  ...prefix("app", [
    layout("./routes/app/layout.tsx", [
      index("./routes/app/index.tsx"),
      route("*", "./routes/app/$.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
