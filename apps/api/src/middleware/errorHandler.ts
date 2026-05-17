import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { Logger } from "pino";

const guessStatusCodeFromError = (err: Error): ContentfulStatusCode => {
	const status = (err as unknown as { status: unknown }).status;
	if (typeof status === "number" && status >= 400 && status < 600) {
		return status as ContentfulStatusCode;
	}
	return 500;
};

const toHttpException = (err: Error): HTTPException =>
	new HTTPException(guessStatusCodeFromError(err), {
		cause: err,
		message: err.message,
	});

export const createErrorHandler =
	(log: Logger): ErrorHandler =>
	(err, c) => {
		const httpError = err instanceof HTTPException ? err : toHttpException(err);
		const isServerError = httpError.status >= 500;

		if (isServerError) {
			log.error(err, "Unhandled server error");
		}

		return c.json(
			{
				status: httpError.status,
				error: isServerError ? "Internal server error" : err.message,
			},
			httpError.status,
		);
	};
