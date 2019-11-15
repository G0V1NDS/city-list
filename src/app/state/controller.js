import { FilterErrorAndThrow } from "helpers";
import validator from "./validator";
import service from "./service";

/**
 * Get documents list.
 * @property {number} query.skip - Number of documents to be skipped.
 * @property {number} query.limit - Limit number of documents to be returned.
 * @property {array} query.sortBy - keys to use to record sorting.
 * @property {string} query.q - String for regex match
 * @returns {Object}
 */
async function list(query) {
  // Validating query
  const validQuery = await validator.list.validate({ query });

  // Getting document list with filters
  const docs = await service.find({ query: validQuery.query });
  return docs;
}

/**
 * Create new document
 * @property {string} body.name - The name of document.
 * @property {string} body.email - The email of document.
 * @property {string} body.username - The username of document.
 * @returns {Object}
 */
async function create(body) {
  // Validating body
  const validData = await validator.create.validate({ body });

  const validBody = validData.body;

  const promiseList = [];

  // Validating body, if anything needs to be checked with model
  // Checking if state exists with same name
  promiseList[0] = service.checkDuplicate({
    name: validBody.name,
    errKey: "body,name",
  });

  // Waiting for promises to finish
  const promiseListResp = await Promise.all(promiseList);

  // Throwing error if promise response has any error object
  FilterErrorAndThrow(promiseListResp);

  // Creating new document
  const newDoc = await service.create({ data: validBody });

  // Throwing error if promise response has any error object
  FilterErrorAndThrow(newDoc);

  return newDoc;
}

export default { list, create };
