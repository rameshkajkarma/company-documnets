import { Router } from "express";
import multer from "multer";

import * as AuditController from "../controllers/audit.controller";
import { validateRequest, validateParams } from "../middlewares/validate.middleware";

import {
  createAuditDto,
  updateAuditDto,
  auditIdDto
} from "../dto/audit.dto";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  upload.single("file"),
  validateRequest(createAuditDto),
  AuditController.create
);

router.get("/", AuditController.list);

router.get(
  "/:id",
  validateParams(auditIdDto),
  AuditController.getById
);

router.put(
  "/:id",
  upload.single("file"),
  validateParams(auditIdDto),
  validateRequest(updateAuditDto),
  AuditController.update
);

router.delete(
  "/:id",
  validateParams(auditIdDto),
  AuditController.deleteAudit
);

export default router;
