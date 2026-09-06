export function golbalErrorMiddleware(error, req, res, next) {
  res
    .status(error.cause?.statusCode || 400)
    .json({ error: error.message, stack: error.stack, error });
}
