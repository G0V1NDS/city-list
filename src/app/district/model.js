import mongoose from "mongoose";
import { statusTypes } from "helpers/constants";

const stateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const townSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    urbanStatus: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const modelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    code: {
      type: String,
      unique: true,
      required: true,
    },
    state: {
      type: stateSchema,
      required: true,
    },
    towns: {
      type: [townSchema],
      required: true,
    },
    status: {
      type: String,
      enum: statusTypes,
      default: "active",
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
modelSchema.method({});

/**
 * Statics
 */
modelSchema.statics = {};
/**
 * @typedef District
 */
export default mongoose.model("District", modelSchema);
export const DistrictSchema = modelSchema;
