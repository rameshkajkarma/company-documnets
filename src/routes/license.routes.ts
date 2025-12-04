import { Router } from 'express';
import * as controller from '../controllers/license.controller';
import multer from 'multer';
import { validate } from '../middlewares/validate.middleware';
import { createLicenseSchema, updateLicenseSchema } from '../dto/license.dto';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

// Create license (file optional)
router.post('/', upload.single('document'), validate(createLicenseSchema), controller.createLicense);

// List with pagination
router.get('/', controller.listLicenses);

// Get one
router.get('/:id', controller.getLicense);

// Update (file optional)
router.put('/:id', upload.single('document'), validate(updateLicenseSchema), controller.updateLicense);

// Delete
router.delete('/:id', controller.deleteLicense);

// Get presigned URL for the document
router.get('/:id/document', controller.getDocumentPresignedUrl);

export default router;
