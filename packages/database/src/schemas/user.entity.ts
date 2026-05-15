import type { User } from "@repo/shared-types";
import type { EntitySchemaOptions } from "typeorm";

export const userEntitySchemaOptions: EntitySchemaOptions<User> = {
	name: "User",
	columns: {
		id: {
			type: "uuid",
			primary: true,
			generated: "uuid",
		},
		email: {
			type: "varchar",
			length: 255,
			unique: true,
		},
		name: {
			type: "varchar",
			length: 255,
		},
		createdAt: {
			type: "timestamp",
			createDate: true,
		},
		updatedAt: {
			type: "timestamp",
			updateDate: true,
		},
		deletedAt: {
			type: "timestamp",
			nullable: true,
			deleteDate: true,
		},
	},
};
