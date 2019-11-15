import express from "express";
import c from "helpers/controlHandler";
import controller from "./controller";

const router = express.Router();

router
  .route("/")
  // create new town (accessed at POST /api/towns)
  .post(c(controller.create, ({ body }) => [body]))
  // list all towns (accessed at GET /api/towns)
  .get(c(controller.list, ({ query }) => [query]));

export default router;
