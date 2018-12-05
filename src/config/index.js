import dotenv from "dotenv";
import { envVarsSchema } from "helpers/validators";

// Importing default settings
const defaults = require(`./defaults.json`);

/* eslint-disable no-console */

// dotenv will load vars in .env in PROCESS.ENV
dotenv.config();
console.log(`NODE_ENV value is : ${process.env.NODE_ENV}`);

const infoMsg = `\n***********************************************
\nPlease check README.md file for instructions.
\nhttps://bitbucket.org/cartoonmango/node-mongoose/src/master/README.md
\n***********************************************`;

// Validating NODE_ENV with available environments
const { error, value: validData } = envVarsSchema.env.validate({
  NODE_ENV: process.env.NODE_ENV,
});

if (error) {
  console.error(infoMsg);
  process.exit();
}

let mergedConfig;
let config;
try {
  // Importing environment based setting
  /* eslint-disable-next-line global-require */
  config = require(`./${validData.NODE_ENV}.json`);
  mergedConfig = { ...defaults, ...config };
} catch (e) {
  console.error(infoMsg);
  process.exit();
}

// Exporting default and environments based settings combined
const finalConfig = mergedConfig;
export default finalConfig;
