import mongoose from "mongoose";
import { statusTypes } from "helpers/constants";

const districtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    state: {
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
    urbanStatus: {
      type: String,
      required: true,
    },
    district: {
      type: districtSchema,
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
 * @typedef Town
 */
export default mongoose.model("Town", modelSchema);
export const TownSchema = modelSchema;
