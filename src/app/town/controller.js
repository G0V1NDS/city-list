import { FilterErrorAndThrow } from "helpers";
import logger from "utils/logger";
import validator from "./validator";
import service from "./service";
import districtService from "../district/service";

/**
 * Get Document
 * @property {string} params.id - Document Id.
 * @returns {Object}
 */
// eslint-disable-line
async function get(params) {
  // Validating param
  const validParam = await validator.get.validate({ params });

  const { id } = validParam.params;

  // Getting document details
  const existingDoc = await service.findById({ id });

  // Throwing error if promise response has any error object
  FilterErrorAndThrow(existingDoc);

  return existingDoc;
}

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
  // Checking if town exists with same name
  promiseList[0] = service.checkDuplicate({
    name: validBody.name,
    errKey: "body,name",
  });

  // Checking if district exist
  promiseList[1] = districtService.findByName({
    name: validBody.district,
    errKey: "body,district",
    autoFormat: false,
  });

  // Waiting for promises to finish
  const promiseListResp = await Promise.all(promiseList);

  // Throwing error if promise response has any error object
  FilterErrorAndThrow(promiseListResp);

  const [, district] = promiseListResp;

  validBody.district = {
    name: district.name,
    state: district.state.name,
  };

  // Creating new document
  const newDoc = await service.create({ data: validBody });

  // Throwing error if promise response has any error object
  FilterErrorAndThrow(newDoc);

  // Checking if object already exist in districts
  if (!district.towns.find(town => newDoc.data.name === town.name)) {
    district.towns.push({
      name: newDoc.data.name,
      urbanStatus: newDoc.data.urbanStatus,
    });
  }

  // Updating new data to document
  const newDistrictDoc = await districtService.updateExisting({
    existingDoc: district,
    autoFormat: false,
  });

  if (newDistrictDoc.error) {
    logger.error("Failed to add Town info to district list");
  } else {
    logger.info("Town info added to district list");
  }

  return newDoc;
}

/**
 * Delete document.
 * @property {string} params.id - Document Id.
 * @returns {Object}
 */
async function remove(params) {
  // Validating param
  const validParam = await validator.remove.validate({ params });

  const { id } = validParam.params;

  // Updating status to deleted
  const deletedDoc = await service.removeById({ id });

  // Throwing error if promise response has any error object
  FilterErrorAndThrow(deletedDoc);

  return deletedDoc;
}

export default { get, list, create, remove };
