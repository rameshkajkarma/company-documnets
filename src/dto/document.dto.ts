// export interface CreateDocumentDTO {
//   name: string;
//   category: string;
//   documentDate: Date | string;
//   partiesInvolved: string;
// }

// export interface UpdateDocumentDTO {
//   name?: string;
//   category?: string;
//   documentDate?: Date | string;
//   partiesInvolved?: string;
// }

import Joi from "joi";

export const createDocumentSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string()
    .valid("Contract", "Template", "Agreement", "Policy", "Other")
    .required(),
  documentDate: Joi.date().required(),
  partiesInvolved: Joi.string().required(),
});

export const updateDocumentSchema = Joi.object({
  name: Joi.string().optional(),
  category: Joi.string()
    .valid("Contract", "Template", "Agreement", "Policy", "Other")
    .optional(),
  documentDate: Joi.date().optional(),
  partiesInvolved: Joi.string().optional(),
});

export const getDocumentByIdSchema = Joi.object({
  id: Joi.string().required(),
});
