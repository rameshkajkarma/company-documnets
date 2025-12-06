import { Schema, model, Document } from "mongoose";

export type EquipmentType =
  | "Switch"
  | "Router"
  | "Firewall"
  | "Access Point"
  | "Load Balancer"
  | "Gateway";

export type EquipmentStatus =
  | "Online"
  | "Offline"
  | "Maintenance"
  | "Decommissioned";

export interface INetworkEquipment extends Document {
  equipmentName: string;
  equipmentType: EquipmentType;
  ipAddress?: string;
  macAddress?: string;
  serialNumber: string;
  numberOfPorts: number;
  location: string;
  purchaseDate?: Date | null;
  warrantyExpiry?: Date | null;
  firmwareVersion: string;
  status: EquipmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const NetworkEquipmentSchema = new Schema(
  {
    equipmentName: { type: String, required: true, trim: true },
    equipmentType: { type: String, required: true, trim: true },

    // OPTIONAL (matches Joi)
    ipAddress: { type: String, required: false, trim: true },
    macAddress: { type: String, required: false, trim: true },

    // ONLY UNIQUE FIELD
    serialNumber: { type: String, required: true, trim: true, unique: true },

    numberOfPorts: { type: Number, required: true },
    location: { type: String, required: true, trim: true },
    purchaseDate: { type: Date, required: false },
    warrantyExpiry: { type: Date, required: false },
    firmwareVersion: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

NetworkEquipmentSchema.set("toJSON", {
  versionKey: false,
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

NetworkEquipmentSchema.set("toObject", {
  versionKey: false,
  transform(_doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export const NetworkEquipmentModel = model<INetworkEquipment>(
  "NetworkEquipment",
  NetworkEquipmentSchema
);
