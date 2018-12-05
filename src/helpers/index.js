import randomstring from "randomstring";
import jwt from "jsonwebtoken";
import logger from "utils/logger";
import sha1 from "sha1";
import Hashids from "hashids";
import {
  NOT_AUTHORIZED,
  INVALID_DATA,
  TOKEN_EXPIRED,
  INVALID_ACCESS_TOKEN,
  INVALID_REFRESH_TOKEN,
  INVALID_EMAIL_REFRESH_TOKEN,
} from "localization/en";
import config from "@config";
const hashids = new Hashids(config.hashKey);
const { privateKey, tokenExpiry, tokenIssuer } = config.jwt;

/**
 * To verify jwt token expiry and signature
 * @param {string} token
 */
export const verifyAccessToken = token => {
  let err = false;
  let decodedData;
  if (token) {
    jwt.verify(token, privateKey, (error, decodedInfo) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          err = TOKEN_EXPIRED;
        } else {
          err = INVALID_ACCESS_TOKEN;
        }
      }
      decodedData = decodedInfo;
    });
  } else {
    err = NOT_AUTHORIZED;
  }
  return {
    err,
    decodedData,
  };
};

/**
 * To generate random salt of 7 char
 */
export const generateSalt = () => randomstring.generate(7);

/**
 * To generate hashed password
 * @param {string} password
 * @param {string} salt
 */
export const hashPassword = (password, salt) => sha1(password + salt);

/**
 * To generate token bases on data provided
 * @param {object} data
 */
export const generateAccessToken = data => {
  try {
    const jwtOptions = {
      issuer: tokenIssuer,
      expiresIn: tokenExpiry,
      audience: String(data.id),
    };
    return jwt.sign(data, privateKey, jwtOptions);
  } catch (err) {
    logger.error(err.message);
  }
  return true;
};

/**
 * To generate refresh token
 * @param {string} id
 * @param string userType
 */
export const generateRefreshToken = (id, userType) => {
  try {
    return jwt.sign(
      {
        type: "refresh",
        hashedId: hashids.encode(id),
        userType,
      },
      privateKey,
      {
        expiresIn: "20 days",
        issuer: tokenIssuer,
        audience: "rt",
      },
    );
  } catch (err) {
    logger.error(err.message);
  }
  return true;
};

/**
 * To verify refresh token
 * @param {string} token
 */
export const verifyRefreshToken = async token => {
  let validation;

  try {
    validation = jwt.verify(token, privateKey, {
      algorithm: "RS256",
      issuer: tokenIssuer,
      audience: "rt",
    });
    if (validation && validation.hashedId && validation.userType) {
      return validation;
    }
  } catch (err) {
    logger.error(err.message);
    return {
      status: 401,
      data: null,
      message: INVALID_REFRESH_TOKEN,
    };
  }
  return true;
};

/**
 * To generate link for email verification
 * @param {string} emailId
 */
export const getVerificationLink = emailId => {
  const token = jwt.sign(
    {
      emailId,
    },
    privateKey,
    {
      expiresIn: "2 days",
      issuer: tokenIssuer,
      audience: "cp",
    },
  );
  return {
    verificationLink: `${config.domainPrefix}/verifyuser?token=${token}`,
    verificationCode: token,
  };
};

/**
 * To generate reset password link
 * @param {string} userId
 */
export const generateResetPasswordLink = userId => {
  const token = jwt.sign(
    {
      userId,
    },
    privateKey,
    {
      expiresIn: 86400,
      issuer: tokenIssuer,
      audience: "cp",
    },
  );

  return {
    resetLink: `${config.domainPrefix}/setnewpassword?token=${token}`,
    resetCode: token,
  };
};

/**
 * To verify general token
 * @param {string} token
 */
export const verifyOtherToken = token => {
  let validation;

  try {
    validation = jwt.verify(token, privateKey, {
      issuer: tokenIssuer,
      audience: "cp",
    });
    if (validation && validation.emailId) {
      return validation;
    }
  } catch (err) {
    logger.error(err.message);
    return {
      status: 401,
      data: null,
      message: INVALID_EMAIL_REFRESH_TOKEN,
    };
  }
  return true;
};

/**
 * To generate new otp of 6 digit
 */
export const generateNewOTP = () =>
  randomstring.generate({
    length: 6,
    charset: "numeric",
  });

/**
 * Creates a filter function to be used with the errors thrown from JOI
 * @static
 * @method FormatJOIError
 * @param err
 * @param useJoiError
 * @return {Function}
 */
export const FormatJOIError = err => {
  // Joi Error
  const JoiError = {
    status: 400,
    data:
      // fetch only message and path from each error
      /* eslint-disable-next-line  */
      err.details.map(({ message, path }) => ({
        [path]: message.replace(/['"]/g, ""),
      })),
    message: INVALID_DATA,
  };
  // Send back the JSON error response
  return JoiError;
};

/**
 * Filter object or array of object
 * If error object exist, it throw that
 * @static
 * @method FilterErrorAndThrow
 * @param list
 * @return {undefined}
 */
export const FilterErrorAndThrow = list => {
  // If list is an array then iterate
  if (list.length) {
    for (let i = 0; i < list.length; i += 1) {
      if (list[i] && list[i].error) {
        const { error } = list[i];
        throw error;
      }
    }
  } else if (list && list.error) {
    // list is an object
    const { error } = list;
    throw error;
  }
};

/**
 * Iterate array element and convert them to object
 * ["x", "y"] -> {"x": true, "y": true}
 * @static
 * @method ArrayToObj
 * @param array
 * @return {Object}
 */
export const ArrayToObj = array => {
  // Converting filter array to object
  const tempObj = {};
  if (array) {
    array.forEach(ele => {
      tempObj[ele] = true;
    });
  }
  return tempObj;
};

/**
 * Iterate sortBy array and returns the format
 * mongoose will understand
 * ["createdAt", "-updatedAt"] -> {"createdAt": 1, "updatedAt": -1}
 * @static
 * @method parseSortBy
 * @param sortBy
 * @return {Object}
 */
export const parseSortBy = sortBy => {
  let sort = {};
  if (sortBy) {
    // Parse sort keys
    sortBy.forEach(key => {
      let sortKey = key;
      let desc = false;
      if (key.startsWith("-")) {
        [, sortKey] = key.split("-");
        desc = true;
      }
      if (sortKey === "featured") {
        sortKey = "filters.featured";
      }
      sort[sortKey] = 1;
      if (desc) {
        sort[sortKey] = -1;
      }
    });
  } else {
    sort = { createdAt: -1 };
  }
  return sort;
};
