import { DataSource, type DataSourceOptions } from "typeorm";
import { entities } from "../entities";
import { InflectionNamingStrategy } from "../naming-strategy/InflectionNamingStrategy";
import { parseDsnString } from "./parseDsnString";

export function createDataSourceOptions(
	databaseUrl: string,
	overrides?: Partial<DataSourceOptions>,
): DataSourceOptions {
	const driverOptions = parseDsnString(databaseUrl);

	return {
		entities: [...entities],
		migrations: [`${import.meta.dir}/../migrations/*.{ts,js}`],
		migrationsTableName: "typeorm_migrations",
		namingStrategy: new InflectionNamingStrategy(),
		...driverOptions,
		...overrides,
	} as DataSourceOptions;
}

export function createDataSource(
	databaseUrl: string,
	overrides?: Partial<DataSourceOptions>,
): DataSource {
	return new DataSource(createDataSourceOptions(databaseUrl, overrides));
}
