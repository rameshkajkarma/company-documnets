import { ISOModel } from "../models/iso.model";

export const createISO = async (data: any) => {
  return await ISOModel.create(data);
};

export const listISO = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const total = await ISOModel.countDocuments();

  const docs = await ISOModel.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    docs
  };
};

export const getISOById = async (id: string) => {
  return await ISOModel.findById(id);
};

export const updateISO = async (id: string, data: any) => {
  return await ISOModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteISO = async (id: string) => {
  return await ISOModel.findByIdAndDelete(id);
};
