from bs4 import BeautifulSoup
from selenium import webdriver
import time
import re
import os

class DoubtfireScraper:
    def __init__(self):
        self.url = "https://doubtfire.ict.swin.edu.au"
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.binary_location = os.environ["GOOGLE_CHROME_BIN"]
        self.driver = webdriver.Chrome(executable_path=os.environ["CHROMEDRIVER_PATH"], chrome_options=chrome_options)

    def refresh(self):
        self.driver.refresh()
        
    def create_soup(self, url):
        self.driver.get(url)
        print(
            "Waiting for Angular to render the page content (should have used React)...."
        )
        time.sleep(10)
        self.soup = BeautifulSoup(self.driver.page_source, "html.parser")

    def find_units(self):
        self.create_soup("https://doubtfire.ict.swin.edu.au/#/home")
        li = self.soup.find("div", {"class": "list-group"})
        children = li.findChildren("a", recursive=False)
        units = []
        for child in children:
            units.append(
                {
                    "id": child.find(
                        "label", {"class": "label label-info ng-binding"}
                    ).text,
                    "url": f"https://doubtfire.ict.swin.edu.au/{child['href']}",
                }
            )
        return units

    def find_unit_tasks(self, unit_url):
        tasks = []
        self.create_soup(unit_url)
        for div in self.soup.findAll(
            "div", {"class": "groupset-tasks clearfix ng-scope"}
        ):
            for task in div.findChildren("li", {"class": "col-xs-4 col-sm-3 col-md-2 col-lg-4 ng-scope"}):
                btn = task.find("button")
                tasks.append(
                    {"name": btn.text.strip(), "status": btn.attrs["class"][-1].strip()}
                )
        return tasks

    def find_units_tasks(self, units):
        for unit in units:
            unit["tasks"] = self.find_unit_tasks(unit["url"])
        return units

    def login(self):
        print("Logging in")
        self.driver.get(self.url)
        username = self.driver.find_element_by_name("username")
        password = self.driver.find_element_by_name("password")
        username.send_keys("s103061563")
        password.send_keys(os.environ.get("DOUBTFIRE_PASSWORD"))
        self.driver.find_element_by_class_name("btn-primary").click()
        print("Waiting for redirect")
        time.sleep(10)

    def main(self):
        self.login()
        self.create_soup()


# username
# password
# submit
