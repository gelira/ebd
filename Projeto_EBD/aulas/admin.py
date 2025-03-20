from django.contrib import admin
from .models import *

class ProfessorAdm(admin.ModelAdmin):
    list_display = ["usuario", "classe"]

class TrimestreDisplay(admin.ModelAdmin):
    list_display = ["nome_igreja", "trimestre", "ano", "concluido"]

class MatriculaDisplay(admin.ModelAdmin):
    list_display = ["selecione_aluno", "trimestre", "classe"]

class UsuarioDisplay(admin.ModelAdmin):
    list_display = ["nome", "email", "role"]

class DiarioDisplay(admin.ModelAdmin):
    list_display = ["aula", "classe"]

## NÃO NECESSÁRIO
class ClasseDisplay(admin.ModelAdmin):
    list_display = ["nome_igreja", "nome"]

admin.site.register(Igreja)
admin.site.register(Usuario, UsuarioDisplay)
admin.site.register(Aluno)
admin.site.register(Aula)
admin.site.register(Classe, ClasseDisplay)
admin.site.register(Diario, DiarioDisplay)
admin.site.register(Presenca)
admin.site.register(Professor, ProfessorAdm)
admin.site.register(Trimestre, TrimestreDisplay)
admin.site.register(Matricula, MatriculaDisplay)

# Register your models here.
