import { z } from "zod";
import { createConfig } from "@/utils/createConfig";
import { envBooleanDefault } from "@/utils/envCoercions";

const AppConfigSchema = z
	.object({
		DATABASE_URL: z.url(),
		HOSTNAME: z.string().default("127.0.0.1"),
		PORT: z.coerce.number().int().default(5001),
		LOGGER_PRETTY_PRINT: envBooleanDefault(true),
	})
	.transform(({ LOGGER_PRETTY_PRINT, HOSTNAME, DATABASE_URL, PORT }) => ({
		http: {
			hostname: HOSTNAME,
			port: PORT,
		},
		database: {
			url: DATABASE_URL,
		},
		logger: {
			pretty: LOGGER_PRETTY_PRINT,
		},
	}));

export type AppConfig = z.infer<typeof AppConfigSchema>;
export const appConfig: AppConfig = createConfig(AppConfigSchema, Bun.env);
