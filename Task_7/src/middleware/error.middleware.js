export function golbalErrorMiddleware(err, req, res, next) {
  res
    .status(err.cause?.statusCode || 400)
    .json({ errMsg: err.message, stack: err.stack, err });
}
