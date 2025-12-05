// import { Schema, model } from "mongoose";

// export const allowedDocumentCategories = [
//   "Contract",
//   "Template",
//   "Agreement",
//   "Policy",
//   "Other"
// ];

// const documentSchema = new Schema(
//   {
//     name: { type: String, required: true },
//     category: { 
//       type: String, 
//       required: true,
//       enum: allowedDocumentCategories   // ✅ restrict to only these
//     },
//     documentDate: { type: Date, required: true },
//     partiesInvolved: { type: String, required: true },
//     fileKey: { type: String }
//   },
//   { timestamps: true }
// );

// export default model("Document", documentSchema);

import { Schema, model } from "mongoose";

export const allowedDocumentCategories = [
  "Contract",
  "Template",
  "Agreement",
  "Policy",
  "Other",
];

const documentSchema = new Schema(
  {
    name: { type: String, required: true },

    category: {
      type: String,
      enum: allowedDocumentCategories,
      required: true,
    },

    documentDate: { type: Date, required: true },

    partiesInvolved: { type: String, required: true },

    fileKey: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,

    toJSON: {
      transform: (_, ret) => {
        delete ret.__v;
        return ret;
      },
    },

    toObject: {
      transform: (_, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default model("Document", documentSchema);
