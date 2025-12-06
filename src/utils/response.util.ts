import { Response } from "express";

export const SUCCESS_MESSAGES = {
  LICENSE_CREATED: "License created successfully",
  LICENSE_LIST_FETCHED: "License list fetched successfully",
  LICENSE_FETCHED: "License fetched successfully",
  LICENSE_UPDATED: "License updated successfully",
  LICENSE_DELETED: "License deleted successfully",

  DOCUMENT_CREATED: "Document created successfully",
  DOCUMENT_LIST_FETCHED: "Document list fetched successfully",
  DOCUMENT_FETCHED: "Document fetched successfully",
  DOCUMENT_UPDATED: "Document updated successfully",
  DOCUMENT_DELETED: "Document deleted successfully",

  ISO_CREATED: "ISO document created successfully",
  ISO_LIST_FETCHED: "ISO document list fetched successfully",
  ISO_FETCHED: "ISO document fetched successfully",
  ISO_UPDATED: "ISO document updated successfully",
  ISO_DELETED: "ISO document deleted successfully",

  SIM_CREATED: "SIM created successfully",
  SIM_LIST_FETCHED: "SIM list fetched successfully",
  SIM_FETCHED: "SIM fetched successfully",
  SIM_UPDATED: "SIM updated successfully",
  SIM_DELETED: "SIM deleted successfully",
};

export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: "Something went wrong",
  VALIDATION_FAILED: "Validation failed",
  INVALID_ID: "Invalid ID format",

  LICENSE_NOT_FOUND: "License not found",

  DOCUMENT_NOT_FOUND: "Document not found",
  DOCUMENT_UPLOAD_FAILED: "Document upload failed",
  DOCUMENT_DELETE_FAILED: "Document delete failed",

  ISO_NOT_FOUND: "ISO document not found",
  ISO_UPLOAD_FAILED: "ISO document upload failed",
  ISO_DELETE_FAILED: "ISO document delete failed",

  SIM_NOT_FOUND: "SIM not found",
  SIM_UPLOAD_FAILED: "SIM upload failed",
  SIM_DELETE_FAILED: "SIM delete failed",
};

export const sendSuccess = (
  res: Response,
  message: string,
  data: any = null
) => {
  return res.status(200).json({
    success: true,
    statusCode: 200,
    message,
    data,
  });
};

export const sendCreated = (
  res: Response,
  message: string,
  data: any = null
) => {
  return res.status(201).json({
    success: true,
    statusCode: 201,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  error: any = null
) => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    error,
  });
};

export const throwJoiValidationError = (message: string) => {
  const error: any = new Error(message);
  error.type = "JoiValidationError";
  error.statusCode = 400;
  return error;
};
