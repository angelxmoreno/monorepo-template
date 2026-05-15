import type { User } from "@repo/shared-types";
import { EntitySchema } from "typeorm";
import { userEntitySchemaOptions } from "./schemas/user.entity";

export const UserEntitySchema = new EntitySchema<User>(userEntitySchemaOptions);

export const entities = [UserEntitySchema] as const;
