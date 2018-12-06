import { parseSortBy } from "helpers";
import logger from "utils/logger";
import {
  SUCCESSFULL,
  NOT_FOUND,
  CREATED,
  UPDATED,
  DELETED,
} from "localization/en";

/**
 * Finding documents with provided query params
 * @property {object} Model - Mongoose model object.
 * @property {object} query - object containing params to prepare query.
 * @property {boolean} autoFormat - false if formatted output not needed.
 * @returns {documents[]}
 */
async function find({
  Model,
  query,
  customFilters = false,
  autoFormat = true,
}) {
  const { limit = 50, skip = 0, sortBy } = query;

  // preparing query filters
  let filterCriteria = {
    status: "active",
  };

  if (customFilters) {
    filterCriteria = { ...filterCriteria, ...customFilters };
  }

  // Getting documents with available filters
  const docs = await Model.find(filterCriteria)
    .sort(parseSortBy(sortBy))
    .skip(+skip)
    .limit(+limit);

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
 * @property {object} Model - Mongoose model object.
 * @property {string} id - document id.
 * @property {string} errKey - key for which error object will be generated.
 * @property {boolean} autoFormat - false if formatted output not needed.
 * @returns {document}
 */
async function findById({ Model, id, errKey, autoFormat = true }) {
  // Getting document with id
  const existingDoc = await Model.findOne({
    _id: id,
    status: "active",
  });

  // Returning doc if exist
  if (existingDoc !== null) {
    // Returning formatted response if autoFormat true
    if (autoFormat) {
      return {
        status: 200,
        data: existingDoc,
        message: SUCCESSFULL,
      };
    }

    // Otherwise returned db object
    return existingDoc;
  }

  // Returning error obj if does not exist
  const errObj = {
    error: {
      status: 404,
      message: NOT_FOUND,
    },
  };
  if (errKey) {
    errObj.error.data = [
      {
        [errKey]: NOT_FOUND,
      },
    ];
  }
  return errObj;
}

/**
 * Creating document
 * @property {object} Model - Mongoose model object.
 * @property {object} data - document properties.
 * @property {boolean} autoFormat - false if formatted output not needed.
 * @returns {document}
 */
async function create({ Model, data, autoFormat = true }) {
  // Creating new document
  const newDoc = new Model(data);
  const savedDoc = await newDoc.save();

  // Returning formatted response if autoFormat true
  if (autoFormat) {
    return {
      status: 201,
      data: savedDoc,
      message: CREATED,
    };
  }

  // Otherwise returned db object
  return savedDoc;
}

/**
 * Updating document
 * @property {object} data - document properties.
 * @property {document} existingDoc - document which needs to be updated.
 * @property {boolean} autoFormat - false if formatted output not needed.
 * @returns {document}
 */
async function updateExisting({ data, existingDoc, autoFormat = true }) {
  // Updating existing document with new data
  if (data) {
    existingDoc.set(data);
  }
  const savedDoc = await existingDoc.save();

  // Returning error obj if does not exist
  if (savedDoc === null) {
    return {
      error: {
        status: 404,
        message: NOT_FOUND,
      },
    };
  }

  // Returning formatted response if autoFormat true
  if (autoFormat) {
    return {
      status: 200,
      data: savedDoc,
      message: UPDATED,
    };
  }

  // Otherwise returned db object
  return savedDoc;
}

/**
 * Updating document
 * @property {object} Model - Mongoose model object.
 * @property {object} data - document properties.
 * @property {object} filterCriteria - criteria to fetch document to be updated.
 * @property {boolean} autoFormat - false if formatted output not needed.
 * @returns {document}
 */
async function update({ Model, data, filterCriteria, autoFormat = true }) {
  // Getting and updating document
  const savedDoc = await Model.updateMany(filterCriteria, { $set: data });

  // Returning error obj if does not exist
  if (savedDoc.n === 0) {
    return {
      error: {
        status: 404,
        message: NOT_FOUND,
      },
    };
  }

  // If documents found and updated
  if (savedDoc.n !== 0 && savedDoc.nModified !== 0) {
    // Returning formatted response if autoFormat true
    if (autoFormat) {
      return {
        status: 200,
        message: UPDATED,
      };
    }

    // Otherwise returned db object
    return savedDoc;
  }

  // Returing error if no update happened
  logger.error(
    `Unable to update document with ${JSON.stringify(filterCriteria)}`,
  );
  return {
    error: {
      status: 422,
      message: `Unable to update`,
    },
  };
}

/**
 * Pseudo delete document
 * @property {object} Model - Mongoose model object.
 * @property {string} id - document id to be removed.
 * @property {boolean} autoFormat - false if formatted output not needed.
 * @returns {document}
 */
async function removeById({ Model, id, autoFormat = true }) {
  // Getting and updating document with status=deleted
  const filterCriteria = { _id: id, status: "active" };
  const deletedDoc = await update({
    Model,
    filterCriteria,
    data: { status: "deleted" },
  });

  // Returning error returned from update method
  if (deletedDoc.error) {
    return deletedDoc;
  }

  // Returning formatted response if autoFormat true
  if (autoFormat) {
    return {
      status: 200,
      message: DELETED,
    };
  }

  // Otherwise returned db object
  return deletedDoc;
}

export default {
  find,
  findById,
  create,
  update,
  updateExisting,
  removeById,
};
