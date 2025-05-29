from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Usuario

class CustomJWTAuthentication(JWTAuthentication):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user_model = Usuario

