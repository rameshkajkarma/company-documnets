import { Schema, model } from "mongoose";

const auditSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    auditor: { type: String, required: true },
    completionDate: { type: Date, required: true },
    fileKey: { type: String, required: false } // S3 key only
  },
  { timestamps: true }
);

export default model("Audit", auditSchema);
