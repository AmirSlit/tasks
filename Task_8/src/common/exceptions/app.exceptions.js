export function ConflictExceptions({
  errMsg = "Bad Request",
  cause = { statusCode: 409 },
} = {}) {
  throw new Error(errMsg, { cause });
}

export function BadRequestExceptions({
  errMsg = "Conflict",
  cause = { statusCode: 400 },
} = {}) {
  throw new Error(errMsg, { cause });
}

export function NotFoundExceptions({
  errMsg = "Not Found",
  cause = { statusCode: 404 },
} = {}) {
  throw new Error(errMsg, { cause });
}

export function UnAuthorizeException({
  errMsg = "UnAuthorize",
  cause = { statusCode: 401 },
} = {}) {
  throw new Error(errMsg, { cause });
}
