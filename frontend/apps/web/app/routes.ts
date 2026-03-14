import {
  index,
  layout,
  prefix,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/site/layout.tsx", [index("./routes/site/index.tsx")]),
  ...prefix(":section", [
    layout("./routes/content/layout.tsx", [
      index("./routes/content/index.tsx"),
      route(":id", "./routes/content/$id.tsx"),
    ]),
  ]),
  ...prefix("app", [
    layout("./routes/app/layout.tsx", [
      index("./routes/app/index.tsx"),
      route("*", "./routes/app/$.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
