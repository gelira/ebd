from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import SimpleRouter

from core import views

router = SimpleRouter(trailing_slash=False)
router.register(r'alunos', views.AlunoViewSet, basename='alunos')
router.register(r'aulas', views.AuthCodeViewSet, basename='aulas')
router.register(r'auth-code', views.AuthCodeViewSet, basename='auth-code')
router.register(r'classes', views.ClasseViewSet, basename='classes')
router.register(r'congregacoes', views.CongregacaoViewSet, basename='congregacoes')
router.register(r'diarios', views.DiarioViewSet, basename='diarios')
router.register(r'matriculas', views.MatriculaViewSet, basename='matriculas')
router.register(r'periodos', views.PeriodoViewSet, basename='periodos')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
