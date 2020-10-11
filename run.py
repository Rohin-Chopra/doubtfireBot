from functools import partial
from app.scrape import DoubtfireScraper
from app.track_changes import DoubtfireTrackChanges
from app.models import Models
import mysql.connector
import datetime as dt

mydb = mysql.connector.connect(
    host="localhost", user="root", password="", database="doubtfire"
)

cursor = mydb.cursor(buffered=True)


models = Models(cursor)
models.create_tables()

ds = DoubtfireScraper()
ds.login()

units = ds.find_units()
models.create_units(units)

units_with_tasks = ds.find_units_tasks(units)
models.create_tasks(units_with_tasks)


first_scan_time = dt.datetime.now() + dt.timedelta(
    minutes=2
)  # set your sending time in UTC
interval = dt.timedelta(minutes=2)  # set the interval for sending the email

scan_time = first_scan_time
dtc = DoubtfireTrackChanges(cursor)
while True:
    dtc.check_task_status_changed_at(partial(ds.find_units_tasks,units), scan_time)
    scan_time += interval
