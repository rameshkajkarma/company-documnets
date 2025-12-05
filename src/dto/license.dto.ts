import Joi from "joi";

export const createLicenseDto = Joi.object({
  name: Joi.string().required(),
  number: Joi.string().required(),
  issueDate: Joi.date().required(),
  expiryDate: Joi.date().required(),
  issuingAuthority: Joi.string().required(),
  documentKey: Joi.string().optional(),
});

export const updateLicenseDto = Joi.object({
  name: Joi.string().optional(),
  number: Joi.string().optional(),
  issueDate: Joi.date().optional(),
  expiryDate: Joi.date().optional(),
  issuingAuthority: Joi.string().optional(),
  documentKey: Joi.string().optional(),
});

export const licenseIdDto = Joi.object({
  id: Joi.string().length(24).hex().required(),
});
