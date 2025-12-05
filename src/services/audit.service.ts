import Audit from "../models/audit.model";
import {
  uploadBufferToS3,
  getPresignedUrl,
  deleteFromS3,
} from "../utils/s3.util";

export const create = async (data: any, file?: Express.Multer.File) => {
  let fileKey;

  if (file) {
    fileKey = await uploadBufferToS3(file.buffer, file.originalname, file.mimetype);
  }

  const audit = await Audit.create({
    ...data,
    fileKey,
    periodStart: new Date(data.periodStart),
    periodEnd: new Date(data.periodEnd),
    completionDate: new Date(data.completionDate),
  });

  return audit.toObject();
};

const formatAudit = async (item: any) => {
  const now = new Date();
  const start = new Date(item.periodStart);
  const end = new Date(item.periodEnd);
  const completion = new Date(item.completionDate);

  let status = "Scheduled";
  if (now > completion) status = "Completed";
  else if (now >= start && now <= end) status = "In Progress";

  return {
    ...item,
    status,
    fileUrl: item.fileKey ? await getPresignedUrl(item.fileKey) : null,
  };
};

export const getAll = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [audits, total] = await Promise.all([
    Audit.find().skip(skip).limit(limit).lean(),
    Audit.countDocuments(),
  ]);

  const data = await Promise.all(audits.map((a) => formatAudit(a)));

  return { data, total };
};

export const getOne = async (id: string) => {
  const audit = await Audit.findById(id).lean();
  if (!audit) return null;

  return await formatAudit(audit);
};

export const update = async (id: string, data: any, file?: Express.Multer.File) => {
  const existing = await Audit.findById(id);
  if (!existing) return null;

  let fileKey = existing.fileKey;

  if (file) {
    if (existing.fileKey) await deleteFromS3(existing.fileKey);

    fileKey = await uploadBufferToS3(file.buffer, file.originalname, file.mimetype);
  }

  const updated = await Audit.findByIdAndUpdate(
    id,
    {
      ...data,
      fileKey,
      periodStart: data.periodStart ? new Date(data.periodStart) : existing.periodStart,
      periodEnd: data.periodEnd ? new Date(data.periodEnd) : existing.periodEnd,
      completionDate: data.completionDate ? new Date(data.completionDate) : existing.completionDate,
    },
    { new: true, lean: true }
  );

  if (!updated) return null;

  return await formatAudit(updated);
};

export const remove = async (id: string) => {
  const existing = await Audit.findById(id);
  if (!existing) return null;

  if (existing.fileKey) await deleteFromS3(existing.fileKey);

  await Audit.findByIdAndDelete(id);
  return true;
};
