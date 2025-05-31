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
    
    def save(self):
        usuario = models.AuthCode.verify(
            self.validated_data['auth_code_uid'],
            self.validated_data['code']
        )

        token = AccessToken.for_user(usuario)

        self.instance = { 'token': str(token) }

        return self.instance

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
