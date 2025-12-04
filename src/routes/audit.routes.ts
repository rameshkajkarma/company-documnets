import { Router } from "express";
import multer from "multer";
import { AuditController } from "../controllers/audit.controller";
import { AuditMiddleware } from "../middlewares/audit.middleware";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post("/", upload.single("file"), AuditMiddleware.validateCreate, AuditController.create);

router.get("/", AuditController.list);

router.get("/:id", AuditController.getById);

router.put("/:id", upload.single("file"), AuditMiddleware.validateUpdate, AuditController.update);

router.delete("/:id", AuditController.delete);

export default router;
