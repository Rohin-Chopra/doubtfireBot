const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, ".env") });

const { Sequelize } = require("sequelize");
const pg = require("pg");
const { addAssociations } = require("./extraSetup");

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  dialectModule: pg,
});

// import and define all the models
const modelDefiners = [
  require("./models/student"),
  require("./models/unit"),
  require("./models/task"),
];

modelDefiners.forEach((modelDefiner) => modelDefiner(sequelize));
addAssociations(sequelize);

module.exports = sequelize;
