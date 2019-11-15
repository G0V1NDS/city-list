import express from "express";
import c from "helpers/controlHandler";
import controller from "./controller";

const router = express.Router();

router
  .route("/")
  // create new state (accessed at POST /api/states)
  .post(c(controller.create, ({ body }) => [body]))
  // list all states (accessed at GET /api/states)
  .get(c(controller.list, ({ query }) => [query]));

export default router;
