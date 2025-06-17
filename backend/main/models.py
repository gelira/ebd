from django.db import models
from django.utils import timezone
from datetime import timedelta
from utils.models import BaseModel
from utils import generate_random_numeric_string
from . import exceptions

class Igreja(BaseModel):
    nome = models.CharField(max_length=200)

class Usuario(BaseModel):
    SUPERINTENDENTE_GERAL = 'superintendente-geral'
    SUPERINTENDENTE_CONGREGACAO = 'superintendente-congregacao'
    SECRETARIO_GERAL = 'secretario-geral'
    SECRETARIO_CONGREGACAO = 'secretario-congregacao'
    PROFESSOR = 'professor'
    ROLE_CHOICES = [
        (SUPERINTENDENTE_GERAL, SUPERINTENDENTE_GERAL),
        (SUPERINTENDENTE_CONGREGACAO, SUPERINTENDENTE_CONGREGACAO),
        (SECRETARIO_GERAL, SECRETARIO_GERAL),
        (SECRETARIO_CONGREGACAO, SECRETARIO_CONGREGACAO),
        (PROFESSOR, PROFESSOR),
    ]

    igreja = models.ForeignKey(Igreja, on_delete=models.PROTECT)
    nome = models.CharField(max_length=200)
    email = models.EmailField()
    role = models.CharField(choices=ROLE_CHOICES, max_length=50)
    entity_id = models.BigIntegerField(null=True)

class AuthCode(BaseModel):
    usuario = models.ForeignKey(Usuario, on_delete=models.PROTECT)
    code = models.CharField(max_length=6)
    is_active = models.BooleanField(default=True)
    expired_at = models.DateTimeField()

    @classmethod
    def generate(cls, usuario):
        return cls.objects.create(
            usuario=usuario,
            code=generate_random_numeric_string(),
            expired_at=timezone.now() + timedelta(minutes=10)
        )
    
    @classmethod
    def verify(cls, uid, code):
        auth_code = cls.objects.filter(
            uid=uid,
            code=code,
            is_active=True,
            expired_at__gt=timezone.now()
        ).first()

        if not auth_code:
            raise exceptions.InvalidCredentialsException()

        auth_code.is_active = False
        auth_code.save()

        return auth_code.usuario

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
    data_nascimento = models.DateField(null=True)

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
    PRESENTE = 'presente'
    AUSENTE = 'ausente'
    AUSENCIA_JUSTIFICADA = 'ausencia_justificada'
    PRESENCA_CHOICES = [
        (PRESENTE, PRESENTE),
        (AUSENTE, AUSENTE),
        (AUSENCIA_JUSTIFICADA, AUSENCIA_JUSTIFICADA),
    ]

    aluno = models.ForeignKey(Aluno, on_delete=models.PROTECT)
    diario = models.ForeignKey(Diario, on_delete=models.PROTECT)
    presenca = models.CharField(choices=PRESENCA_CHOICES)