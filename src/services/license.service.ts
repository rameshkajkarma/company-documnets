// src/services/license.service.ts
import License from "../models/license.model";
import {
  uploadBufferToS3,
  getPresignedUrl,
  deleteFromS3,
} from "../utils/s3.util";

export const create = async (data: any, file?: Express.Multer.File) => {
  let documentKey: string | undefined;

  if (file) {
    documentKey = await uploadBufferToS3(
      file.buffer,
      file.originalname,
      file.mimetype
    );
  }

  const license = await License.create({
    ...data,
    documentKey,
  });

  return license.toObject();
};

// ------------------ GET ALL WITH PAGINATION + STATUS ------------------
export const getAll = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const total = await License.countDocuments();

  const licenses = await License.find()
    .skip(skip)
    .limit(limit)
    .lean();

  const today = new Date();

  const data = await Promise.all(
    licenses.map(async (item) => {
      const expiry = new Date(item.expiryDate);

      let status = "Active";
      const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) status = "Expired";
      else if (diffDays <= 30) status = "Expiring Soon";

      return {
        ...item,
        status,
        documentUrl: item.documentKey
          ? await getPresignedUrl(item.documentKey)
          : null,
      };
    })
  );

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getOne = async (id: string) => {
  const license = await License.findById(id).lean();
  if (!license) return null;

  const today = new Date();
  const expiry = new Date(license.expiryDate);

  let status = "Active";
  const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) status = "Expired";
  else if (diffDays <= 30) status = "Expiring Soon";

  return {
    ...license,
    status,
    documentUrl: license.documentKey
      ? await getPresignedUrl(license.documentKey)
      : null,
  };
};

export const update = async (id: string, data: any, file?: Express.Multer.File) => {
  const existing = await License.findById(id);
  if (!existing) return null;

  let documentKey = existing.documentKey;

  if (file) {
    if (existing.documentKey) {
      await deleteFromS3(existing.documentKey);
    }

    documentKey = await uploadBufferToS3(
      file.buffer,
      file.originalname,
      file.mimetype
    );
  }

  const updated = await License.findByIdAndUpdate(
    id,
    { ...data, documentKey },
    { new: true, lean: true }
  );

  if (!updated) return null;

  return {
    ...updated,
    documentUrl: updated.documentKey
      ? await getPresignedUrl(updated.documentKey)
      : null,
  };
};

export const remove = async (id: string) => {
  const existing = await License.findById(id);
  if (!existing) return null;

  if (existing.documentKey) {
    await deleteFromS3(existing.documentKey);
  }

  await License.findByIdAndDelete(id);

  return true;
};
