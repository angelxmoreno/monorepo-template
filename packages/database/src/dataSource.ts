import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { createDataSourceOptions } from "./utils/createDataSourceOptions";

dotenv.config({
	path: [".env", "../../.env"],
	quiet: true,
	override: false, // ensures first-found variable wins
});
if (!Bun.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is not set.");
}
export const AppDataSource = new DataSource(
	createDataSourceOptions(Bun.env.DATABASE_URL),
);
