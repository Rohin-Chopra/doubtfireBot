import os
import datetime as dt
import psycopg2
from functools import partial
from app.scraper import DoubtfireScraper
from app.track_changes import DoubtfireTrackChanges
from app.models import Models

DATABASE_URL = os.environ['DATABASE_URL']
mydb = psycopg2.connect(DATABASE_URL, sslmode='require')
cursor = mydb.cursor()

ds = DoubtfireScraper()
ds.login()


units = ds.find_units()
units_with_tasks = ds.find_units_tasks(units)

dtc = DoubtfireTrackChanges(cursor)

# dtc.check_task_status_changed(units_with_tasks)


first_scan_time = dt.datetime.now() + dt.timedelta(
    minutes=2
)  # set your sending time in UTC
interval = dt.timedelta(minutes=2)  # set the interval for sending the email

scan_time = first_scan_time
dtc = DoubtfireTrackChanges(cursor)

while True:
    dtc.check_task_status_changed_at(partial(ds.find_units_tasks,units), scan_time)
    scan_time += interval
