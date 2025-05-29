from rest_framework.exceptions import APIException

class InvalidAuthCodeException(APIException):
    status_code = 401
    default_detail = 'Invalid auth code'
    default_code = 'invalid_auth_code'
