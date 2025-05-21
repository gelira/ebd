from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import SimpleRouter

router = SimpleRouter(trailing_slash=False)
# router.register(r'auth-code', custom_auth_views.AuthCodeViewSet, basename='auth-code')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
