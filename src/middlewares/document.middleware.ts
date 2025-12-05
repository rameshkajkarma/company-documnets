import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { throwJoiValidationError } from "../utils/response.util";

// ===============================
// Validate BODY (POST / PUT)
// ===============================
export const validateDocumentBody = (schema: ObjectSchema) => {
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
// Validate PARAMS (/:id)
// ===============================
export const validateDocumentParams = (schema: ObjectSchema) => {
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

// ===============================
// Validate QUERY (?search, ?page)
// ===============================
export const validateDocumentQuery = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { error, value } = schema.validate(req.query, {
        abortEarly: true,
        stripUnknown: true,
        convert: true,
      });

      if (error) {
        const msg = error.details[0].message.replace(/"/g, "");
        throw throwJoiValidationError(msg);
      }

      req.query = value;
      next();
    } catch (err) {
      next(err);
    }
  };
};
