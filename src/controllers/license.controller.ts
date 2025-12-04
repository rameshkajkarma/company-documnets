import { Request, Response, NextFunction } from 'express';
import * as licenseService from '../services/license.service';
import { uploadBufferToS3, getPresignedUrl } from '../utils/s3.util';
import { LicenseModel } from '../models/license.model';
import mongoose from 'mongoose';

export const createLicense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;

    if (req.file) {
      const key = await uploadBufferToS3(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
      body.documentKey = key;
    }

    const doc = await licenseService.createLicense(body);
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

export const listLicenses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ⭐ PAGINATION ADDED HERE ⭐
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const sortBy = String(req.query.sortBy || 'createdAt');
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const [items, total] = await Promise.all([
      LicenseModel.find()
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
      LicenseModel.countDocuments()
    ]);

    res.json({
      success: true,
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getLicense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: 'Invalid id' });

    const result = await licenseService.getLicense(id);
    if (!result) return res.status(404).json({ success: false, message: 'Not found' });

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const updateLicense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const body = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: 'Invalid id' });

    if (req.file) {
      const key = await uploadBufferToS3(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
      body.documentKey = key;
    }

    const updated = await licenseService.updateLicense(id, body);
    if (!updated) return res.status(404).json({ success: false, message: 'Not found' });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteLicense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: 'Invalid id' });

    const deleted = await licenseService.deleteLicense(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Not found' });

    res.json({ success: true, data: deleted });
  } catch (err) {
    next(err);
  }
};

export const getDocumentPresignedUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: 'Invalid id' });

    const doc = await LicenseModel.findById(id);
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    if (!doc.documentKey)
      return res.status(404).json({ success: false, message: 'Document not uploaded' });

    const url = await getPresignedUrl(doc.documentKey);

    res.json({ success: true, url });
  } catch (err) {
    next(err);
  }
};
