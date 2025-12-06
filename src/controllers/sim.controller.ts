import { Request, Response } from "express";
import { simService } from "../services/sim.service";
import { sendSuccess, sendCreated, sendError, SUCCESS_MESSAGES, ERROR_MESSAGES } from "../utils/response.util";


const parseDDMMYYYY = (s?: string | null): Date | null => {
  if (!s) return null;
  // Expect DD-MM-YYYY
  const parts = s.split("-");
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts.map((p) => parseInt(p, 10));
  if (!dd || !mm || !yyyy) return null;
  // Note: month index is 0-based
  return new Date(yyyy, mm - 1, dd);
};

class SimController {
  async create(req: Request, res: Response) {
    try {
      const body = { ...req.body };

      // convert dd-mm-yyyy to Date objects for storage
      if (body.activationDate) body.activationDate = parseDDMMYYYY(body.activationDate);
      if (body.expiryDate) body.expiryDate = parseDDMMYYYY(body.expiryDate);

      const sim = await simService.createSim(body);
      return sendCreated(res, SUCCESS_MESSAGES.SIM_CREATED, sim);
    } catch (err: any) {
      // duplicate key (unique simNumber)
      if (err?.code === 11000) {
        return sendError(res, 409, `SIM with same simNumber already exists.`);
      }
      return sendError(res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, err?.message ?? err);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, carrier, status, department } = req.query as any;

      const filter: any = {};
      if (carrier) filter.carrier = carrier;
      if (status) filter.status = status;
      if (department) filter.department = department;

      const { items, total } = await simService.getAllSims(filter, Number(page), Number(limit));
      const meta = {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit) || 1),
      };
      return sendSuccess(res, SUCCESS_MESSAGES.SIM_LIST_FETCHED, { items, meta });
    } catch (err: any) {
      return sendError(res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, err?.message ?? err);
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const sim = await simService.getSimById(id);
      if (!sim) return sendError(res, 404, ERROR_MESSAGES.SIM_NOT_FOUND);
      return sendSuccess(res, SUCCESS_MESSAGES.SIM_FETCHED, sim);
    } catch (err: any) {
      return sendError(res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, err?.message ?? err);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const body = { ...req.body };
      if (body.activationDate) body.activationDate = parseDDMMYYYY(body.activationDate);
      if (body.expiryDate) body.expiryDate = parseDDMMYYYY(body.expiryDate);

      const sim = await simService.updateSim(id, body);
      if (!sim) return sendError(res, 404, ERROR_MESSAGES.SIM_NOT_FOUND);
      return sendSuccess(res, SUCCESS_MESSAGES.SIM_UPDATED, sim);
    } catch (err: any) {
      // duplicate key while updating
      if (err?.code === 11000) {
        return sendError(res, 409, `SIM with same simNumber already exists.`);
      }
      return sendError(res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, err?.message ?? err);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const sim = await simService.deleteSim(id);
      if (!sim) return sendError(res, 404, ERROR_MESSAGES.SIM_NOT_FOUND);
      return sendSuccess(res, SUCCESS_MESSAGES.SIM_DELETED, sim);
    } catch (err: any) {
      return sendError(res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, err?.message ?? err);
    }
  }
}

export const simController = new SimController();
