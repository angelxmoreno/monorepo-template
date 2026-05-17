import { connectDataSource, createDataSource } from "@repo/database";
import { serve } from "bun";
import { appConfig } from "@/config";
import { createLogger } from "@/utils/createLogger";
import { createApp } from "./server";

const logger = createLogger(appConfig.logger);
const app = createApp(logger);

async function start() {
	const dataSource = createDataSource(appConfig.database.url);

	try {
		await connectDataSource(dataSource);
		logger.info("Database connected");
	} catch (err) {
		logger.error(err, "Failed to start: database connection failed");
		process.exit(1);
	}

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

async function shutdown(dataSource: ReturnType<typeof createDataSource>) {
	logger.info("Shutting down...");
	await dataSource.destroy();
	logger.info("Database connection closed");
	process.exit(0);
}

void start();
