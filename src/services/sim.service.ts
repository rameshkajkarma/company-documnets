import { SimModel, ISim } from "../models/sim.model";
import { FilterQuery } from "mongoose";

const formatToDDMMYYYY = (date: Date): string => {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
};

class SimService {
  async createSim(payload: Partial<ISim>): Promise<ISim> {
    if (payload.activationDate) {
      payload.activationDate = formatToDDMMYYYY(new Date(payload.activationDate)) as any;
    }
    if (payload.expiryDate) {
      payload.expiryDate = formatToDDMMYYYY(new Date(payload.expiryDate)) as any;
    }
    const sim = await SimModel.create(payload);
    return sim.toObject();
  }

  async getAllSims(filter: FilterQuery<ISim> = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      SimModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .select("-__v"),
      SimModel.countDocuments(filter)
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getSimById(id: string) {
    return SimModel.findById(id).lean().select("-__v");
  }

  async updateSim(id: string, payload: Partial<ISim>) {
    if (payload.activationDate) {
      payload.activationDate = formatToDDMMYYYY(new Date(payload.activationDate)) as any;
    }
    if (payload.expiryDate) {
      payload.expiryDate = formatToDDMMYYYY(new Date(payload.expiryDate)) as any;
    }
    return SimModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    })
      .lean()
      .select("-__v");
  }

  async deleteSim(id: string) {
    return SimModel.findByIdAndDelete(id).lean().select("-__v");
  }

  async getBySimNumber(simNumber: string) {
    return SimModel.findOne({ simNumber }).lean().select("-__v");
  }
}

export const simService = new SimService();
