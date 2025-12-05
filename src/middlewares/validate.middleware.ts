import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { throwJoiValidationError } from "../utils/response.util";

// ===============================
// Validate Request Body
// ===============================
export const validateRequest = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { error, value } = schema.validate(req.body, {
        abortEarly: true,
        stripUnknown: true,
        convert: true,
      });

      if (error) {
        const msg = error.details[0].message.replace(/"/g, "");
        throw throwJoiValidationError(msg);
      }

      req.body = value;
      next();
    } catch (err) {
      next(err);
    }
  };
};

// ===============================
// Validate URL Params (ID)
// ===============================
export const validateParams = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { error, value } = schema.validate(req.params, {
        abortEarly: true,
        stripUnknown: true,
      });

      if (error) {
        const msg = error.details[0].message.replace(/"/g, "");
        throw throwJoiValidationError(msg);
      }

      req.params = value;
      next();
    } catch (err) {
      next(err);
    }
  };
};
