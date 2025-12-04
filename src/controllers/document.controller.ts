import { Request, Response, NextFunction } from "express";
import { DocumentService } from "../services/document.service";

export class DocumentController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await DocumentService.createDocument(req.body, req.file);
      return res.status(201).json({
        success: true,
        message: "Document uploaded successfully",
        data: DocumentService.formatDocument(doc)
      });
    } catch (err) {
      next(err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await DocumentService.listDocuments();
      return res.status(200).json({
        success: true,
        count: docs.length,
        data: docs
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await DocumentService.getDocumentById(req.params.id);
      if (!doc) return res.status(404).json({ message: "Document not found" });

      return res.status(200).json({ success: true, data: doc });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await DocumentService.updateDocument(
        req.params.id,
        req.body,
        req.file
      );

      if (!doc) return res.status(404).json({ message: "Document not found" });

      return res.status(200).json({
        success: true,
        message: "Document updated successfully",
        data: doc
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await DocumentService.deleteDocument(req.params.id);

      if (!doc) return res.status(404).json({ message: "Document not found" });

      return res.status(200).json({
        success: true,
        message: "Document deleted successfully"
      });
    } catch (err) {
      next(err);
    }
  }
}
