import express from "express";
import stateRoutes from "./src/app/state/route";
import districtRoutes from "./src/app/district/route";
import townRoutes from "./src/app/town/route";

const router = express.Router();

/** GET /health-check - Check service health */
router.get("/health-check", (req, res) => res.send("OK"));

// mount state routes at /state
router.use("/states", stateRoutes);
router.use("/districts", districtRoutes);
router.use("/towns", townRoutes);
export default router;
