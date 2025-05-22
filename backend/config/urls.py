from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import SimpleRouter

from main import views

router = SimpleRouter(trailing_slash=False)
router.register(r'alunos', views.AlunoViewSet, basename='alunos')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
