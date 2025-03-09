from django.db import models

class Igreja(models.Model):
    id = models.AutoField(primary_key = True)
    nome = models.CharField(max_length=50)

    def __str__(self):
        return self.nome

class Usuario(models.Model): 
    ## Pega as informações do usuário, mas tem de assimilar com o sistema django pra poder realmente criar e dar as permissoes ao novo usuario
    
    id = models.BigAutoField(primary_key=True)
    nome_igreja = models.ForeignKey(Igreja, on_delete=models.CASCADE)
    
    nome = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50) # update: "informe seu cargo"


class Classe(models.Model):
    id = models.AutoField(primary_key=True)
    nome_igreja = models.ForeignKey(Igreja, on_delete=models.CASCADE) 
    nome = models.CharField(max_length=50)

class Trimestre(models.Model):
    id = models.AutoField(primary_key=True)
    nome_igreja = models.ForeignKey(Igreja, on_delete=models.CASCADE) # SE UM DELETA OS OUTROS TMB

    trimestre = models.CharField(max_length=50)# PODERIA SER INT?
    ano = models.CharField(max_length=50) # PODERIA SER INT?
    concluido = models.BooleanField(default=True)

class Aula(models.Model):
    id = models.AutoField(primary_key=True)
    trimestre_da_aula = models.ForeignKey(Trimestre, on_delete=models.CASCADE)


    aula = models.CharField(max_length=200)
    data_prevista = models.DateField() # VALOR PADRÃO DA DATA DE HOJE
    concluida = models.BooleanField(default=True)
    # data = models.DateTimeField() # VALOR PADRÃO DA DATA DE HOJE

class Professor(models.Model):
    id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE) ## ANTES DE CRIAR O PROFESSOR TEM DE CRIAR O USUÁRIO
    classe = models.ForeignKey(Classe, on_delete=models.CASCADE)

class Diario(models.Model):
    id = models.AutoField(primary_key=True)
    aula = models.ForeignKey(Aula, on_delete=models.CASCADE) ## ANTES DE CRIAR O PROFESSOR TEM DE CRIAR O USUÁRIO
    classe = models.ForeignKey(Classe, on_delete=models.CASCADE)

    data_da_aula = models.DateField() # VERIFICAR SE É EQUIVALENTE
    alunos_presentes = models.IntegerField()
    alunos_ausentes = models.IntegerField()
    numeros_visitantes = models.IntegerField()
    numeros_biblias = models.IntegerField()

    ofertas = models.BooleanField(default=True)
    dizimos = models.BooleanField(default=True)

class Aluno(models.Model):
    id = models.AutoField(primary_key=True)
    nome_igreja = models.ForeignKey(Igreja, on_delete=models.CASCADE)

    nome = models.CharField(max_length=50)
    data_nascimento = models.DateField()

class Presenca(models.Model):
    id = models.AutoField(primary_key=True)
    selecione_aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE)
    diario = models.ForeignKey(Diario, on_delete=models.CASCADE)

    presenca = models.CharField(max_length=8) #PRESENTE / AUSENTE

class Matricula(models.Model):
    id = models.AutoField(primary_key=True)
    selecione_aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE)
    trimestre = models.ForeignKey(Trimestre, on_delete=models.CASCADE)
    classe = models.ForeignKey(Classe, on_delete=models.CASCADE)