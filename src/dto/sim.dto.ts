import Joi, { ObjectSchema } from "joi";


const carrierEnum = ["Zain Kuwait", "Ooredoo Kuwait", "STC Kuwait", "Other"];
const currencyEnum = ["KWD", "USD", "EUR", "GBP", "AED", "SAR"];
const departmentEnum = ["IT", "Sales", "Marketing", "Finance", "Operations", "HR", "Management", "Other"];
const statusEnum = ["Active", "Inactive", "Suspended", "Expired"];

// Reusable validator for dd-mm-yyyy strings
const ddmmyyyy = Joi.string()
  .pattern(/^\d{2}-\d{2}-\d{4}$/)
  .message("must be in dd-mm-yyyy format");

export const createSimSchema: ObjectSchema = Joi.object({
  simNumber: Joi.string().trim().required(),
  phoneNumber: Joi.string().trim().optional().allow("", null),
  carrier: Joi.string().valid(...carrierEnum).required(),
  planType: Joi.string().trim().optional().allow("", null),
  monthlyFee: Joi.number().min(0).optional().default(0),
  currency: Joi.string().valid(...currencyEnum).optional().default("KWD"),
  extraCharges: Joi.number().min(0).optional().default(0),
  simCharges: Joi.number().min(0).optional().default(0),
  dataLimit: Joi.string().trim().optional().allow("", null),

  // dd-mm-yyyy strings
  activationDate: ddmmyyyy.optional().allow("", null),
  expiryDate: ddmmyyyy.optional().allow("", null),

  assignedTo: Joi.string().trim().optional().allow("", null),
  department: Joi.string().valid(...departmentEnum).optional().allow(null),
  deviceImei: Joi.string().trim().length(15).optional().allow("", null),
  status: Joi.string().valid(...statusEnum).optional().default("Active"),
  notes: Joi.string().max(2000).optional().allow("", null),
});

export const updateSimSchema: ObjectSchema = Joi.object({
  simNumber: Joi.string().trim().optional(),
  phoneNumber: Joi.string().trim().optional().allow("", null),
  carrier: Joi.string().valid(...carrierEnum).optional(),
  planType: Joi.string().trim().optional().allow("", null),
  monthlyFee: Joi.number().min(0).optional(),
  currency: Joi.string().valid(...currencyEnum).optional(),
  extraCharges: Joi.number().min(0).optional(),
  simCharges: Joi.number().min(0).optional(),
  dataLimit: Joi.string().trim().optional().allow("", null),
  activationDate: ddmmyyyy.optional().allow("", null),
  expiryDate: ddmmyyyy.optional().allow("", null),
  assignedTo: Joi.string().trim().optional().allow("", null),
  department: Joi.string().valid(...departmentEnum).optional().allow(null),
  deviceImei: Joi.string().trim().length(15).optional().allow("", null),
  status: Joi.string().valid(...statusEnum).optional(),
  notes: Joi.string().max(2000).optional().allow("", null),
}).min(1);

// Params validation (for :id)
export const idParamSchema: ObjectSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

// Query validation for GET /sim (pagination + filters)
export const getSimsQuerySchema: ObjectSchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  carrier: Joi.string().valid(...carrierEnum).optional(),
  status: Joi.string().valid(...statusEnum).optional(),
  department: Joi.string().valid(...departmentEnum).optional(),
});
