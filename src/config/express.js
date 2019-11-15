import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import methodOverride from "method-override";
import cors from "cors";
import httpStatus from "http-status";
import helmet from "helmet";
import { ALREADY_EXIST, API_NOT_FOUND } from "localization/en";
import logger from "utils/logger";
import APIError from "utils/APIError";
import routes from "../../route";
import config from "@config";

const app = express();

if (config.env === "development") {
  app.use(morgan("dev"));
}

// parse body params and attache them to req.body
app.use(bodyParser.json({ limit: config.bodyLimit }));
app.use(
  bodyParser.urlencoded({
    limit: config.bodyLimit,
    extended: true,
    parameterLimit: 50000,
  }),
);

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// mount all routes on /api path
app.use("/api", routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError(httpStatus.NOT_FOUND, API_NOT_FOUND, null, true);
  return next(err);
});

// if error is not an instanceOf APIError, convert it.
/* eslint-disable-next-line no-unused-vars */
app.use((err, req, res, next) => {
  let customErr;
  if (err.name === "MongoError") {
    switch (err.status) {
      case 11000:
        customErr = new APIError(409, ALREADY_EXIST, null, true);
        break;
      default:
        customErr = new APIError(err.status, err.message, null, err.isPublic);
    }
  }
  // if error is not an instanceOf APIError, convert it.
  if (!(err instanceof APIError)) {
    customErr = new APIError(err.status, err.message, err.data, err.isPublic);
  }

  const error = customErr || err;
  logger.error(error.message);
  let obj = {
    message: error.isPublic ? error.message : httpStatus[error.status],
    status: error.status,
  };
  if (error.data) {
    obj.data = error.data;
  }
  // error handler, send stacktrace only during non production
  if (config.env !== "production") {
    obj = { ...obj, stack: error.stack };
  }
  return res.status(error.status).json(obj);
});

export default app;
