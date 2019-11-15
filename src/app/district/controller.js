import { FilterErrorAndThrow } from "helpers";
import logger from "utils/logger";
import validator from "./validator";
import service from "./service";
import stateService from "../state/service";

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
  // Checking if district exists with same name
  promiseList[0] = service.checkDuplicate({
    name: validBody.name,
    errKey: "body,name",
  });

  // Checking if state exist
  promiseList[1] = stateService.findByName({
    name: validBody.state,
    errKey: "body,state",
    autoFormat: false,
  });

  // Waiting for promises to finish
  const promiseListResp = await Promise.all(promiseList);

  // Throwing error if promise response has any error object
  FilterErrorAndThrow(promiseListResp);

  const [, state] = promiseListResp;

  validBody.state = {
    name: state.name,
    code: state.code,
  };

  // Creating new document
  const newDoc = await service.create({ data: validBody });

  // Throwing error if promise response has any error object
  FilterErrorAndThrow(newDoc);

  // Checking if object already exist in district
  if (!state.districts.find(district => newDoc.data.name === district.state)) {
    state.districts.push({
      name: newDoc.data.name,
      code: newDoc.data.code,
    });
  }

  // Updating new data to document
  const newStateDoc = await stateService.updateExisting({
    existingDoc: state,
    autoFormat: false,
  });

  if (newStateDoc.error) {
    logger.error("Failed to add District info to state list");
  } else {
    logger.info("District info added to state list");
  }

  return newDoc;
}

export default { list, create };
