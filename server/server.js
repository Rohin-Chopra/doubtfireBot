const dotenv = require("dotenv");

dotenv.config({});

const db = require("./db");
const Student = require("./models/student");
const Task = require("./models/task");

db.authenticate()
  .then(() => console.log("database connected"))
  .catch((err) => console.error(err));
db.sync({ force: true });

const app = require("./app");
const cron = require("node-cron");

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

let times = 1;

cron.schedule("* * * * *", () => {
  console.log(`hello there ${times++}`);
});
