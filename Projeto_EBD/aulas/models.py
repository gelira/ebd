from django.db import models
from django.utils import timezone

class Igreja(models.Model):
    nome = models.CharField(max_length=50)

    def __str__(self):
        return self.nome

class Usuario(models.Model):
    ## Pega as informações do usuário, mas tem de assimilar com o sistema django pra poder realmente criar e dar as permissoes ao novo usuario
    igreja = models.ForeignKey(Igreja, on_delete=models.PROTECT)
    
    nome = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50) # update: "informe seu cargo"

    def __str__(self):
        return self.nome

class Classe(models.Model):
    igreja = models.ForeignKey(Igreja, on_delete=models.PROTECT)
    nome = models.CharField(max_length=50)

    def __str__(self):
        return self.nome
    
class Trimestre(models.Model):
    igreja = models.ForeignKey(Igreja, on_delete=models.PROTECT) # SE UM DELETA OS OUTROS TMB
    trimestre = models.CharField(max_length=50)# Não vai ser utilizado nenhuma operação aritmétrica
    ano = models.CharField(max_length=50) # PODERIA SER INT?
    concluido = models.BooleanField(default=False)

    def __str__(self):
        return self.trimestre

class Aula(models.Model):
    trimestre = models.ForeignKey(Trimestre, on_delete=models.PROTECT)
    aula = models.CharField(max_length=200)
    data_prevista = models.DateField(default=timezone.now) # VALOR PADRÃO DA DATA DE HOJE
    concluida = models.BooleanField(default=False)
    # data = models.DateTimeField() # VALOR PADRÃO DA DATA DE HOJE

    def __str__(self):
        return self.aula

class Professor(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.PROTECT) ## ANTES DE CRIAR O PROFESSOR TEM DE CRIAR O USUÁRIO
    classe = models.ForeignKey(Classe, on_delete=models.PROTECT)

    def __str__(self):
        return self.usuario.nome

class Diario(models.Model):
    aula = models.ForeignKey(Aula, on_delete=models.PROTECT)
    classe = models.ForeignKey(Classe, on_delete=models.PROTECT)

    data_da_aula = models.DateField() # VERIFICAR SE É EQUIVALENTE
    alunos_presentes = models.IntegerField()
    alunos_ausentes = models.IntegerField()
    numeros_visitantes = models.IntegerField()
    numeros_biblias = models.IntegerField()
    ofertas = models.FloatField()
    dizimos = models.FloatField()

    def __str__(self):
        return self.aula.aula

class Aluno(models.Model):
    igreja = models.ForeignKey(Igreja, on_delete=models.PROTECT)
    nome = models.CharField(max_length=200)
    data_nascimento = models.DateField()

    def __str__(self):
        return self.nome

class Presenca(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.PROTECT)
    diario = models.ForeignKey(Diario, on_delete=models.PROTECT)
    presenca = models.CharField(max_length=8) #PRESENTE / AUSENTE

    def __str__(self):
        return self.aluno.nome

class Matricula(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.PROTECT)
    trimestre = models.ForeignKey(Trimestre, on_delete=models.PROTECT)
    classe = models.ForeignKey(Classe, on_delete=models.PROTECT)

    def __str__(self):
        return self.aluno.nome

# class Relatório(models.Model):
#     diario = models.ForeignKey(Diario, on_delete=models.CASCADE)