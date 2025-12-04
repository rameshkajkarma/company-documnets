import { Request, Response } from "express";
import { allowedStandards } from "../models/iso.model";
import {
  createISO,
  listISO,
  getISOById,
  updateISO,
  deleteISO
} from "../services/iso.service";

import { uploadBufferToS3, getPresignedUrl } from "../utils/s3.util";

export const createISOController = async (req: Request, res: Response) => {
  try {
    const {
      certificateName,
      isoStandard,
      issueDate,
      expiryDate,
      certifyingBody
    } = req.body;

    // ❌ Validate ISO Standard
    if (!allowedStandards.includes(isoStandard)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ISO Standard. Only predefined ISO standards allowed."
      });
    }

    // File validation
    if (!req.file)
      return res.status(400).json({ success: false, message: "File required" });

    // Upload to S3
    const fileKey = await uploadBufferToS3(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    const iso = await createISO({
      certificateName,
      isoStandard,
      issueDate,
      expiryDate,
      certifyingBody,
      fileKey
    });

    res.status(201).json({ success: true, data: iso });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};

export const listISOController = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await listISO(page, limit);

    // Add status dynamically
    const docsWithStatus = await Promise.all(
      result.docs.map(async (doc: any) => {
        let status = "Active";
        const now = new Date();
        const expiry = new Date(doc.expiryDate);
        const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 86400));

        if (diffDays <= 0) status = "Expired";
        else if (diffDays <= 30) status = "Expiring Soon";

        const presignedUrl = await getPresignedUrl(doc.fileKey);

        return {
          ...doc._doc,
          status,
          fileUrl: presignedUrl
        };
      })
    );

    res.json({
      success: true,
      total: result.total,
      page,
      limit,
      totalPages: result.totalPages,
      docs: docsWithStatus
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};

export const getISOByIdController = async (req: Request, res: Response) => {
  try {
    const iso = await getISOById(req.params.id);
    if (!iso)
      return res.status(404).json({ success: false, message: "ISO Not Found" });

    const fileUrl = await getPresignedUrl(iso.fileKey);

    res.json({
      success: true,
      data: {
        ...iso.toObject(),
        fileUrl
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};

export const updateISOController = async (req: Request, res: Response) => {
  try {
    if (req.body.isoStandard &&
      !allowedStandards.includes(req.body.isoStandard)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ISO Standard"
      });
    }

    const iso = await updateISO(req.params.id, req.body);
    if (!iso)
      return res.status(404).json({ success: false, message: "ISO Not Found" });

    res.json({ success: true, data: iso });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};

export const deleteISOController = async (req: Request, res: Response) => {
  try {
    const iso = await deleteISO(req.params.id);
    if (!iso)
      return res.status(404).json({ success: false, message: "ISO Not Found" });

    res.json({ success: true, message: "ISO Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};
