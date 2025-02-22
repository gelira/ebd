from django.db import models

class Igreja(models.Model):
    ##id = chave primaria
    nome = models.CharField(max_length=50)

class Usuario(models.Model):
    ##id = chave primaria
    ## igreja foreinkey
    
    nome = models.CharField(200)
    email = models.EmailField(unique=True)
    role = models.CharField(label="informe seu cargo", placeholder='Informe')


# class Classe(models.Model):

# class Trimestre(models.Model):

class Aula(models.Model):
    #id chave primaria
    #trimestr chave estrangeira
    aula = models.CharField(max_length=200)
    data = models.DateField() # VALOR PADRÃO DA DATA DE HOJE
    # data = models.DateTimeField() # VALOR PADRÃO DA DATA DE HOJE

# class Professor(models.Model):
# class Diario(models.Model):
# class Presenca(models.Model):



# Create your models here.
