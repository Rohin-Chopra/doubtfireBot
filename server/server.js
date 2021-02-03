const dotenv = require("dotenv");

dotenv.config({});

const sequelize = require("./../sequelize");

sequelize
  .authenticate()
  .then(() => console.log("database connected"))
  .catch((err) => console.error(err));

const app = require("./app");
const cron = require("node-cron");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

let times = 1;

// cron.schedule("* * * * *", () => {
//   console.log(`hello there ${times++}`);
// });
