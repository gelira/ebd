from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework_simplejwt.tokens import AccessToken

from . import models, email, exceptions

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    auth_code_uid = serializers.UUIDField(read_only=True, source='uid')
    
    def save(self):
        usuario = models.Usuario.objects.filter(
            email=self.validated_data['email']
        ).first()

        if not usuario:
            raise exceptions.InvalidCredentialsException()

        self.instance = models.AuthCode.generate(usuario)

        email.send_mail_async(
            'EBD - Código de acesso',
            usuario.email,
            f'Seu código de autenticação: {self.instance.code}'
        )

        return self.instance

class AuthCodeVerifySerializer(serializers.Serializer):
    auth_code_uid = serializers.UUIDField(write_only=True)
    code = serializers.CharField(max_length=6, write_only=True)
    token = serializers.CharField(read_only=True)
    
    def create(self, data):
        usuario = models.AuthCode.verify(
            data['auth_code_uid'],
            data['code']
        )

        token = AccessToken.for_user(usuario)

        return { 'token': str(token) }

class AlunoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Aluno
        fields = [
            'uid',
            'nome',
            'data_nascimento'
        ]

class CongregacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Congregacao
        fields = [
            'uid',
            'nome'
        ]

class ClasseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Classe
        fields = [
            'uid',
            'nome'
        ]

class PeriodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Periodo
        fields = [
            'uid',
            'ano',
            'periodo',
            'concluido'
        ]
        read_only_fields = [
            'concluido'
        ]

class AulaSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Aula
        fields = [
            'uid',
            'aula',
            'data_prevista',
            'concluida'
        ]
        read_only_fields = [
            'concluida'
        ]

class MatriculaSerializer(serializers.Serializer):
    aluno_uid = serializers.UUIDField(write_only=True)
    classe_uid = serializers.UUIDField(write_only=True)
    periodo_uid = serializers.UUIDField(write_only=True)

    def validate(self, attrs):
        igreja_id = self.context['request'].user.igreja_id

        aluno = models.Aluno.objects.filter(igreja_id=igreja_id, uid=attrs['aluno_uid']).first()
        if not aluno:
            raise serializers.ValidationError('Aluno not found')

        classe = models.Classe.objects.filter(
            congregacao__igreja_id=igreja_id,
            uid=attrs['classe_uid']
        ).first()

        if not classe:
            raise serializers.ValidationError('Classe not found')

        periodo = models.Periodo.objects.filter(
            congregacao__igreja_id=igreja_id,
            uid=attrs['periodo_uid']
        ).first()

        if not periodo:
            raise serializers.ValidationError('Periodo not found')

        if periodo.concluido:
            raise serializers.ValidationError('Periodo concluído')

        if models.Matricula.objects.filter(aluno_id=aluno.id, periodo_id=periodo.id).exists():
            raise serializers.ValidationError('Matricula already exists')

        return {
            'aluno': aluno,
            'classe': classe,
            'periodo': periodo,
        }

    def create(self, data):
        return models.Matricula.objects.create(
            aluno=data['aluno'],
            classe=data['classe'],
            periodo=data['periodo']
        )
