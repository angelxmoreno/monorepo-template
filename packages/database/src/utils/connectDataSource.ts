import type { DataSource } from "typeorm";

export async function connectDataSource(dataSource: DataSource): Promise<void> {
	try {
		await dataSource.initialize();
	} catch (err) {
		throw new Error(
			`Database connection failed: ${err instanceof Error ? err.message : String(err)}`,
			{ cause: err },
		);
	}
}
