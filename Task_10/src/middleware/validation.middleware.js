import { SystemLanguageEnum } from "../common/enum/system.enum.js";
import { BadRequestExceptions } from "../common/exceptions/app.exceptions.js";

function validation(schema) {
  return (req, res, next) => {
    const language = req.headers["accept-language"] || SystemLanguageEnum.EN;
    const validateData = schema(language).safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!validateData.success) {
      throw BadRequestExceptions({
        errMsg: "Validation failed",
        cause: { issues: validateData.error.issues },
      });
    }

    req.validateData = validateData.data;
    next();
  };
}

export default validation;
