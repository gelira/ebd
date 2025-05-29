from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed

from . import models, email

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    auth_code_uid = serializers.UUIDField(read_only=True, source='uid')
    
    def save(self):
        usuario = models.Usuario.objects.filter(
            email=self.validated_data['email']
        ).first()

        if not usuario:
            raise AuthenticationFailed()

        self.instance = models.AuthCode.generate(usuario)

        email.send_mail_async(
            'EBD - Código de acesso',
            usuario.email,
            f'Seu código de autenticação: {self.instance.code}'
        )

        return self.instance

class AlunoSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        aluno = models.Aluno()
        aluno.nome = validated_data.get('nome')
        aluno.data_nascimento = validated_data.get('data_nascimento')
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
