class Models():
  def __init__(self, cursor):
    self.cursor = cursor

  def create_tables(self):
    for line in open("./structure.sql"):
      self.cursor.execute(line)
      
  def create_units(self, units):
      for unit in units:
          unit_id = unit["id"]
          unit_url = unit["url"]
          self.cursor.execute(f"SELECT * FROM units WHERE unit_id = '{unit_id}'")
          if len(self.cursor.fetchall()) == 0:
              self.cursor.execute(
                  f"INSERT INTO units (unit_id,unit_url) VALUES ('{unit_id}','{unit_url}')"
              )
      self.cursor.execute("COMMIT")
      self.cursor.execute("SELECT * FROM units")
  
  def create_tasks(self,units):
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
                if self.cursor.rowcount == 0:
                    self.cursor.execute(
                        f"INSERT INTO tasks (task_number,task_status,unit_id) VALUES('{task_name}','{task_status}','{unit_id}')"
                    )
    self.cursor.execute("COMMIT")
    print("tasks have been created")

