import { Request, Response } from "express";
import * as AuditService from "../services/audit.service";
import {
  sendSuccess,
  sendCreated,
  sendError,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../utils/response.util";

export const create = async (req: Request, res: Response) => {
  try {
    const audit = await AuditService.create(req.body, req.file);
    return sendCreated(res, SUCCESS_MESSAGES.DOCUMENT_CREATED, audit);
  } catch (error: any) {
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { data, total } = await AuditService.getAll(page, limit);

    return sendSuccess(res, SUCCESS_MESSAGES.DOCUMENT_LIST_FETCHED, {
      total,
      page,
      limit,
      data,
    });
  } catch (error: any) {
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const audit = await AuditService.getOne(req.params.id);

    if (!audit) {
      return sendError(res, 404, ERROR_MESSAGES.DOCUMENT_NOT_FOUND);
    }

    return sendSuccess(res, SUCCESS_MESSAGES.DOCUMENT_FETCHED, audit);
  } catch (error: any) {
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const audit = await AuditService.update(req.params.id, req.body, req.file);

    if (!audit) {
      return sendError(res, 404, ERROR_MESSAGES.DOCUMENT_NOT_FOUND);
    }

    return sendSuccess(res, SUCCESS_MESSAGES.DOCUMENT_UPDATED, audit);
  } catch (error: any) {
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const deleteAudit = async (req: Request, res: Response) => {
  try {
    const removed = await AuditService.remove(req.params.id);

    if (!removed) {
      return sendError(res, 404, ERROR_MESSAGES.DOCUMENT_NOT_FOUND);
    }

    return sendSuccess(res, SUCCESS_MESSAGES.DOCUMENT_DELETED);
  } catch (error: any) {
    return sendError(res, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR, error.message);
  }
};
