import { Request, Response, NextFunction } from "express";
import { CreateDocumentDTO, UpdateDocumentDTO } from "../dto/document.dto";

export class DocumentMiddleware {
static validateCreate(req: Request, res: Response, next: NextFunction) {
  const body = req.body as CreateDocumentDTO;

  const allowed = ["Contract", "Template", "Agreement", "Policy", "Other"];

  if (!body.name) return res.status(400).json({ message: "Name is required" });
  if (!body.category) return res.status(400).json({ message: "Category is required" });

  if (!allowed.includes(body.category)) {
    return res.status(400).json({ 
      message: `Invalid category. Allowed: ${allowed.join(", ")}` 
    });
  }

  if (!body.documentDate) return res.status(400).json({ message: "Document date is required" });
  if (!body.partiesInvolved) return res.status(400).json({ message: "Parties involved is required" });

  next();
}


  static validateUpdate(req: Request, res: Response, next: NextFunction) {
    const body = req.body as UpdateDocumentDTO;

    // Allow partial update, but at least one field must be sent
    if (!body.name && !body.category && !body.documentDate && !body.partiesInvolved && !req.file) {
      return res.status(400).json({ message: "At least one field is required to update" });
    }

    next();
  }
}
