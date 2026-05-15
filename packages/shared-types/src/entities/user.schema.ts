import { z } from "zod";

export const UserSchema = z.object({
	id: z.uuidv7(),
	email: z.email(),
	name: z.string().min(1).max(255),
	createdAt: z.date(),
	updatedAt: z.date(),
	deletedAt: z.date().nullable().optional(),
});

export type User = z.infer<typeof UserSchema>;
