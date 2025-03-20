from django.shortcuts import render
from rest_framework import viewsets
from .models import Igreja, Usuario, Classe, Trimestre, Aula, Professor, Diario, Aluno, Presenca, Matricula
from .serializers import IgrejaSerializer, UsuarioSerializer, ClasseSerializer, TrimestreSerializer, AulaSerializer, ProfessorSerializer, DiarioSerializer, AlunoSerializer, PresencaSerializer, MatriculaSerializer

class IgrejaViewSet(viewsets.ModelViewSet):
    queryset = Igreja.objects.all()
    serializer_class = IgrejaSerializer

## Controle de Acesso
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class ClasseViewSet(viewsets.ModelViewSet):
    queryset = Classe.objects.all()
    serializer_class = ClasseSerializer

class TrimestreViewSet(viewsets.ModelViewSet):
    queryset = Trimestre.objects.all()
    serializer_class = TrimestreSerializer

class AulaViewSet(viewsets.ModelViewSet):
    queryset = Aula.objects.all()
    serializer_class = AulaSerializer

class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer

class DiarioViewSet(viewsets.ModelViewSet):
    queryset = Diario.objects.all()
    serializer_class = DiarioSerializer

class AlunoViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer

class PresencaViewSet(viewsets.ModelViewSet):
    queryset = Presenca.objects.all()
    serializer_class = PresencaSerializer

class MatriculaViewSet(viewsets.ModelViewSet):
    queryset = Matricula.objects.all()
    serializer_class = MatriculaSerializer

# Create your views here.
