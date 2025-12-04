import AuditModel from "../models/audit.model";
import { uploadToS3, getPresignedUrl } from "../utils/s3.util";
import { CreateAuditDTO, UpdateAuditDTO } from "../dto/audit.dto";

export class AuditService {
  // create
  static async createAudit(data: CreateAuditDTO, file?: Express.Multer.File) {
    const fileKey = file ? await uploadToS3(file) : null;

    const doc = await AuditModel.create({
      name: data.name,
      type: data.type,
      periodStart: new Date(data.periodStart),
      periodEnd: new Date(data.periodEnd),
      auditor: data.auditor,
      completionDate: new Date(data.completionDate),
      fileKey
    });

    return doc;
  }

  // format + compute status + fileUrl
  static async formatAudit(doc: any) {
    const now = new Date();
    const periodStart = new Date(doc.periodStart);
    const periodEnd = new Date(doc.periodEnd);
    const completion = new Date(doc.completionDate);

    let status = "Scheduled";
    if (now > completion) {
      status = "Completed";
    } else if (now >= periodStart && now <= periodEnd) {
      status = "In Progress";
    } else if (now < periodStart) {
      status = "Scheduled";
    }

    const fileUrl = doc.fileKey ? await getPresignedUrl(doc.fileKey) : null;

    return {
      ...doc.toObject(),
      status,
      fileUrl
    };
  }

  // list
static async listAudits(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const total = await AuditModel.countDocuments();

  const docs = await AuditModel.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const formatted = await Promise.all(docs.map((d) => this.formatAudit(d)));

  return {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    data: formatted
  };
}


  // get by id
  static async getAuditById(id: string) {
    const doc = await AuditModel.findById(id);
    return doc ? await this.formatAudit(doc) : null;
  }

  // update
  static async updateAudit(id: string, data: UpdateAuditDTO, file?: Express.Multer.File) {
    const doc = await AuditModel.findById(id);
    if (!doc) return null;

    if (file) {
      doc.fileKey = await uploadToS3(file);
    }

    if (data.name) doc.name = data.name;
    if (data.type) doc.type = data.type;
    if (data.periodStart) doc.periodStart = new Date(data.periodStart);
    if (data.periodEnd) doc.periodEnd = new Date(data.periodEnd);
    if (data.auditor) doc.auditor = data.auditor;
    if (data.completionDate) doc.completionDate = new Date(data.completionDate);

    await doc.save();
    return await this.formatAudit(doc);
  }

  // delete
  static async deleteAudit(id: string) {
    return await AuditModel.findByIdAndDelete(id);
  }
}
