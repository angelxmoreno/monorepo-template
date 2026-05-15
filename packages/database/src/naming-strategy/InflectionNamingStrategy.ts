import {
	DefaultNamingStrategy,
	type NamingStrategyInterface,
	type Table,
	type View,
} from "typeorm";
import { createSafeTableName, toSnakeCaseAcronymSafe } from "./utils";

function extractTableName(tableOrName: Table | View | string): string {
	return typeof tableOrName === "string" ? tableOrName : tableOrName.name;
}

function normalizeJoinColumnNames(
	tableOrName: Table | View | string,
	columns: string[],
): { table: string; columns: string } {
	const table = toSnakeCaseAcronymSafe(extractTableName(tableOrName));
	const joined = columns.map(toSnakeCaseAcronymSafe).join("_");
	return { table, columns: joined };
}

export class InflectionNamingStrategy
	extends DefaultNamingStrategy
	implements NamingStrategyInterface
{
	protected tableNameCache = new Map<string, string>();

	override tableName(targetName: string, userSpecifiedName?: string): string {
		if (userSpecifiedName) return userSpecifiedName;
		if (!this.tableNameCache.has(targetName)) {
			this.tableNameCache.set(targetName, createSafeTableName(targetName));
		}
		return this.tableNameCache.get(targetName) as string;
	}

	override columnName(
		propertyName: string,
		customName: string | undefined,
		embeddedPrefixes: string[],
	): string {
		const baseName = customName ?? propertyName;
		const fullName = customName
			? baseName
			: [...embeddedPrefixes.filter(Boolean), baseName].join("_");
		return toSnakeCaseAcronymSafe(fullName);
	}

	override indexName(
		tableOrName: Table | View | string,
		columns: string[],
		where?: string,
	): string {
		const { table, columns: cols } = normalizeJoinColumnNames(
			tableOrName,
			columns,
		);
		const whereSuffix = where ? "_partial" : "";
		return `${table}_${cols}${whereSuffix}`;
	}

	override primaryKeyName(
		tableOrName: Table | string,
		columnNames: string[],
	): string {
		const { table, columns } = normalizeJoinColumnNames(
			tableOrName,
			columnNames,
		);
		return `${table}_${columns}_pk`;
	}

	override foreignKeyName(
		tableOrName: Table | string,
		columnNames: string[],
		_referencedTablePath?: string,
		_referencedColumnNames?: string[],
	): string {
		const { table, columns } = normalizeJoinColumnNames(
			tableOrName,
			columnNames,
		);
		return `${table}_${columns}_fk`;
	}

	override uniqueConstraintName(
		tableOrName: Table | string,
		columnNames: string[],
	): string {
		const { table, columns } = normalizeJoinColumnNames(
			tableOrName,
			columnNames,
		);
		return `${table}_${columns}_unique`;
	}
}
