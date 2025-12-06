import { Request, Response } from "express";
import { softwareService } from "../services/software.service";
import { sendSuccess, sendCreated, sendError } from "../utils/response.util";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../utils/response.util";

const parseDDMMYYYY = (s?: string | null): Date | null => {
  if (!s) return null;
  const parts = s.split("-");
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts.map(p => parseInt(p, 10));
  if (!dd || !mm || !yyyy) return null;
  return new Date(yyyy, mm - 1, dd);
};

class SoftwareController {
  async create(req: Request, res: Response) {
    try {
      const body: any = { ...req.body };

      if (body.purchaseDate) body.purchaseDate = parseDDMMYYYY(body.purchaseDate);
      if (body.expiryDate) body.expiryDate = parseDDMMYYYY(body.expiryDate);

      const created = await softwareService.createSoftware(body);

      return sendCreated(res, SUCCESS_MESSAGES.SOFTWARE_CREATED, created);
    } catch (err: any) {

      if (err?.code === 11000 && err.keyValue?.licenseKey) {
        return sendError(res, 409, ERROR_MESSAGES.LICENSE_KEY_EXISTS);
      }

      return sendError(
        res,
        500,
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        err?.message ?? err
      );
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const q = res.locals.validatedQuery || req.query;
      const page = Number(q.page || 1);
      const limit = Number(q.limit || 10);

      const filter: any = {};

      if (q.licenseType) filter.licenseType = q.licenseType;
      if (q.assignedDepartment) filter.assignedDepartment = q.assignedDepartment;
      if (q.status) filter.status = q.status;
      if (q.vendor) filter.vendor = { $regex: q.vendor, $options: "i" };

      const result = await softwareService.getAll(filter, page, limit);

      return sendSuccess(res, SUCCESS_MESSAGES.SOFTWARE_LIST_FETCHED, result);
    } catch (err: any) {
      return sendError(
        res,
        500,
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        err?.message ?? err
      );
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const item = await softwareService.getById(id);

      if (!item) {
        return sendError(res, 404, ERROR_MESSAGES.SOFTWARE_NOT_FOUND);
      }

      return sendSuccess(res, SUCCESS_MESSAGES.SOFTWARE_FETCHED, item);
    } catch (err: any) {
      return sendError(
        res,
        500,
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        err?.message ?? err
      );
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const body: any = { ...req.body };

      if (body.purchaseDate) body.purchaseDate = parseDDMMYYYY(body.purchaseDate);
      if (body.expiryDate) body.expiryDate = parseDDMMYYYY(body.expiryDate);

      const updated = await softwareService.updateSoftware(id, body);

      if (!updated) {
        return sendError(res, 404, ERROR_MESSAGES.SOFTWARE_NOT_FOUND);
      }

      return sendSuccess(res, SUCCESS_MESSAGES.SOFTWARE_UPDATED, updated);
    } catch (err: any) {

      if (err?.code === 11000 && err.keyValue?.licenseKey) {
        return sendError(res, 409, ERROR_MESSAGES.LICENSE_KEY_EXISTS);
      }

      return sendError(
        res,
        500,
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        err?.message ?? err
      );
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const removed = await softwareService.deleteSoftware(id);

      if (!removed) {
        return sendError(res, 404, ERROR_MESSAGES.SOFTWARE_NOT_FOUND);
      }

      return sendSuccess(res, SUCCESS_MESSAGES.SOFTWARE_DELETED, removed);
    } catch (err: any) {
      return sendError(
        res,
        500,
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        err?.message ?? err
      );
    }
  }
}

export const softwareController = new SoftwareController();
