export async function successResponse({
  res,
  statusCode = 200,
  msg = "Done!",
  data,
} = {}) {
  res.status(statusCode).json({ msg, data });
}
