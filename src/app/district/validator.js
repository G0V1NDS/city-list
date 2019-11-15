import Joi from "joi";
import { sortByKeys } from "helpers/constants";
import { normalStr, validMongoId } from "helpers/validators";

export default {
  // GET /api/districts/:id
  get: Joi.object({
    params: Joi.object({
      id: validMongoId.required(),
    }),
  }),

  // GET /api/districts
  list: Joi.object({
    query: Joi.object({
      sortBy: Joi.array().items(Joi.any().valid(sortByKeys)),
      limit: Joi.number().integer(),
      skip: Joi.number().integer(),
      q: normalStr,
    }),
  }),

  // POST /api/districts
  create: Joi.object({
    body: Joi.object({
      name: normalStr.required(),
      code: Joi.number()
        .integer()
        .required(),
      state: normalStr.required(),
    }),
  }),
  // DELETE /api/districts/:id
  remove: Joi.object({
    params: Joi.object({
      id: validMongoId.required(),
    }),
  }),
};
