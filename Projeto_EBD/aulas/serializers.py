from rest_framework import serializers
from .models import Igreja, Usuario, Classe, Trimestre, Aula, Professor, Diario, Aluno, Presenca, Matricula

class IgrejaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Igreja
        fields = ['id', 'nome']

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nome_igreja', 'nome', 'email', 'role']

class ClasseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classe
        fields = ['id', 'nome_igreja', 'nome']

class TrimestreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trimestre
        fields = ['id', 'nome_igreja', 'trimestre', 'ano', 'concluido']

class AulaSerializer(serializers.ModelSerializer):
    trimestre_da_aula = TrimestreSerializer()

    class Meta:
        model = Aula
        fields = ['id', 'trimestre_da_aula', 'aula', 'data_prevista', 'concluida']

class ProfessorSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer()
    classe = ClasseSerializer()

    class Meta:
        model = Professor
        fields = ['id', 'usuario', 'classe']

class DiarioSerializer(serializers.ModelSerializer):
    aula = AulaSerializer()
    classe = ClasseSerializer()

    class Meta:
        model = Diario
        fields = ['id', 'aula', 'classe', 'data_da_aula', 'alunos_presentes', 'alunos_ausentes', 
                  'numeros_visitantes', 'numeros_biblias', 'ofertas', 'dizimos']

class AlunoSerializer(serializers.ModelSerializer):
    nome_igreja = IgrejaSerializer()

    class Meta:
        model = Aluno
        fields = ['id', 'nome_igreja', 'nome', 'data_nascimento']

class PresencaSerializer(serializers.ModelSerializer):
    selecione_aluno = AlunoSerializer()
    diario = DiarioSerializer()

    class Meta:
        model = Presenca
        fields = ['id', 'selecione_aluno', 'diario', 'presenca']

class MatriculaSerializer(serializers.ModelSerializer):
    selecione_aluno = AlunoSerializer()
    trimestre = TrimestreSerializer()
    classe = ClasseSerializer()

    class Meta:
        model = Matricula
        fields = ['id', 'selecione_aluno', 'trimestre', 'classe']
