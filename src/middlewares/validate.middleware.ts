import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { throwJoiValidationError } from "../utils/response.util"; // use your helper


export const validateRequest = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { error, value } = schema.validate(req.body, {
        abortEarly: true,      // stop on first error
        stripUnknown: true,    // remove extra fields
        convert: true,         // auto convert types
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


export const validateParams = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { error, value } = schema.validate(req.params, {
        abortEarly: true,
        stripUnknown: true,
      });

      if (error) {
        const msg = error.details[0].message.replace(/"/g, "");
        throw throwJoiValidationError(msg); // will become "Invalid ID" in global handler
      }

      req.params = value;
      next();
    } catch (err) {
      next(err);
    }
  };
};
