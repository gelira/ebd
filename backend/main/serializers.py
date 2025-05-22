from rest_framework import serializers

from . import models

class AlunoSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        aluno = models.Aluno()
        aluno.nome = validated_data['nome']
        aluno.data_nascimento = validated_data['data_nascimento']
        aluno.igreja_id = 1 # MOCKED

        aluno.save()

        return aluno

    class Meta:
        model = models.Aluno
        fields = [
            'uid',
            'nome',
            'data_nascimento'
        ]
