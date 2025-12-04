import Joi from 'joi';

export const createLicenseSchema = Joi.object({
  name: Joi.string().trim().required(),
  number: Joi.string().trim().required(),
  issueDate: Joi.date().iso().required(),
  expiryDate: Joi.date().iso().required(),
  issuingAuthority: Joi.string().allow('', null)
});

export const updateLicenseSchema = Joi.object({
  name: Joi.string().trim(),
  number: Joi.string().trim(),
  issueDate: Joi.date().iso(),
  expiryDate: Joi.date().iso(),
  issuingAuthority: Joi.string().allow('', null)
});
