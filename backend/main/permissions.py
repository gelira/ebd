from django.contrib.auth.models import AnonymousUser
from rest_framework.permissions import BasePermission

class IsAuthenticatedPermission(BasePermission):
    def has_permission(self, request, view):
        return not isinstance(request.user, AnonymousUser) and bool(request.user)
