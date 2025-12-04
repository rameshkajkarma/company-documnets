import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Combine body and query for flexible validation (mainly body used here)
    const toValidate = req.body;
    const { error, value } = schema.validate(toValidate, { abortEarly: false, stripUnknown: true });
    if (error) {
      const details = error.details.map(d => d.message);
      return res.status(400).json({ success: false, message: 'Validation error', details });
    }
    req.body = value;
    return next();
  };
};
