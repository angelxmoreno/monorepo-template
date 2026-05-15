import type { DataSourceOptions } from "typeorm";

const SUPPORTED_PROTOCOLS = ["mysql", "postgres"] as const;
type SupportedType = (typeof SUPPORTED_PROTOCOLS)[number];

const BOOLEAN_PARAMS = ["synchronize", "logging", "migrationsRun"] as const;

function parseBooleanParams(
	params: URLSearchParams,
): Pick<DataSourceOptions, "synchronize" | "logging" | "migrationsRun"> {
	return Object.fromEntries(
		BOOLEAN_PARAMS.map((key) => [key, params.get(key) === "true"]),
	) as Pick<DataSourceOptions, "synchronize" | "logging" | "migrationsRun">;
}

function parseSqliteDsn(dsn: string): Partial<DataSourceOptions> {
	const match = dsn.match(/^sqlite:\/\/([^?]+)(?:\?(.*))?$/);
	if (!match) throw new Error("Invalid SQLite DSN");

	const [, path, queryString] = match;
	const params = new URLSearchParams(queryString ?? "");
	return {
		type: "sqlite",
		database: path,
		...parseBooleanParams(params),
	};
}

function normalizeType(protocol: string): SupportedType {
	const normalized = protocol === "postgresql" ? "postgres" : protocol;
	const type = SUPPORTED_PROTOCOLS.find((t) => t === normalized);
	if (!type) {
		throw new Error(
			`Unsupported DATABASE_URL protocol: ${protocol}:. Supported: mysql:, postgres:, postgresql:, sqlite:`,
		);
	}
	return type;
}

function parseMysqlParams(params: URLSearchParams): Partial<DataSourceOptions> {
	return {
		timezone: params.get("timezone") ?? "+00:00",
		charset: params.get("charset") ?? "utf8mb4",
	};
}

export function parseDsnString(dsn: string): Partial<DataSourceOptions> {
	if (dsn.startsWith("sqlite://")) return parseSqliteDsn(dsn);

	const url = new URL(dsn);
	const type = normalizeType(url.protocol.replace(":", ""));
	const params = url.searchParams;

	const options: Partial<DataSourceOptions> = {
		type,
		url: dsn.replace(/\?.*$/, ""),
		...parseBooleanParams(params),
	};

	if (type === "mysql") {
		Object.assign(options, parseMysqlParams(params));
	}

	return options;
}
