// import DocumentModel from "../models/document.model";
// import { uploadToS3 } from "../utils/s3.util";
// import { CreateDocumentDTO, UpdateDocumentDTO } from "../dto/document.dto";

// export class DocumentService {
//   // CREATE
//   static async createDocument(data: CreateDocumentDTO, file?: Express.Multer.File) {
//     const fileKey = file ? await uploadToS3(file) : null;

//     const doc = await DocumentModel.create({
//       name: data.name,
//       category: data.category,
//       documentDate: new Date(data.documentDate), // FIX: convert string → Date
//       partiesInvolved: data.partiesInvolved,
//       fileKey,
//     });

//     return doc;
//   }

//   // FORMAT RESPONSE
//   static formatDocument(doc: any) {
//     const today = new Date();
//     const docDate = new Date(doc.documentDate);

//     const status = docDate >= today ? "Active" : "Archived";

//     return {
//       ...doc.toObject(),
//       status,
//     };
//   }

//   // LIST
// static async listDocuments(page = 1, limit = 10) {
//   const skip = (page - 1) * limit;

//   const total = await DocumentModel.countDocuments();

//   const docs = await DocumentModel.find()
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit);

//   return {
//     total,
//     page,
//     limit,
//     pages: Math.ceil(total / limit),
//     data: docs.map((d) => this.formatDocument(d))
//   };
// }


//   // GET BY ID
//   static async getDocumentById(id: string) {
//     const doc = await DocumentModel.findById(id);
//     return doc ? this.formatDocument(doc) : null;
//   }

//   // UPDATE
//   static async updateDocument(id: string, data: UpdateDocumentDTO, file?: Express.Multer.File) {
//     const doc = await DocumentModel.findById(id);
//     if (!doc) return null;

//     if (file) {
//       doc.fileKey = await uploadToS3(file);
//     }

//     doc.name = data.name ?? doc.name;
//     doc.category = data.category ?? doc.category;

//     // FIX: convert string → Date only if sent in update
//     if (data.documentDate) {
//       doc.documentDate = new Date(data.documentDate);
//     }

//     doc.partiesInvolved = data.partiesInvolved ?? doc.partiesInvolved;

//     await doc.save();
//     return this.formatDocument(doc);
//   }

//   // DELETE
//   static async deleteDocument(id: string) {
//     return await DocumentModel.findByIdAndDelete(id);
//   }
// }


import DocumentModel from "../models/document.model";
import { uploadBufferToS3, deleteFromS3, getPresignedUrl } from "../utils/s3.util";

// =============================
// CREATE DOCUMENT
// =============================
export const create = async (data: any, file?: Express.Multer.File) => {
  let fileKey: string | undefined;

  if (file) {
    fileKey = await uploadBufferToS3(
      file.buffer,
      file.originalname,
      file.mimetype
    );
  }

  const doc = await DocumentModel.create({
    ...data,
    fileKey,
  });

  return doc.toObject();
};

// =============================
// GET ALL DOCUMENTS (WITH PAGINATION)
// =============================
export const getAll = async (
  page = 1,
  limit = 10,
  search?: string
) => {
  const skip = (page - 1) * limit;

  const filter: any = {};

  // Optional search by name
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const total = await DocumentModel.countDocuments(filter);

  const docs = await DocumentModel.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const dataWithUrls = await Promise.all(
    docs.map(async (item) => ({
      ...item,
      fileUrl: item.fileKey ? await getPresignedUrl(item.fileKey) : null,
    }))
  );

  return {
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: dataWithUrls,
  };
};

// =============================
// GET SINGLE DOCUMENT
// =============================
export const getOne = async (id: string) => {
  const doc = await DocumentModel.findById(id).lean();
  if (!doc) return null;

  return {
    ...doc,
    fileUrl: doc.fileKey ? await getPresignedUrl(doc.fileKey) : null,
  };
};

// =============================
// UPDATE DOCUMENT
// =============================
export const update = async (
  id: string,
  data: any,
  file?: Express.Multer.File
) => {
  const existing = await DocumentModel.findById(id);
  if (!existing) return null;

  let fileKey = existing.fileKey;

  if (file) {
    if (fileKey) await deleteFromS3(fileKey);

    fileKey = await uploadBufferToS3(
      file.buffer,
      file.originalname,
      file.mimetype
    );
  }

  const updated = await DocumentModel.findByIdAndUpdate(
    id,
    { ...data, fileKey },
    { new: true, lean: true }
  );

  if (!updated) return null;

  return {
    ...updated,
    fileUrl: updated.fileKey ? await getPresignedUrl(updated.fileKey) : null,
  };
};

// =============================
// DELETE DOCUMENT
// =============================
export const remove = async (id: string) => {
  const existing = await DocumentModel.findById(id);
  if (!existing) return null;

  if (existing.fileKey) {
    await deleteFromS3(existing.fileKey);
  }

  await DocumentModel.findByIdAndDelete(id);
  return true;
};
