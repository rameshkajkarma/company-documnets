// import { Request, Response, NextFunction } from "express";
// import { DocumentService } from "../services/document.service";

// export class DocumentController {
//   static async create(req: Request, res: Response, next: NextFunction) {
//     try {
//       const doc = await DocumentService.createDocument(req.body, req.file);
//       return res.status(201).json({
//         success: true,
//         message: "Document uploaded successfully",
//         data: DocumentService.formatDocument(doc)
//       });
//     } catch (err) {
//       next(err);
//     }
//   }

// static async list(req: Request, res: Response, next: NextFunction) {
//   try {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;

//     const docs = await DocumentService.listDocuments(page, limit);

//     return res.status(200).json({
//       success: true,
//       ...docs
//     });
//   } catch (err) {
//     next(err);
//   }
// }


//   static async getById(req: Request, res: Response, next: NextFunction) {
//     try {
//       const doc = await DocumentService.getDocumentById(req.params.id);
//       if (!doc) return res.status(404).json({ message: "Document not found" });

//       return res.status(200).json({ success: true, data: doc });
//     } catch (err) {
//       next(err);
//     }
//   }

//   static async update(req: Request, res: Response, next: NextFunction) {
//     try {
//       const doc = await DocumentService.updateDocument(
//         req.params.id,
//         req.body,
//         req.file
//       );

//       if (!doc) return res.status(404).json({ message: "Document not found" });

//       return res.status(200).json({
//         success: true,
//         message: "Document updated successfully",
//         data: doc
//       });
//     } catch (err) {
//       next(err);
//     }
//   }

//   static async delete(req: Request, res: Response, next: NextFunction) {
//     try {
//       const doc = await DocumentService.deleteDocument(req.params.id);

//       if (!doc) return res.status(404).json({ message: "Document not found" });

//       return res.status(200).json({
//         success: true,
//         message: "Document deleted successfully"
//       });
//     } catch (err) {
//       next(err);
//     }
//   }
// }
import { Request, Response } from "express";
import DocumentModel from "../models/document.model";
import {
  sendSuccess,
  sendCreated,
  sendError,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../utils/response.util";
import { uploadBufferToS3 } from "../utils/s3.util";

// 👉 STATUS FUNCTION (ADD THIS)
const getStatus = (documentDate: Date) => {
  const today = new Date();
  return new Date(documentDate) < today ? "Archived" : "Active";
};

// CREATE
export const create = async (req: Request, res: Response) => {
  try {
    const { name, category, documentDate, partiesInvolved } = req.body;

    let fileKey = null;

    if (req.file) {
      fileKey = await uploadBufferToS3(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
    }

    const newDoc = await DocumentModel.create({
      name,
      category,
      documentDate,
      partiesInvolved,
      fileKey,
    });

    return sendCreated(res, SUCCESS_MESSAGES.DOCUMENT_CREATED, newDoc);
  } catch (error) {
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, error);
  }
};

// LIST WITH PAGINATION
export const list = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total = await DocumentModel.countDocuments();

    const docs = await DocumentModel.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    // 👉 ADD STATUS HERE
    const dataWithStatus = docs.map((item) => ({
      ...item,
      status: getStatus(item.documentDate),
    }));

    return sendSuccess(res, SUCCESS_MESSAGES.DOCUMENT_LIST_FETCHED, {
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: dataWithStatus,
    });
  } catch (error) {
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, error);
  }
};

// GET ONE
export const getOne = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const doc = await DocumentModel.findById(id);
    if (!doc)
      return sendError(res, 404, ERROR_MESSAGES.DOCUMENT_NOT_FOUND);

    // 👉 ADD STATUS HERE ALSO
    const docWithStatus = {
      ...doc.toObject(),
      status: getStatus(doc.documentDate),
    };

    return sendSuccess(res, SUCCESS_MESSAGES.DOCUMENT_FETCHED, docWithStatus);
  } catch (error) {
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, error);
  }
};

// UPDATE
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    let fileKey = undefined;

    if (req.file) {
      fileKey = await uploadBufferToS3(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
    }

    const updated = await DocumentModel.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        category: req.body.category,
        documentDate: req.body.documentDate,
        partiesInvolved: req.body.partiesInvolved,
        ...(fileKey && { fileKey }),
      },
      { new: true }
    );

    if (!updated)
      return sendError(res, 404, ERROR_MESSAGES.DOCUMENT_NOT_FOUND);

    return sendSuccess(res, SUCCESS_MESSAGES.DOCUMENT_UPDATED, updated);
  } catch (error) {
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, error);
  }
};

// REMOVE
export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await DocumentModel.findByIdAndDelete(id);
    if (!deleted)
      return sendError(res, 404, ERROR_MESSAGES.DOCUMENT_NOT_FOUND);

    return sendSuccess(res, SUCCESS_MESSAGES.DOCUMENT_DELETED, deleted);
  } catch (error) {
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, error);
  }
};
