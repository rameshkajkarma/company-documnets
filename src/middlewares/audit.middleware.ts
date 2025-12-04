import { Request, Response, NextFunction } from "express";
import { CreateAuditDTO, UpdateAuditDTO } from "../dto/audit.dto";

export class AuditMiddleware {
  static validateCreate(req: Request, res: Response, next: NextFunction) {
    const body = req.body as CreateAuditDTO;

    if (!body.name) return res.status(400).json({ message: "Audit name is required" });
    if (!body.type) return res.status(400).json({ message: "Audit type is required" });
    if (!body.periodStart) return res.status(400).json({ message: "Audit period start is required" });
    if (!body.periodEnd) return res.status(400).json({ message: "Audit period end is required" });
    if (!body.auditor) return res.status(400).json({ message: "Auditor is required" });
    if (!body.completionDate) return res.status(400).json({ message: "Completion date is required" });

    next();
  }

  static validateUpdate(req: Request, res: Response, next: NextFunction) {
    const body = req.body as UpdateAuditDTO;

    if (
      !body.name &&
      !body.type &&
      !body.periodStart &&
      !body.periodEnd &&
      !body.auditor &&
      !body.completionDate &&
      !req.file
    ) {
      return res.status(400).json({ message: "At least one field or file is required to update" });
    }

    next();
  }
}
