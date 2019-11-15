import httpStatus from "http-status";

/**
 * @extends Error
 */
class ExtendableError extends Error {
  constructor(status, message, data, isPublic) {
    super(message);
    Object.setPrototypeOf(this, ExtendableError.prototype);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.data = data;
    this.isPublic = isPublic;
    this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
    Error.captureStackTrace(this, this.constructor.name);
  }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor(
    status = status || httpStatus.INTERNAL_SERVER_ERROR,
    message,
    data = null,
    isPublic = false,
  ) {
    super(status, message, data, isPublic);
    this.name = "APIError";
    /*
    Need to set prototype menaully as
    Extending builtin types like Array
    and Error and such has never been supported in Babel
    */
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

export default APIError;
