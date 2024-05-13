import { Elysia } from "elysia";
import dotenv from "dotenv";
import { cors } from "@elysiajs/cors";
import HealthCheckRoute from "./routes/HealthCheckRoute";
import WebHookRoute from "./routes/WebHookRoute";
import WebApiRoute from "./routes/WebApiRoute";
import { GroupIdParamType } from "./model/ParamType";
import staticPlugin from "@elysiajs/static";
dotenv.config();

const PORT = process.env.PORT || 3000
const app = new Elysia()
  .group("/api", (app) =>
    app.use(HealthCheckRoute).use(WebHookRoute).use(WebApiRoute)
  )
  .ws("/ws/:groupId", {
    params: GroupIdParamType,
    open(ws) {
      const topic = `group-${ws.data.params.groupId}`;
      ws.subscribe(topic);
    },
    message(ws, message) {
      const topic = `group-${ws.data.params.groupId}`;
      ws.publish(topic, message);
    },
  })
  .use(cors())
  .get("/",() => Bun.file("public/index.html"))
  .get("/:groupId", () => Bun.file("public/index.html"))
  .get("/:groupId/share", () => Bun.file("public/index.html"))
  .use(staticPlugin(
    {
      prefix: "/",
      alwaysStatic: true
    }
  ))
  .listen(PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
