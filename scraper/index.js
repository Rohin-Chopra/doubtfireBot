const dotenv = require("dotenv");
dotenv.config({});

const sequelize = require("./../sequelize");

const scrape = require("./scrape");

sequelize
  .authenticate()
  .then(() => console.log("database connected"))
  .catch((err) => console.error(err));
sequelize.sync();

scrape(sequelize);
// list-group-item-heading ng-binding
