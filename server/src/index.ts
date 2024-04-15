import { Elysia } from "elysia";
import dotenv from "dotenv";
import { cors } from "@elysiajs/cors";
import HealthCheckRoute from "./routes/HealthCheckRoute";
import WebHookRoute from "./routes/WebHookRoute";
import WebApiRoute from "./routes/WebApiRoute";
dotenv.config();
const app = new Elysia()
  .group("/api", (app) =>
    app.use(HealthCheckRoute).use(WebHookRoute).use(WebApiRoute)
  )
  .use(cors())
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
