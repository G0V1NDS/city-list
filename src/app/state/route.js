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

router
  .route("/:id([0-9a-fA-F]{24})")
  // remove state (accessed at DELETE /api/states/:id)
  .delete(c(controller.remove, ({ params }) => [params]))
  // get state (accessed at GET /api/states/:id)
  .get(c(controller.get, ({ params }) => [params]));

export default router;
