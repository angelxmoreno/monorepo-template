import pino, { type Logger } from "pino";
import { z } from "zod";

const CreateLoggerSchema = z.object({
	pretty: z.boolean().default(false),
});

export const createLogger = (
	params?: z.input<typeof CreateLoggerSchema>,
): Logger => {
	const { pretty } = CreateLoggerSchema.parse(params ?? {});
	return pretty ? pino({ transport: { target: "pino-pretty" } }) : pino();
};
