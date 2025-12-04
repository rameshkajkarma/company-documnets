import mongoose, { Schema, Document } from 'mongoose';

export interface ILicense extends Document {
  name: string;
  number: string;
  issueDate: Date;
  expiryDate: Date;
  issuingAuthority?: string;
  documentKey?: string; // S3 object key
  createdAt: Date;
  updatedAt: Date;
}

const LicenseSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    number: { type: String, required: true, trim: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    issuingAuthority: { type: String },
    documentKey: { type: String }
  },
  { timestamps: true }
);

export const LicenseModel = mongoose.model<ILicense>('License', LicenseSchema);
