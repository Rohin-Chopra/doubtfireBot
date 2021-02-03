const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

module.exports = async (sequelize) => {
  try {
    let $;
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://doubtfire.ict.swin.edu.au/#/home");

    await page.type("input[type=username]", "103061563");
    await page.type("input[type=password]", "Rohin@1212");
    await page.click("button[type=submit]");

    await page.waitForNavigation();
    await page.waitForSelector(".list-group-item");
    $ = cheerio.load(await page.content());

    const students = await sequelize.models.Student.findAll();
    console.log(students);
    const units = loadUnits($, sequelize);
    saveUnits(units, null, sequelize);
  } catch (error) {
    console.log(error);
  }
};
// list-group-item-heading ng-binding

const loadUnits = ($) => {
  const units = [];
  $(".list-group-item-heading", ".list-group-item")
    .toArray()
    .forEach((h4) => {
      units.push({
        name: h4.children[0].data,
        code: "",
        link: h4.parent.parent.attribs.href,
      });
    });

  $(".label-info")
    .toArray()
    .forEach((label, index) => {
      if (index < units.length) {
        units[index].code = label.children[0].data;
      }
    });
  return units;
};

const saveUnits = (units, studentId, sequelize) => {
  units.forEach(async (unit) => {
    if (!(await sequelize.models.Unit.findByPk(unit.code))) {
      await sequelize.models.Unit.create(unit);
    }
  });
};

const loadTasks = ($, sequelize) => {};
