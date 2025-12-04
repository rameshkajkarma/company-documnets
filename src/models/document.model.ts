import { Schema, model } from "mongoose";

const documentSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    documentDate: { type: Date, required: true },
    partiesInvolved: { type: String, required: true },
    fileKey: { type: String, required: false }
  },
  { timestamps: true }
);

export default model("Document", documentSchema);
