from django.db import transaction
from rest_framework import serializers
from rest_framework.generics import get_object_or_404
from rest_framework_simplejwt.tokens import AccessToken

from core import models, email, exceptions

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

class UsuarioSerializer(serializers.ModelSerializer):
    nome_igreja = serializers.CharField(source='igreja.nome', read_only=True)

    class Meta:
        model = models.Usuario
        fields = [
            'nome',
            'email',
            'role',
            'nome_igreja'
        ]

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

    def validate_aluno_uid(self, value):
        user = self.context['request'].user
        aluno = models.Aluno.objects.filter(
            igreja_id=user.igreja_id,
            uid=value
        ).first()

        if not aluno:
            raise serializers.ValidationError('Aluno not found.')

        return aluno

    def validate_classe_uid(self, value):
        user = self.context['request'].user
        classe = models.Classe.objects.filter(
            congregacao__igreja_id=user.igreja_id,
            uid=value
        ).first()

        if not classe:
            raise serializers.ValidationError('Classe not found.')

        return classe

    def validate_periodo_uid(self, value):
        user = self.context['request'].user
        periodo = models.Periodo.objects.filter(
            igreja_id=user.igreja_id,
            uid=value
        ).first()

        if not periodo:
            raise serializers.ValidationError('Periodo not found.')

        return periodo

    def validate(self, attrs):
        aluno = attrs['aluno_uid']
        classe = attrs['classe_uid']
        periodo = attrs['periodo_uid']

        if models.Matricula.objects.filter(
            aluno_id=aluno.id,
            periodo_id=periodo.id
        ).exists():
            raise serializers.ValidationError(
                'Aluno already has an active enrollment for this period.'
            )

        return {
            'aluno': aluno,
            'classe': classe,
            'periodo': periodo,
        }

    def create(self, data):
        return models.Matricula.objects.create(**data)

class ReadMatriculaSerializer(serializers.ModelSerializer):
    aluno_uid = serializers.UUIDField(source='aluno.uid')
    nome = serializers.CharField(source='aluno.nome')
    data_nascimento = serializers.DateField(source='aluno.data_nascimento')

    class Meta:
        model = models.Matricula
        fields = [
            'uid',
            'aluno_uid',
            'nome',
            'data_nascimento'
        ]

class PresencaSerializer(serializers.ModelSerializer):
    aluno_uid = serializers.UUIDField()

    class Meta:
        model = models.Presenca
        fields = ['aluno_uid', 'presenca']

class ReadPresencaSerializer(serializers.ModelSerializer):
    aluno_uid = serializers.UUIDField(source='aluno.uid')
    nome = serializers.CharField(source='aluno.nome')

    class Meta:
        model = models.Presenca
        fields = ['aluno_uid', 'nome', 'presenca']

class CreateDiarioSerializer(serializers.ModelSerializer):
    aula_uid = serializers.UUIDField(write_only=True)
    classe_uid = serializers.UUIDField(write_only=True)
    presencas = serializers.ListField(
        child=PresencaSerializer(),
        allow_empty=False,
        write_only=True
    )

    def validate(self, attrs):
        user = self.context['request'].user

        aula_uid = attrs['aula_uid']
        classe_uid = attrs['classe_uid']
        presencas = attrs['presencas']

        aula = get_object_or_404(
            models.Aula,
            periodo__igreja_id=user.igreja_id,
            uid=aula_uid
        )

        classe = get_object_or_404(
            models.Classe,
            congregacao_id=user.congregacao_id,
            uid=classe_uid
        )

        if models.Diario.objects.filter(
            aula_id=aula.id,
            classe_id=classe.id
        ).exists():
            raise serializers.ValidationError('Diário já registrado')

        presencas_alunos_dict = {}

        alunos = models.Aluno.objects.filter(
            matricula__periodo_id=aula.periodo_id,
            matricula__classe_id=classe.id
        )

        for aluno in alunos:
            pr = next(
                (p for p in presencas if str(p['aluno_uid']) == str(aluno.uid)),
                None
            )

            if not pr:
                raise serializers.ValidationError(
                    'Presença de aluno não registrada'
                )
            
            presencas_alunos_dict[pr['aluno_uid']] = {
                'aluno': aluno,
                'presenca': pr['presenca']
            }

        attrs.update({
            'aula': aula,
            'classe': classe,
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

            to_create = [
                models.Presenca(
                    diario=diario,
                    aluno=x['aluno'],
                    presenca=x['presenca']
                )
                for x in presencas_alunos
            ]

            models.Presenca.objects.bulk_create(to_create)

        return {}

    class Meta:
        model = models.Diario
        fields = [
            'aula_uid',
            'classe_uid',
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

class ReadDiarioSerializer(serializers.ModelSerializer):
    aula = serializers.SerializerMethodField()
    classe = serializers.SerializerMethodField()
    presencas = serializers.SerializerMethodField()

    def get_aula(self, obj):
        aula = obj.aula
        periodo = aula.periodo

        return {
            'uid': str(aula.uid),
            'aula': aula.aula,
            'periodo': periodo.periodo,
            'ano': periodo.ano
        }
    
    def get_classe(self, obj):
        classe = obj.classe

        return {
            'uid': str(classe.uid),
            'nome': classe.nome,
            'congregacao': classe.congregacao.nome,
        }
    
    def get_presencas(self, obj):
        presencas = obj.presenca_set.order_by('aluno__nome')

        return ReadPresencaSerializer(presencas, many=True).data

    class Meta:
        model = models.Diario
        fields = [
            'uid',
            'aula',
            'classe',
            'presencas',
            'data_aula',
            'quantidade_presentes',
            'quantidade_ausentes',
            'quantidade_visitantes',
            'quantidade_biblias',
            'quantidade_revistas',
            'ofertas',
            'dizimos'
        ]
        extra_kwargs = {
            'ofertas': {
                'coerce_to_string': False
            },
            'dizimos': {
                'coerce_to_string': False
            }
        }
