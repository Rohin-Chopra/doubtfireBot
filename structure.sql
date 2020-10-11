CREATE DATABASE IF NOT EXISTS doubtfire
CREATE TABLE IF NOT EXISTS Units (unit_id VARCHAR(50) NOT NULL,unit_url VARCHAR(200) NOT NULL, PRIMARY KEY (unit_id))
CREATE TABLE IF NOT EXISTS Tasks(task_number VARCHAR (20) , task_status VARCHAR(20) , unit_id VARCHAR(50) ,PRIMARY KEY(unit_id,task_number),FOREIGN KEY(unit_id) REFERENCES Units(unit_id))