import { Request, Response, NextFunction } from "express";
import { AuditService } from "../services/audit.service";

export class AuditController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const audit = await AuditService.createAudit(req.body, req.file);
      return res.status(201).json({
        success: true,
        message: "Audit created successfully",
        data: await AuditService.formatAudit(audit)
      });
    } catch (err) {
      next(err);
    }
  }

static async list(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const audits = await AuditService.listAudits(page, limit);

    return res.status(200).json({
      success: true,
      ...audits
    });
  } catch (err) {
    next(err);
  }
}


  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const audit = await AuditService.getAuditById(req.params.id);
      if (!audit) return res.status(404).json({ message: "Audit not found" });
      return res.status(200).json({ success: true, data: audit });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const audit = await AuditService.updateAudit(req.params.id, req.body, req.file);
      if (!audit) return res.status(404).json({ message: "Audit not found" });
      return res.status(200).json({ success: true, message: "Audit updated successfully", data: audit });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const audit = await AuditService.deleteAudit(req.params.id);
      if (!audit) return res.status(404).json({ message: "Audit not found" });
      return res.status(200).json({ success: true, message: "Audit deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}
