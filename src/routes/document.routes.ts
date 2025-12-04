import { Router } from "express";
import multer from "multer";
import { DocumentController } from "../controllers/document.controller";
import { DocumentMiddleware } from "../middlewares/document.middleware";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post(
  "/",
  upload.single("file"),
  DocumentMiddleware.validateCreate,
  DocumentController.create
);

router.get("/", DocumentController.list);

router.get("/:id", DocumentController.getById);

router.put(
  "/:id",
  upload.single("file"),
  DocumentMiddleware.validateUpdate,
  DocumentController.update
);

router.delete("/:id", DocumentController.delete);

export default router;
