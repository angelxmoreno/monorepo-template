import { Hono } from "hono";
import { trimTrailingSlash } from "hono/trailing-slash";
import { appConfig } from "@/config";
import { createCorsMiddleware } from "@/middleware/cors";
import { notFoundHandler } from "@/middleware/notFound";
import { createSecureHeadersMiddleware } from "@/middleware/secureHeaders";

const app = new Hono();

app.use("*", createCorsMiddleware(appConfig.cors.origins));
app.use("*", createSecureHeadersMiddleware(appConfig.security.headers));
app.use("*", trimTrailingSlash());
app.notFound(notFoundHandler);

app.get("/", (c) => c.json({ status: "ok" }));

export default app;
