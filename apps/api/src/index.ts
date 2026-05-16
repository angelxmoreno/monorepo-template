import { createDataSource } from "@repo/database";
import { serve } from "bun";
import { appConfig } from "@/config";
import { createLogger } from "@/utils/createLogger";
import app from "./server";

const logger = createLogger(appConfig.logger);

async function start() {
	const dataSource = createDataSource(appConfig.database.url);

	await dataSource.initialize();
	logger.info("Database connected");

	process.on("SIGINT", () => shutdown(dataSource));
	process.on("SIGTERM", () => shutdown(dataSource));

	serve({
		fetch: app.fetch,
		hostname: appConfig.http.hostname,
		port: appConfig.http.port,
		...(appConfig.http.tls ?? {}),
	});
	logger.info(
		`Server is at ${appConfig.http.protocol}://${appConfig.http.hostname}:${appConfig.http.port}`,
	);
}

async function shutdown(
	dataSource: Awaited<ReturnType<typeof createDataSource>>,
) {
	logger.info("Shutting down...");
	await dataSource.destroy();
	logger.info("Database connection closed");
	process.exit(0);
}

void start();
