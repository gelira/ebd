from django.shortcuts import get_object_or_404
from django.db import transaction
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

class PresencaSerializer(serializers.ModelSerializer):
    aluno_uid = serializers.UUIDField()

    class Meta:
        model = models.Presenca
        fields = ['aluno_uid', 'presenca']

class DiarioSerializer(serializers.ModelSerializer):
    aula_uid = serializers.UUIDField(write_only=True)
    classe_uid = serializers.UUIDField(write_only=True)
    periodo_uid = serializers.UUIDField(write_only=True)
    presencas = serializers.ListField(
        child=PresencaSerializer(),
        allow_empty=False,
        write_only=True
    )

    def validate(self, attrs):
        igreja_id = self.context['request'].user.igreja_id

        aula_uid = attrs['aula_uid']
        classe_uid = attrs['classe_uid']
        periodo_uid = attrs['periodo_uid']
        presencas = attrs['presencas']

        periodo = get_object_or_404(
            models.Periodo,
            congregacao__igreja_id=igreja_id,
            concluido=False,
            uid=periodo_uid
        )

        aula = get_object_or_404(
            models.Aula,
            uid=aula_uid,
            concluida=False,
            periodo_id=periodo.id
        )

        classe = get_object_or_404(
            models.Classe,
            uid=classe_uid,
            congregacao__igreja_id=igreja_id
        )

        if models.Diario.objects.filter(aula_id=aula.id, classe_id=classe.id).exists():
            raise serializers.ValidationError('Diário já registrado')

        presencas_alunos_dict = {}

        alunos = models.Aluno.objects.filter(
            matricula__periodo_id=periodo.id,
            matricula__classe_id=classe.id
        )

        for aluno in alunos:
            pr = next((p for p in presencas if str(p['aluno_uid']) == str(aluno.uid)), None)

            if not pr:
                raise serializers.ValidationError('Presença de aluno não registrada')
            
            presencas_alunos_dict[pr['aluno_uid']] = {
                'aluno': aluno,
                'presenca': pr['presenca']
            }

        attrs.update({
            'aula': aula,
            'classe': classe,
            'periodo': periodo,
            'presencas_alunos': presencas_alunos_dict.values()
        })

        return attrs
    
    def create(self, data):
        presencas_alunos = data['presencas_alunos']
        presentes = 0
        ausentes = 0

        for p in presencas_alunos:
            if p['presenca'] == models.Presenca.PRESENTE:
                presentes += 1
            else:
                ausentes += 1
        
        with transaction.atomic():
            diario = models.Diario.objects.create(
                aula=data['aula'],
                classe=data['classe'],
                data_aula=data['data_aula'],
                quantidade_visitantes=data['quantidade_visitantes'],
                quantidade_biblias=data['quantidade_biblias'],
                quantidade_revistas=data['quantidade_revistas'],
                quantidade_presentes=presentes,
                quantidade_ausentes=ausentes,
                ofertas=data['ofertas'],
                dizimos=data['dizimos']
            )

            to_create = list(map(
                lambda x: models.Presenca(diario=diario, aluno=x['aluno'], presenca=x['presenca']),
                presencas_alunos
            ))

            models.Presenca.objects.bulk_create(to_create)

        return {}

    class Meta:
        model = models.Diario
        fields = [
            'aula_uid',
            'classe_uid',
            'periodo_uid',
            'presencas',
            'data_aula',
            'quantidade_visitantes',
            'quantidade_biblias',
            'quantidade_revistas',
            'ofertas',
            'dizimos'
        ]
        extra_kwargs = {
            'data_aula': {
                'write_only': True
            },
            'quantidade_visitantes': {
                'min_value': 0,
                'write_only': True
            },
            'quantidade_biblias': {
                'min_value': 0,
                'write_only': True
            },
            'quantidade_revistas': {
                'min_value': 0,
                'write_only': True
            },
            'ofertas': {
                'min_value': 0,
                'write_only': True
            },
            'dizimos': {
                'min_value': 0,
                'write_only': True
            }
        }
