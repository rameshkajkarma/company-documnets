import { LicenseModel, ILicense } from '../models/license.model';
import { getPresignedUrl } from '../utils/s3.util';

export enum LicenseStatus {
  NotStarted = 'NotStarted',
  Active = 'Active',
  ExpiringSoon = 'ExpiringSoon',
  Expired = 'Expired'
}

export interface LicenseWithStatus {
  data: ILicense;
  status: LicenseStatus;
  documentUrl?: string | null;
}

const computeStatus = (issueDate: Date, expiryDate: Date): LicenseStatus => {
  const now = new Date();
  if (now < issueDate) return LicenseStatus.NotStarted;
  if (now > expiryDate) return LicenseStatus.Expired;

  const diffMs = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 30) return LicenseStatus.ExpiringSoon;
  return LicenseStatus.Active;
};

export const createLicense = async (payload: Partial<ILicense>) => {
  const doc = new LicenseModel(payload);
  return await doc.save();
};

export const updateLicense = async (id: string, payload: Partial<ILicense>) => {
  return await LicenseModel.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteLicense = async (id: string) => {
  return await LicenseModel.findByIdAndDelete(id);
};

export const getLicense = async (id: string): Promise<LicenseWithStatus | null> => {
  const doc = await LicenseModel.findById(id);
  if (!doc) return null;
  const status = computeStatus(doc.issueDate, doc.expiryDate);
  let url: string | undefined;
  if (doc.documentKey) {
    url = await getPresignedUrl(doc.documentKey);
  }
  return { data: doc, status, documentUrl: url };
};

export const listLicenses = async (page = 1, limit = 10, sortBy = 'createdAt', sortOrder: 'asc' | 'desc' = 'desc') => {
  const skip = (page - 1) * limit;
  const total = await LicenseModel.countDocuments();
  const docs = await LicenseModel.find()
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(limit)
    .exec();

  // compute status for each doc and optionally return presigned urls (do not fetch urls for list to avoid extra S3 calls)
  const items = docs.map((d) => ({
    data: d,
    status: computeStatus(d.issueDate, d.expiryDate),
    documentKey: d.documentKey
  }));

  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    items
  };
};
