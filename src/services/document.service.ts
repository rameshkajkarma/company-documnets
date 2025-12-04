import DocumentModel from "../models/document.model";
import { uploadToS3 } from "../utils/s3.util";
import { CreateDocumentDTO, UpdateDocumentDTO } from "../dto/document.dto";

export class DocumentService {
  // CREATE
  static async createDocument(data: CreateDocumentDTO, file?: Express.Multer.File) {
    const fileKey = file ? await uploadToS3(file) : null;

    const doc = await DocumentModel.create({
      name: data.name,
      category: data.category,
      documentDate: new Date(data.documentDate), // FIX: convert string → Date
      partiesInvolved: data.partiesInvolved,
      fileKey,
    });

    return doc;
  }

  // FORMAT RESPONSE
  static formatDocument(doc: any) {
    const today = new Date();
    const docDate = new Date(doc.documentDate);

    const status = docDate >= today ? "Active" : "Archived";

    return {
      ...doc.toObject(),
      status,
    };
  }

  // LIST
  static async listDocuments() {
    const docs = await DocumentModel.find().sort({ createdAt: -1 });
    return docs.map((d) => this.formatDocument(d));
  }

  // GET BY ID
  static async getDocumentById(id: string) {
    const doc = await DocumentModel.findById(id);
    return doc ? this.formatDocument(doc) : null;
  }

  // UPDATE
  static async updateDocument(id: string, data: UpdateDocumentDTO, file?: Express.Multer.File) {
    const doc = await DocumentModel.findById(id);
    if (!doc) return null;

    if (file) {
      doc.fileKey = await uploadToS3(file);
    }

    doc.name = data.name ?? doc.name;
    doc.category = data.category ?? doc.category;

    // FIX: convert string → Date only if sent in update
    if (data.documentDate) {
      doc.documentDate = new Date(data.documentDate);
    }

    doc.partiesInvolved = data.partiesInvolved ?? doc.partiesInvolved;

    await doc.save();
    return this.formatDocument(doc);
  }

  // DELETE
  static async deleteDocument(id: string) {
    return await DocumentModel.findByIdAndDelete(id);
  }
}
