// import { Router } from "express";
// import multer from "multer";
// import { DocumentController } from "../controllers/document.controller";
// import { DocumentMiddleware } from "../middlewares/document.middleware";

// const upload = multer({ storage: multer.memoryStorage() });
// const router = Router();

// router.post(
//   "/",
//   upload.single("file"),
//   DocumentMiddleware.validateCreate,
//   DocumentController.create
// );

// router.get("/", DocumentController.list);

// router.get("/:id", DocumentController.getById);

// router.put(
//   "/:id",
//   upload.single("file"),
//   DocumentMiddleware.validateUpdate,
//   DocumentController.update
// );

// router.delete("/:id", DocumentController.delete);

// export default router;
import { Router } from "express";
import multer from "multer";

import {
  validateDocumentBody,
  validateDocumentParams,
} from "../middlewares/document.middleware";

import {
  createDocumentSchema,
  updateDocumentSchema,
  getDocumentByIdSchema,
} from "../dto/document.dto";

import * as DocumentController from "../controllers/document.controller";

const router = Router();

// SIMPLE MULTER (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// CREATE
router.post(
  "/",
  upload.single("file"),
  validateDocumentBody(createDocumentSchema),
  DocumentController.create
);

// LIST ALL
router.get("/", DocumentController.list);

// GET ONE
router.get(
  "/:id",
  validateDocumentParams(getDocumentByIdSchema),
  DocumentController.getOne
);

// UPDATE
router.put(
  "/:id",
  upload.single("file"),
  validateDocumentParams(getDocumentByIdSchema),
  validateDocumentBody(updateDocumentSchema),
  DocumentController.update
);

// DELETE
router.delete(
  "/:id",
  validateDocumentParams(getDocumentByIdSchema),
  DocumentController.remove
);

export default router;
