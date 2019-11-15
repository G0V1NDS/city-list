import express from "express";
import c from "helpers/controlHandler";
import controller from "./controller";

const router = express.Router();

router
  .route("/")
  // create new district (accessed at POST /api/districts)
  .post(c(controller.create, ({ body }) => [body]))
  // list all districts (accessed at GET /api/districts)
  .get(c(controller.list, ({ query }) => [query]));

export default router;
