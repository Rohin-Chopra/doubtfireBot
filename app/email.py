import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from string import Template
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import *

class EmailSender:
    def __init__(self, name, unit_name, task_no, status, filename):
        self.name = name
        self.task_no = task_no
        self.status = status
        self.unit_name = unit_name
        self.filename = filename
        self.SENDER_EMAIL = "rohinpython@gmail.com"
        self.RECEIVER_EMAIL = "rohinchopra1212@gmail.com"

    def read_template(self):
        with open(self.filename, "r", encoding="utf-8") as file:
            msg = file.read()
        return Template(msg)

    def replace_values(self, template):
        return template.substitute(
            NAME=self.name,
            TASK_NO=self.task_no,
            STATUS=self.status,
            UNIT_NAME=self.unit_name,
        )

    def create_message(self, body):
        message = MIMEMultipart()
        message["From"] = self.SENDER_EMAIL
        message["To"] = self.RECEIVER_EMAIL
        message["Subject"] = "Status Changed"
        return message

    def send_message_send_grid(self,message):
        sg = SendGridAPIClient(api_key=os.environ.get('SENDGRID_API_KEY'))
        from_email = Email(self.SENDER_EMAIL)
        to_email = To(self.RECEIVER_EMAIL)
        subject = "Task status changed"
        content = Content("text/plain", message)
        mail = Mail(from_email, to_email, subject, content)
        response = sg.client.mail.send.post(request_body=mail.get())


    def send(self):
        print('sending email')
        body = self.replace_values(self.read_template())
        self.send_message_send_grid(body)
        print('sent')

print("hello world")