import { FilterErrorAndThrow } from "helpers";
import { parseCSV } from "utils/csvUtility";
import APIError from "utils/APIError";
import { csvHeader } from "src/helpers/constants";
import logger from "utils/logger";
import { INVALID_CSV, SUCCESSFULL } from "localization/en";
import validator from "./validator";
import service from "./service";
import districtController from "../district/controller";
import townController from "../town/controller";

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

// Initializing db from csv file
async function initDB(file) {
  const csvFile = file;
  const header = csvHeader;
  const data = await parseCSV({ csvFile, header });
  if (data && data.error) {
    throw new APIError(422, data.error, null, true);
  }

  // Formating csv row into doctor object
  try {
    const stateDict = {};
    const districtDict = {};
    const townDict = {};
    data.forEach(row => {
      const [
        ,
        town,
        urbanStatus,
        stateCode,
        state,
        districtCode,
        district,
      ] = row.split(",");
      if (!stateDict[state]) {
        stateDict[state] = { name: state, code: stateCode };
      }
      if (!districtDict[district]) {
        districtDict[district] = {
          name: district,
          code: districtCode,
          state,
        };
      }
      if (!townDict[town]) {
        townDict[town] = { name: town, urbanStatus, district };
      }
    });

    const statePromises = [];
    const districtPromises = [];
    const townPromises = [];

    // Inserting all states first
    Object.keys(stateDict).forEach(state => {
      statePromises.push(
        create(stateDict[state]).catch(e => {
          logger.error(e);
        }),
      );
    });
    await Promise.all(statePromises);

    // Inserting all districts next
    Object.keys(districtDict).forEach(district => {
      districtPromises.push(
        districtController.create(districtDict[district]).catch(e => {
          logger.error(e);
        }),
      );
    });
    await Promise.all(districtPromises);

    // Inserting all towns at last
    Object.keys(townDict).forEach(town => {
      townPromises.push(
        townController.create(townDict[town]).catch(e => {
          logger.error(e);
        }),
      );
    });
    await Promise.all(townPromises);

    return {
      status: 200,
      message: SUCCESSFULL,
    };
  } catch (err) {
    logger.error(err);
    if (err.name === "SyntaxError") {
      throw new APIError(422, INVALID_CSV, null, true);
    }
  }
  return true;
}

export default { list, create, initDB };
