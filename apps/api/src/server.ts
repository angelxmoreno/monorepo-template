import { Hono } from "hono";
import { trimTrailingSlash } from "hono/trailing-slash";
import type { Logger } from "pino";
import { appConfig } from "@/config";
import { createCorsMiddleware } from "@/middleware/cors";
import { createErrorHandler } from "@/middleware/errorHandler";
import { notFoundHandler } from "@/middleware/notFound";
import { createSecureHeadersMiddleware } from "@/middleware/secureHeaders";

export const createApp = (logger: Logger): Hono => {
	const app = new Hono();

	app.use("*", createCorsMiddleware(appConfig.cors.origins));
	app.use("*", createSecureHeadersMiddleware(appConfig.security.headers));
	app.use("*", trimTrailingSlash());
	app.notFound(notFoundHandler);
	app.onError(createErrorHandler(logger));
	app.get("/", (c) => c.json({ status: "ok" }));

	return app;
};
