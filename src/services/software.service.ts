import { SoftwareModel, ISoftware } from "../models/software.model";
import { FilterQuery } from "mongoose";

const parseToDDMMYYYY = (d?: Date | null) => d;

class SoftwareService {
  async createSoftware(payload: Partial<ISoftware>): Promise<ISoftware> {
    const doc = await SoftwareModel.create(payload);
    return doc.toObject();
  }

  async getAll(filter: FilterQuery<ISoftware> = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      SoftwareModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean().select("-__v"),
      SoftwareModel.countDocuments(filter)
    ]);
    const pages = Math.max(1, Math.ceil(total / limit));
    return { items, pagination: { total, page, limit, pages } };
  }


  async getById(id: string) {
    return SoftwareModel.findById(id).lean().select("-__v");
  }

  
  async updateSoftware(id: string, payload: Partial<ISoftware>) {
    return SoftwareModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean().select("-__v");
  }

  async deleteSoftware(id: string) {
    return SoftwareModel.findByIdAndDelete(id).lean().select("-__v");
  }

  async findByLicenseKey(key: string) {
    return SoftwareModel.findOne({ licenseKey: key }).lean().select("-__v");
  }
}

export const softwareService = new SoftwareService();
