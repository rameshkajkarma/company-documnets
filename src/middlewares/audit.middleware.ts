import { Request, Response, NextFunction } from "express";
import { CreateAuditDTO, UpdateAuditDTO } from "../dto/audit.dto";
import { allowedAuditTypes } from "../models/audit.model";

export class AuditMiddleware {
  static validateCreate(req: Request, res: Response, next: NextFunction) {
    const body = req.body as CreateAuditDTO;

    if (!body.name)
      return res.status(400).json({ message: "Audit name is required" });

    if (!body.type)
      return res.status(400).json({ message: "Audit type is required" });

    // ✅ Validate type against allowed list
    if (!allowedAuditTypes.includes(body.type))
      return res.status(400).json({
        message: `Invalid audit type. Allowed: ${allowedAuditTypes.join(", ")}`
      });

    if (!body.periodStart)
      return res.status(400).json({ message: "Audit period start is required" });

    if (!body.periodEnd)
      return res.status(400).json({ message: "Audit period end is required" });

    if (!body.auditor)
      return res.status(400).json({ message: "Auditor is required" });

    if (!body.completionDate)
      return res.status(400).json({ message: "Completion date is required" });

    next();
  }

  static validateUpdate(req: Request, res: Response, next: NextFunction) {
    const body = req.body as UpdateAuditDTO;

    // If type is being updated → validate it
    if (body.type && !allowedAuditTypes.includes(body.type)) {
      return res.status(400).json({
        message: `Invalid audit type. Allowed: ${allowedAuditTypes.join(", ")}`
      });
    }

    next();
  }
}
