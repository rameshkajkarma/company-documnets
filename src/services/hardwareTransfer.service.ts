import { HardwareTransferModel } from "../models/hardwareTransfer.model";

export class HardwareTransferService {
  async create(data: any) {
    return await HardwareTransferModel.create(data);
  }

  async list(page: number, limit: number, filters: any) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      HardwareTransferModel.find(filters)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),

      HardwareTransferModel.countDocuments(filters),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getById(id: string) {
    return HardwareTransferModel.findById(id);
  }

  async update(id: string, data: any) {
    return HardwareTransferModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return HardwareTransferModel.findByIdAndDelete(id);
  }
}
