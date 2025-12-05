import { Request, Response } from "express";
import License from "../models/license.model";
import {
  sendSuccess,
  sendCreated,
  sendError,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../utils/response.util";

// ------------------ CREATE ------------------
export const create = async (req: Request, res: Response) => {
  try {
    const license = await License.create(req.body);
    return sendCreated(res, SUCCESS_MESSAGES.LICENSE_CREATED, license);
  } catch (error: any) {
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, error.message);
  }
};

// ------------------ GET ALL ------------------
export const getAll = async (req: Request, res: Response) => {
  try {
    const licenses = await License.find();
    return sendSuccess(res, SUCCESS_MESSAGES.LICENSE_LIST_FETCHED, licenses);
  } catch (error: any) {
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, error.message);
  }
};

// ------------------ GET ONE ------------------
export const getOne = async (req: Request, res: Response) => {
  try {
    const license = await License.findById(req.params.id);

    if (!license) {
      return sendError(res, 404, ERROR_MESSAGES.LICENSE_NOT_FOUND);
    }

    return sendSuccess(res, SUCCESS_MESSAGES.LICENSE_FETCHED, license);
  } catch (error: any) {
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, error.message);
  }
};

// ------------------ UPDATE ------------------
export const update = async (req: Request, res: Response) => {
  try {
    const license = await License.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!license) {
      return sendError(res, 404, ERROR_MESSAGES.LICENSE_NOT_FOUND);
    }

    return sendSuccess(res, SUCCESS_MESSAGES.LICENSE_UPDATED, license);
  } catch (error: any) {
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, error.message);
  }
};

// ------------------ DELETE ------------------
export const remove = async (req: Request, res: Response) => {
  try {
    const license = await License.findById(req.params.id);

    if (!license) {
      return sendError(res, 404, ERROR_MESSAGES.LICENSE_NOT_FOUND);
    }

    await License.findByIdAndDelete(req.params.id);

    return sendSuccess(res, SUCCESS_MESSAGES.LICENSE_DELETED);
  } catch (error: any) {
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, error.message);
  }
};
