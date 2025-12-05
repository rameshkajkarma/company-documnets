import Joi from "joi";

// CREATE
export const createDocumentSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string()
    .valid("Contract", "Template", "Agreement", "Policy", "Other")
    .required(),
  documentDate: Joi.date().required(),
  partiesInvolved: Joi.string().required(),
});

// UPDATE
export const updateDocumentSchema = Joi.object({
  name: Joi.string().optional(),
  category: Joi.string()
    .valid("Contract", "Template", "Agreement", "Policy", "Other")
    .optional(),
  documentDate: Joi.date().optional(),
  partiesInvolved: Joi.string().optional(),
});

// GET by ID
export const getDocumentByIdSchema = Joi.object({
  id: Joi.string().required(),
});

// LIST QUERY
export const listDocumentQuerySchema = Joi.object({
  search: Joi.string().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});
