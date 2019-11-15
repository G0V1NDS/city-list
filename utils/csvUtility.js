import parse from "csv-parse";
import fs from "fs";
import logger from "./logger";

/**
 * To check file mimetype
 * @param {File} csvFile
 * @return {Boolean}
 */
export const isCSV = async csvFile => {
  if (csvFile.mimetype !== "text/csv") {
    return false;
  }
  return true;
};

/**
 * To check file size is b/w min and max limit
 * @param {File} csvFile CSV file
 * @param {Number} minFileSize Minimum size required
 * @param {Number} maxFileSize Maximum size required
 * @return {Boolean}
 */
export const csvFileSizeCheck = async (csvFile, minFileSize, maxFileSize) => {
  if (csvFile.size < minFileSize || csvFile.size > maxFileSize) {
    return false;
  }
  return true;
};

/**
 * To parse the csv file
 * @param {Object} options
 * @param {File} options.csvFile CSV file
 * @param {String} options.header CSV file header format
 * @param {String} options.delimiter delimeter
 * @return {Boolean/Object}
 */
export const parseCSV = async ({ csvFile, header, delimiter = "," }) => {
  try {
    const filePath = csvFile.path;
    let rowCount = 0;
    const rows = [];

    // https://csv.js.org/parse/options/
    const streamParser = parse({
      trim: true,
      comment: "#",
      delimiter,
      skip_empty_lines: true,
    });

    // Reading file as stream
    const promisifiedStream = () =>
      new Promise(resolve => {
        fs
          .createReadStream(filePath)
          .pipe(streamParser)
          .on("error", error => {
            logger.error(error);
            resolve({
              error: "Invalid csv file.",
            });
          })
          .on("data", csvrow => {
            try {
              // Reading csv rows
              rowCount += 1;
              // Validating csv file header
              if (rowCount === 1) {
                if (csvrow.toString().toLowerCase() !== header.toLowerCase()) {
                  resolve({
                    error: "Header does not match.",
                  });
                }
              } else {
                rows.push(csvrow.toString());
              }
            } catch (error) {
              logger.error(error);
              return {
                error: "Invalid csv file.",
              };
            }
            return true;
          })
          .on("end", () => {
            if (!rows.length) {
              resolve({
                error: "Invalid/Empty csv file.",
              });
            }
            resolve(rows);
          });
      });
    return await promisifiedStream();
  } catch (error) {
    logger.error(error);
    return {
      error: "Invalid csv file.",
    };
  }
};
