// config should be imported before importing any other file
import config from "@config";
import app from "@config/express";
import logger from "utils/logger";
/* eslint-disable-next-line no-unused-vars */
import db from "@config/mongoose";

if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    logger.info(`server started on port ${config.port} (${config.env})`);
  });
}

export default app;
