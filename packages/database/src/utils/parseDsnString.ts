import type { DataSourceOptions } from "typeorm";

export function parseDsnString(dsn: string): Partial<DataSourceOptions> {
	if (dsn.startsWith("sqlite://")) {
		const match = dsn.match(/^sqlite:\/\/([^?]+)(?:\?(.*))?$/);
		if (!match) {
			throw new Error("Invalid SQLite DSN");
		}

		const [, path, queryString] = match;
		const queryParams = new URLSearchParams(queryString || "");

		return {
			type: "sqlite",
			database: path,
			synchronize: queryParams.get("synchronize") === "true",
			logging: queryParams.get("logging") === "true",
			migrationsRun: queryParams.get("migrationsRun") === "true",
		};
	}

	const url = new URL(dsn);
	const rawType = url.protocol.replace(":", "");
	const normalizedType = rawType === "postgresql" ? "postgres" : rawType;
	const supportedTypes = ["mysql", "postgres"] as const;
	const type = supportedTypes.find((t) => t === normalizedType);
	if (!type) {
		throw new Error(
			`Unsupported DATABASE_URL protocol: ${url.protocol}. Supported: mysql:, postgres:, postgresql:, sqlite:`,
		);
	}
	const queryParams = url.searchParams;

	const options: Partial<DataSourceOptions> = {
		type,
		url: dsn.replace(/\?.*$/, ""),
		synchronize: queryParams.get("synchronize") === "true",
		logging: queryParams.get("logging") === "true",
		migrationsRun: queryParams.get("migrationsRun") === "true",
	};

	if (type === "mysql") {
		const timezone = queryParams.get("timezone") ?? "UTC";
		const charset = queryParams.get("charset") ?? "utf8mb4";
		Object.assign(options, { timezone, charset });
	}

	return options;
}
