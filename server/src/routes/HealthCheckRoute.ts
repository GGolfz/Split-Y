import Elysia from "elysia";

const HealthCheckRoute = new Elysia().get("/healthcheck", () => ({
  isSuccess: true,
}));

export default HealthCheckRoute;
