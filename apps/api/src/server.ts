import { Hono } from "hono";
import { appConfig } from "@/config";
import { createCorsMiddleware } from "@/middleware/cors";

const app = new Hono();

app.use("*", createCorsMiddleware(appConfig.cors.origins));

app.get("/", (c) => c.json({ status: "ok" }));

export default app;
