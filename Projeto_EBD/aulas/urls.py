"""
URL configuration for Projeto_EBD project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Crie um roteador
router = DefaultRouter()
router.register(r'igrejas', views.IgrejaViewSet)
router.register(r'usuarios', views.UsuarioViewSet)
router.register(r'classes', views.ClasseViewSet)
router.register(r'trimestres', views.TrimestreViewSet)
router.register(r'aulas', views.AulaViewSet)
router.register(r'professores', views.ProfessorViewSet)
router.register(r' diarios', views.DiarioViewSet)
router.register(r'alunos', views.AlunoViewSet)
router.register(r'presencas', views.PresencaViewSet)
router.register(r'matriculas', views.MatriculaViewSet)

# Inclua as URLs do roteador
urlpatterns = [
    path('', include(router.urls)),
]
