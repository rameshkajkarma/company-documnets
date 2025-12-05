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

export const getAll = async () => {
  const licenses = await License.find().lean(); // lean = removes __v

  return await Promise.all(
    licenses.map(async (item) => ({
      ...item,
      documentUrl: item.documentKey
        ? await getPresignedUrl(item.documentKey)
        : null,
    }))
  );
};

export const getOne = async (id: string) => {
  const license = await License.findById(id).lean();
  if (!license) return null;

  return {
    ...license,
    documentUrl: license.documentKey
      ? await getPresignedUrl(license.documentKey)
      : null,
  };
};

export const update = async (
  id: string,
  data: any,
  file?: Express.Multer.File
) => {
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
