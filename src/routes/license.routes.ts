import { Router } from "express";
import multer from "multer";

import * as LicenseController from "../controllers/license.controller";
import { validateRequest, validateParams } from "../middlewares/validate.middleware";
import { createLicenseDto, updateLicenseDto, licenseIdDto } from "../dto/license.dto";

const router = Router();

// USE MEMORY STORAGE (REQUIRED FOR S3)
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  upload.single("document"),          // multer first
  validateRequest(createLicenseDto),  // then validation
  LicenseController.create            // then controller
);

router.get("/", LicenseController.getAll);

router.get("/:id", validateParams(licenseIdDto), LicenseController.getOne);

router.put(
  "/:id",
  upload.single("document"),
  validateParams(licenseIdDto),
  validateRequest(updateLicenseDto),
  LicenseController.update
);

router.delete("/:id", validateParams(licenseIdDto), LicenseController.remove);

export default router;
