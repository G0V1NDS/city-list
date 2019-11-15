import commonService from "helpers/services";
import { SUCCESSFULL } from "localization/en";
import Town from "./model";

/**
 * Finding documents with provided query params
 * @property {object} query - object containing params to prepare query.
 * @property {boolean} autoFormat - false if formatted output not needed.
 * @returns {documents[]}
 */
async function find({ query, autoFormat = true }) {
  const { q } = query;

  // preparing query filters
  const filterCriteria = {
    status: "active",
  };

  if (q) {
    filterCriteria.name = { $regex: `.*${q}.*`, $options: "i" };
  }

  // Getting documents with available filters
  const docs = await Town.aggregate([
    { $match: filterCriteria },
    {
      $project: {
        _id: 0,
        town: "$name",
        state: "$district.state",
        district: "$district.name",
      },
    },
  ]);

  // Returning formatted response if autoFormat true
  if (autoFormat) {
    return {
      status: 200,
      data: docs,
      message: SUCCESSFULL,
    };
  }

  // Otherwise returned db object
  return docs;
}

/**
 * Finding document with id
 * @property {string} id - document id.
 * @property {string} errKey - key for which error object will be generated.
 * @property {boolean} autoFormat - false if formatted output not needed.
 * @returns {document}
 */
async function findById({ id, errKey, autoFormat = true }) {
  const res = await commonService.findById({
    Model: Town,
    id,
    errKey,
    autoFormat,
  });
  return res;
}

/**
 * Checking if document exist with same name
 * @property {string} name - name
 * @property {string} excludedId - document id to be excluded.
 * @property {string} errKey - key for which error object will be generated.
 * @property {boolean} autoFormat - false if formatted output not needed.
 * @returns {boolean/document}
 */
async function checkDuplicate({ name, excludedId, errKey, autoFormat = true }) {
  const res = await commonService.checkDuplicate({
    Model: Town,
    name,
    excludedId,
    errKey,
    autoFormat,
  });
  return res;
}

/**
 * Creating document
 * @property {object} data - document properties.
 * @property {boolean} autoFormat - false if formatted output not needed.
 * @returns {document}
 */
async function create({ data, autoFormat = true }) {
  const res = await commonService.create({ Model: Town, data, autoFormat });
  return res;
}

/**
 * Updating document
 * @property {object} data - document properties.
 * @property {document} existingDoc - document which needs to be updated.
 * @property {boolean} autoFormat - false if formatted output not needed.
 * @returns {document}
 */
async function updateExisting({ data, existingDoc, autoFormat = true }) {
  const res = await commonService.updateExisting({
    data,
    existingDoc,
    autoFormat,
  });
  return res;
}

/**
 * Updating document
 * @property {object} data - document properties.
 * @property {object} filterCriteria - criteria to fetch document to be updated.
 * @property {boolean} autoFormat - false if formatted output not needed.
 * @returns {document}
 */
async function update({ data, filterCriteria, autoFormat = true }) {
  const res = await commonService.update({
    Model: Town,
    data,
    filterCriteria,
    autoFormat,
  });
  return res;
}

/**
 * Pseudo delete document
 * @property {string} id - document id to be removed.
 * @property {boolean} autoFormat - false if formatted output not needed.
 * @returns {document}
 */
async function removeById({ id, autoFormat = true }) {
  const res = await commonService.removeById({
    Model: Town,
    id,
    autoFormat,
  });
  return res;
}
export default {
  find,
  findById,
  create,
  update,
  updateExisting,
  removeById,
  checkDuplicate,
};
