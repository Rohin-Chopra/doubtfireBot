from app.email import EmailSender
import time

class DoubtfireTrackChanges:
    def __init__(self, cursor):
        self.cursor = cursor

    def check_units_changed(self, units):
        for unit in units:
            print(f'checking unit: {unit["id"]}')
            unit_id = unit["id"]
            unit_url = unit["url"]
            self.cursor.execute(f"SELECT * FROM units WHERE unit_id = '{unit_id}'")
            if len(self.cursor.fetchall()) == 0:
                self.cursor.execute(
                    f"INSERT INTO units (unit_id,unit_url) VALUES ('{unit_id}','{unit_url}')"
                )
        self.cursor.execute("COMMIT")
        self.cursor.execute("SELECT * FROM units")

    def check_task_status_changed(self, units):
        print("tracking changes in task status")
        for unit in units:
            unit_id = unit["id"]
            unit_url = unit["url"]
            unit_tasks = unit["tasks"]
            for task in unit_tasks:
                task_name = task["name"]
                task_status = task["status"]
                self.cursor.execute(
                    f"SELECT * FROM tasks WHERE unit_id = '{unit_id}' AND task_number='{task_name}'"
                )
                if self.cursor.fetchall()[0][1] != task_status:
                    print('found one changed')
                    print(task)
                    email = EmailSender(
                        "rohin", unit_id, task_name, task_status, "message.txt"
                    )
                    email.send()
                    self.cursor.execute(
                        f"UPDATE tasks SET task_status = '{task_status}' WHERE task_number = '{task_name}'"
                    )
                    self.cursor.execute("COMMIT")
                    
    def check_task_status_changed_at(self, get_units, send_time):
        print('about to sleep')
        time.sleep(send_time.timestamp() - time.time())
        print("Scanning for changes now")
        units = get_units()
        print(units)
        self.check_task_status_changed(units)
        print("scanned for changes")