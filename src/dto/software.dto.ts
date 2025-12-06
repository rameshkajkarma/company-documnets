import Joi, { ObjectSchema } from "joi";

export const licenseTypeEnum = ["Subscription", "Perpetual", "Trial", "Educational"] as const;
export const departmentEnum = ["All", "IT", "Finance", "HR", "Operations", "Sales", "Marketing", "Engineering", "Legal"] as const;
export const statusEnum = ["Active", "Expiring Soon", "Expired", "Suspended"] as const;

const ddmmyyyyString = Joi.string()
  .pattern(/^\d{2}-\d{2}-\d{4}$/)
  .message("must be in dd-mm-yyyy format");

export const createSoftwareSchema: ObjectSchema = Joi.object({
  name: Joi.string().trim().required(),
  vendor: Joi.string().trim().optional().allow("", null),
  licenseType: Joi.string().valid(...licenseTypeEnum).required(),
  licenseKey: Joi.string().trim().required(),
  totalSeats: Joi.number().integer().min(1).optional().default(1),
  seatsUsed: Joi.number().integer().min(0).optional().default(0),
  purchaseDate: ddmmyyyyString.optional().allow("", null),
  expiryDate: ddmmyyyyString.optional().allow("", null),
  renewalCost: Joi.string().trim().optional().allow("", null),
  assignedDepartment: Joi.string().valid(...departmentEnum).optional().allow(null),
  status: Joi.string().valid(...statusEnum).optional().default("Active")
});

export const updateSoftwareSchema: ObjectSchema = Joi.object({
  name: Joi.string().trim().optional(),
  vendor: Joi.string().trim().optional().allow("", null),
  licenseType: Joi.string().valid(...licenseTypeEnum).optional(),
  licenseKey: Joi.string().trim().optional(),
  totalSeats: Joi.number().integer().min(1).optional(),
  seatsUsed: Joi.number().integer().min(0).optional(),
  purchaseDate: ddmmyyyyString.optional().allow("", null),
  expiryDate: ddmmyyyyString.optional().allow("", null),
  renewalCost: Joi.string().trim().optional().allow("", null),
  assignedDepartment: Joi.string().valid(...departmentEnum).optional().allow(null),
  status: Joi.string().valid(...statusEnum).optional()
}).min(1);

export const idParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required()
});

export const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  licenseType: Joi.string().valid(...licenseTypeEnum).optional(),
  assignedDepartment: Joi.string().valid(...departmentEnum).optional(),
  status: Joi.string().valid(...statusEnum).optional(),
  vendor: Joi.string().trim().optional()
});
