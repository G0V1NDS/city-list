import Joi from "joi";
import { sortByKeys } from "helpers/constants";
import { normalStr, validMongoId, email } from "helpers/validators";

export default {
  // GET /api/samples/:id
  get: Joi.object({
    params: Joi.object({
      id: validMongoId,
    }),
  }),

  // GET /api/samples
  list: Joi.object({
    query: Joi.object({
      sortBy: Joi.array().items(Joi.any().valid(sortByKeys)),
      limit: Joi.number().integer(),
      skip: Joi.number().integer(),
    }),
  }),

  // POST /api/samples
  create: Joi.object({
    body: Joi.object({
      name: normalStr.required(),
      email: email.required(),
      username: normalStr.required(),
    }),
  }),

  // PUT /api/samples/:id
  update: Joi.object({
    params: Joi.object({
      id: validMongoId.required(),
    }),
    body: Joi.object({
      name: normalStr,
      email,
      username: normalStr,
    }),
  }),

  // DELETE /api/samples/:id
  remove: Joi.object({
    params: Joi.object({
      id: validMongoId.required(),
    }),
  }),
};
