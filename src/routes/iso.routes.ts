import { Router } from "express";
import multer from "multer";

import {
  createISOController,
  listISOController,
  getISOByIdController,
  updateISOController,
  deleteISOController
} from "../controllers/iso.controller";

import { isoMiddleware } from "../middlewares/iso.middleware";

const upload = multer();
const router = Router();

// Create ISO
router.post(
  "/",
  isoMiddleware,
  upload.single("file"),
  createISOController
);

// List ISO with pagination
router.get("/", listISOController);

// Get ISO by ID
router.get("/:id", getISOByIdController);

// Update ISO
router.put("/:id", upload.single("file"), updateISOController);

// Delete ISO
router.delete("/:id", deleteISOController);

export default router;
