/* fixed values are stored in this file so that it can be reused */
export const envTypes = ["development", "production", "test"];
export const statusTypes = ["active", "deleted"];
export const minShortStr = 1;
export const maxShortStr = 15;
export const minStr = 1;
export const maxStr = 50;
export const minLongStr = 1;
export const maxLongStr = 100;
export const minVeryLongStr = 1;
export const maxVeryLongStr = 200;
export const sortByKeys = [
  "createdAt",
  "-createdAt",
  "updatedAt",
  "-updatedAt",
];
export const defaultDocumentLimit = 50;
export const csvHeader =
  "Sl. No.,City/Town,Urban Status,State Code,State/Union territory*,District Code,District";
export const maxCSVFileSize = 2000000;
