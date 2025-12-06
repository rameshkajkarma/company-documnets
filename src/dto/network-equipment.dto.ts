import Joi, { ObjectSchema } from "joi";

export const equipmentTypeEnum = [
  "Switch", "Router", "Firewall", "Access Point", "Load Balancer", "Gateway"
] as const;

export const statusEnum = [
  "Online", "Offline", "Maintenance", "Decommissioned"
] as const;

const ddmmyyyy = Joi.string()
  .pattern(/^\d{2}-\d{2}-\d{4}$/)
  .message("must be in dd-mm-yyyy format");

const ipv4 = Joi.string()
  .ip({ version: ["ipv4"] })
  .message("must be a valid IPv4 address");

const mac = Joi.string()
  .pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)
  .message("must be a valid MAC address");

const portOptions = [2, 4, 8, 16, 24, 48];

// -------------------------------
// CREATE SCHEMA (UPDATED)
// -------------------------------
export const createNetworkEquipmentSchema: ObjectSchema = Joi.object({
  equipmentName: Joi.string().trim().required(),
  equipmentType: Joi.string().valid(...equipmentTypeEnum).required(),

  // OPTIONAL in create
  ipAddress: ipv4.optional(),
  macAddress: mac.optional(),

  // serial required
  serialNumber: Joi.string().trim().required(),

  numberOfPorts: Joi.number().valid(...portOptions).required(),
  location: Joi.string().trim().required(),
  purchaseDate: ddmmyyyy.required(),
  warrantyExpiry: ddmmyyyy.required(),
  firmwareVersion: Joi.string().trim().required(),
  status: Joi.string().valid(...statusEnum).required()
});

// -------------------------------
// UPDATE SCHEMA (unchanged)
// -------------------------------
export const updateNetworkEquipmentSchema = Joi.object({
  equipmentName: Joi.string().trim(),
  equipmentType: Joi.string().valid(...equipmentTypeEnum),

  ipAddress: ipv4,
  macAddress: mac,

  serialNumber: Joi.string().trim(),
  numberOfPorts: Joi.number().valid(...portOptions),
  location: Joi.string().trim(),
  purchaseDate: ddmmyyyy,
  warrantyExpiry: ddmmyyyy,
  firmwareVersion: Joi.string().trim(),
  status: Joi.string().valid(...statusEnum)
}).min(1);

// -------------------------------
export const idParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required()
});

export const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  equipmentType: Joi.string().valid(...equipmentTypeEnum),
  status: Joi.string().valid(...statusEnum),
  location: Joi.string().trim()
});
