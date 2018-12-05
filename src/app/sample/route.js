import express from "express";
import c from "helpers/controlHandler";
import controller from "./controller";

const router = express.Router();

router
  .route("/")
  // create new sample (accessed at POST /api/samples)
  .post(c(controller.create, ({ body }) => [body]))
  // list all samples (accessed at GET /api/samples)
  .get(c(controller.list, ({ query }) => [query]));

router
  .route("/:id([0-9a-fA-F]{24})")
  // update sample (accessed at PUT /api/samples/:id)
  .put(c(controller.update, ({ params, body }) => [params, body]))
  // remove sample (accessed at DELETE /api/samples/:id)
  .delete(c(controller.remove, ({ params }) => [params]))
  // get sample (accessed at GET /api/samples/:id)
  .get(c(controller.get, ({ params }) => [params]));

export default router;
