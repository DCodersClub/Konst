const expressLoader = require("./express-loader.js");
const mongooseLoader = require("./mongoose-loader.js");

module.exports.init = async (expressApp) => {
  await expressLoader(expressApp);
  console.log("Express Initialized");
  const mongooseDB = await mongooseLoader();
  console.log("MongoDB Connected");
  return { mongooseDB };
};