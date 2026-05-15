import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { createDataSourceOptions } from "./utils/createDataSourceOptions";

dotenv.config({
	path: [".env", "../../.env"],
	quiet: true,
	override: false, // ensures first-found variable wins
});
const databaseUrl = Bun.env.DATABASE_URL ?? "";
const options = createDataSourceOptions(databaseUrl);
export const AppDataSource = new DataSource(options);
