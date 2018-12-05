import express from "express";
import sampleRoutes from "./src/app/sample/route";

const router = express.Router();

/** GET /health-check - Check service health */
router.get("/health-check", (req, res) => res.send("OK"));

// mount sample routes at /sample
router.use("/samples", sampleRoutes);
export default router;
