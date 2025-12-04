import { Schema, model } from "mongoose";

export const allowedDocumentCategories = [
  "Contract",
  "Template",
  "Agreement",
  "Policy",
  "Other"
];

const documentSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { 
      type: String, 
      required: true,
      enum: allowedDocumentCategories   // ✅ restrict to only these
    },
    documentDate: { type: Date, required: true },
    partiesInvolved: { type: String, required: true },
    fileKey: { type: String }
  },
  { timestamps: true }
);

export default model("Document", documentSchema);
