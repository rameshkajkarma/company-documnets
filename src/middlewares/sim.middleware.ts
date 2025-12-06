import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import { throwJoiValidationError } from "../utils/response.util";

export const validateBody = (schema: Schema) => {
  return (req: Request, _: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const message = error.details.map(d => d.message).join(", ");
      throw throwJoiValidationError(message);
    }

    req.body = value;
    next();
  };
};

export const validateMultipart = (schema: Schema) => {
  return (req: Request, _: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const message = error.details.map(d => d.message).join(", ");
      throw throwJoiValidationError(message);
    }

    req.body = value;
    next();
  };
};

export const validateQuery = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const message = error.details.map(d => d.message).join(", ");
      throw throwJoiValidationError(message);
    }

    res.locals.validatedQuery = value;
    next();
  };
};

export const validateParams = (schema: Schema) => {
  return (req: Request, _: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const message = error.details.map(d => d.message).join(", ");
      throw throwJoiValidationError(message);
    }

    req.params = value;
    next();
  };
};
