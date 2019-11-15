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

router
  .route("/:id([0-9a-fA-F]{24})")
  // remove town (accessed at DELETE /api/towns/:id)
  .delete(c(controller.remove, ({ params }) => [params]))
  // get town (accessed at GET /api/town/:id)
  .get(c(controller.get, ({ params }) => [params]));

export default router;
