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
		if (err instanceof HTTPException) {
			if (err.res) return err.getResponse();
			if (err.status >= 500) {
				log.error(err, "Unhandled server error");
			}
			return c.json({ status: err.status, error: err.message }, err.status);
		}

		const httpError = toHttpException(err);
		log.error(err, "Unhandled server error");
		return c.json(
			{ status: httpError.status, error: "Internal server error" },
			httpError.status,
		);
	};
