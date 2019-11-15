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

router
  .route("/:id([0-9a-fA-F]{24})")
  // remove district (accessed at DELETE /api/districts/:id)
  .delete(c(controller.remove, ({ params }) => [params]))
  // get district (accessed at GET /api/districts/:id)
  .get(c(controller.get, ({ params }) => [params]));

export default router;
