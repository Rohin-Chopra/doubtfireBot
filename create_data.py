import os
import psycopg2
from app.scraper import DoubtfireScraper
from app.models import Models

def create_data():
  DATABASE_URL = os.environ['DATABASE_URL']
  mydb = psycopg2.connect(DATABASE_URL, sslmode='require')
  cursor = mydb.cursor()


  models = Models(cursor)
  models.create_tables()

  ds = DoubtfireScraper()
  ds.login()

  units = ds.find_units()
  models.create_units(units)

  units_with_tasks = ds.find_units_tasks(units)
  models.create_tasks(units_with_tasks)

if(__name__ == 'main'):
  create_data()