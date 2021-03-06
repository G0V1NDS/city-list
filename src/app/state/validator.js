import Joi from "joi";
import { sortByKeys } from "helpers/constants";
import { normalStr } from "helpers/validators";

export default {
  // GET /api/states
  list: Joi.object({
    query: Joi.object({
      sortBy: Joi.array().items(Joi.any().valid(sortByKeys)),
      limit: Joi.number().integer(),
      skip: Joi.number().integer(),
      q: normalStr,
    }),
  }),

  // POST /api/states
  create: Joi.object({
    body: Joi.object({
      name: normalStr.required(),
      code: Joi.number()
        .integer()
        .required(),
    }),
  }),
};
