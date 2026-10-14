import { BadRequestExceptions } from "../common/exceptions/app.exceptions.js";

function validation(Schema) {
  return (req, res, next) => {
    const validateData = Schema.safeParse({
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
