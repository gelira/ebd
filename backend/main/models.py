from django.db import models
from utils.models import BaseModel

class Igreja(BaseModel):
    nome = models.CharField(max_length=200)

class Usuario(BaseModel):
    igreja = models.ForeignKey(Igreja, on_delete=models.PROTECT)
    nome = models.CharField(max_length=200)
    email = models.EmailField()
    role = models.CharField(max_length=50)
    entity_id = models.BigIntegerField(null=True)

class Congregacao(BaseModel):
    igreja = models.ForeignKey(Igreja, on_delete=models.PROTECT)
    nome = models.CharField(max_length=200)

class Classe(BaseModel):
    congregacao = models.ForeignKey(Congregacao, on_delete=models.PROTECT)
    nome = models.CharField(max_length=200)

class Periodo(BaseModel):
    congregacao = models.ForeignKey(Congregacao, on_delete=models.PROTECT)
    periodo = models.CharField(max_length=200)
    ano = models.CharField(max_length=20)
    concluido = models.BooleanField(default=False)

class Aluno(BaseModel):
    igreja = models.ForeignKey(Igreja, on_delete=models.PROTECT)
    nome = models.TextField()
    data_nascimento = models.DateField()

class Aula(BaseModel):
    periodo = models.ForeignKey(Periodo, on_delete=models.PROTECT)
    aula = models.CharField(max_length=50)
    data_prevista = models.DateField()
    concluida = models.BooleanField(default=False)

class Matricula(BaseModel):
    aluno = models.ForeignKey(Aluno, on_delete=models.PROTECT)
    classe = models.ForeignKey(Classe, on_delete=models.PROTECT)
    periodo = models.ForeignKey(Periodo, on_delete=models.PROTECT)

class Diario(BaseModel):
    aula = models.ForeignKey(Aula, on_delete=models.PROTECT)
    classe = models.ForeignKey(Classe, on_delete=models.PROTECT)
    data_aula = models.DateField()
    quantidade_presentes = models.IntegerField()
    quantidade_ausentes = models.IntegerField()
    quantidade_visitantes = models.IntegerField()
    quantidade_biblias = models.IntegerField()
    quantidade_revistas = models.IntegerField()
    ofertas = models.DecimalField(max_digits=20, decimal_places=2)
    dizimos = models.DecimalField(max_digits=20, decimal_places=2)

class Presenca(BaseModel):
    aluno = models.ForeignKey(Aluno, on_delete=models.PROTECT)
    diario = models.ForeignKey(Diario, on_delete=models.PROTECT)
    presenca = models.CharField(max_length=50)