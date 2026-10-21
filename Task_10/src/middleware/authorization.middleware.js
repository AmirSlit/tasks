import { forbiddenException } from "../common/exceptions/app.exceptions.js";

function authorization(roles = []) {
  return async function (req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      throw forbiddenException({ errMsg: "You don't have access" });
    }

    next();
  };
}

export default authorization;
