import express from "express";
import multer from "multer";
import fs from "fs";
import c from "helpers/controlHandler";
import { maxCSVFileSize } from "src/helpers/constants";
import logger from "utils/logger";
import config from "@config";
import stateRoutes from "./src/app/state/route";
import districtRoutes from "./src/app/district/route";
import townRoutes from "./src/app/town/route";
import stateController from "./src/app/state/controller";

const router = express.Router();

/**
 * Common middleware for file upload
 * @param {Object} allowedMimeTypes List of allowed
 * @param {Number} allowedSize Max file size
 */
const checkFile = (allowedMimeTypes, allowedSize) => {
  logger.info(
    `allowedMimeTypes: ${allowedMimeTypes}, allowedSize: ${allowedSize}`,
  );
  // Multer disc storage configuration
  const storage = multer.diskStorage({
    // Multer configuration to rename the uploaded file
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname.replace(/ /g, "-")}`);
    },
    // Multer configuration to set file upload destination
    destination: (req, file, cb) => {
      const { uploadDir } = config;
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
  });
  const fileFilter = (req, file, cb) => {
    // File should be in the last parameter to access body here
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("FILE_TYPE"));
    }
  };

  // Multer middleware
  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: allowedSize },
  });
  return upload.single("file");
};

/** GET /health-check - Check service health */
router.get("/health-check", (req, res) => res.send("OK"));

// mount state routes at /state
router.use("/states", stateRoutes);
router.use("/districts", districtRoutes);
router.use("/towns", townRoutes);
router
  .route("/init-db/")
  // Import from csv (accessed at POST http://localhost/api/init-db)
  .post(
    checkFile(["text/csv", "application/vnd.ms-excel"], maxCSVFileSize),
    c(stateController.initDB, ({ file, jwtData }) => [file, jwtData]),
  );

export default router;
