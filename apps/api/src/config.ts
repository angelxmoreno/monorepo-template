import { z } from "zod";
import { createConfig } from "@/utils/createConfig";
import { envBooleanDefault } from "@/utils/envCoercions";

const AppConfigSchema = z
	.object({
		DATABASE_URL: z.url(),
		HOSTNAME: z.string().default("127.0.0.1"),
		PORT: z.coerce.number().int().default(5001),
		TLS_CERT: z.string().optional(),
		TLS_KEY: z.string().optional(),
		LOGGER_PRETTY_PRINT: envBooleanDefault(true),
	})
	.transform(
		({
			TLS_CERT,
			TLS_KEY,
			HOSTNAME,
			DATABASE_URL,
			PORT,
			LOGGER_PRETTY_PRINT,
		}) => {
			const tls =
				TLS_CERT && TLS_KEY
					? { certFile: TLS_CERT, keyFile: TLS_KEY }
					: undefined;
			return {
				http: {
					hostname: HOSTNAME,
					port: PORT,
					protocol: tls ? ("https" as const) : ("http" as const),
					tls,
				},
				database: {
					url: DATABASE_URL,
				},
				logger: {
					pretty: LOGGER_PRETTY_PRINT,
				},
			};
		},
	);

export type AppConfig = z.infer<typeof AppConfigSchema>;
export const appConfig: AppConfig = createConfig(AppConfigSchema, Bun.env);
