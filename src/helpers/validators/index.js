import Joi from "joi";
import {
  minShortStr,
  maxShortStr,
  minStr,
  maxStr,
  minLongStr,
  maxLongStr,
  minVeryLongStr,
  maxVeryLongStr,
  statusTypes,
  envTypes,
} from "helpers/constants";
import { mongoIdRegex, emailRegex } from "helpers/validators/regex";

export const envVarsSchema = {
  env: Joi.object({
    NODE_ENV: Joi.any()
      .valid(envTypes)
      .required(),
  }),
};
export const shortStr = Joi.string()
  .min(minShortStr)
  .max(maxShortStr);
export const normalStr = Joi.string()
  .min(minStr)
  .max(maxStr);
export const longStr = Joi.string()
  .min(minLongStr)
  .max(maxLongStr);
export const veryLongStr = Joi.string()
  .min(minVeryLongStr)
  .max(maxVeryLongStr);
export const statusType = Joi.any().valid(statusTypes);
export const email = Joi.string().regex(emailRegex);
export const validMongoId = Joi.string()
  .regex(mongoIdRegex)
  .options({
    language: {
      string: {
        regex: {
          base: "!!Invalid Id",
        },
      },
    },
  });
