import dotenv from "dotenv";
import { envVarsSchema } from "helpers/validators";

/* eslint-disable no-console */

// dotenv will load vars in .env in PROCESS.ENV
console.log(`Environment before dotenv is : ${process.env.NODE_ENV}`);
dotenv.config();
console.log(`Dotenv exported environment is : ${process.env.NODE_ENV}`);

// Validating NODE_ENV with available environments
const { error, value: validData } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error}`);
}

// Importing default settings
const defaults = require(`./defaults.json`);

// Importing environment based setting
const config = require(`./${validData.NODE_ENV}.json`);

// Exporting default and environments based settings combined
export default { ...defaults, ...config };
