import threading
from django.core.mail import EmailMessage

class EmailThread(threading.Thread):
    def __init__(self, subject: str, to: str, body: str, fail_silently=False):
        super().__init__()
        self.message = EmailMessage(
            subject=subject,
            body=body,
            from_email=None,
            to=[to]
        )
        self.fail_silently = fail_silently

    def run(self):
        self.message.send(self.fail_silently)

def send_mail_async(subject: str, to: str, body: str, fail_silently=False):
    EmailThread(subject, to, body, fail_silently).start()
