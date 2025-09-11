from rest_framework.decorators import action
from rest_framework.exceptions import ParseError
from rest_framework.generics import get_object_or_404
from rest_framework.mixins import (
    CreateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
)
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from core import models, serializers
from utils import validate_uuid

class AuthCodeViewSet(CreateModelMixin, GenericViewSet):
    authentication_classes = []
    permission_classes = []

    def get_serializer_class(self):
        if self.action == 'verify':
            return serializers.AuthCodeVerifySerializer

        return serializers.LoginSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        response.status_code = 200

        return response

    @action(detail=False, methods=['post'])
    def verify(self, request):
        return self.create(request)

class AlunoViewSet(ModelViewSet):
    lookup_field = 'uid'
    lookup_value_converter = 'uuid'
    serializer_class = serializers.AlunoSerializer

    def get_queryset(self):
        igreja_id = self.request.user.igreja_id

        qs = models.Aluno.objects.filter(igreja_id=igreja_id)

        if self.action == 'list':
            nome = self.request.query_params.get('nome')

            if nome:
                qs = qs.filter(nome__icontains=nome)

            periodo_uid = validate_uuid(
                self.request.query_params.get('sem_matricula_periodo_uid')
            )

            if periodo_uid:
                periodo = get_object_or_404(
                    models.Periodo,
                    uid=periodo_uid,
                    igreja_id=igreja_id
                )

                congregacao_id = self.request.user.congregacao_id

                qs = qs.exclude(
                    matricula__periodo_id=periodo.id,
                    matricula__classe__congregacao_id=congregacao_id
                )

        return qs

    def perform_create(self, serializer):
        serializer.save(igreja_id=self.request.user.igreja_id)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        return Response({ 'alunos': response.data })

class CongregacaoViewSet(ModelViewSet):
    lookup_field = 'uid'
    lookup_value_converter = 'uuid'
    serializer_class = serializers.CongregacaoSerializer

    def get_queryset(self):
        congregacao_id = self.request.user.congregacao_id

        return models.Congregacao.objects.filter(pk=congregacao_id)

    def perform_create(self, serializer):
        serializer.save(igreja_id=self.request.user.igreja_id)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        return Response({ 'congregacoes': response.data })

class ClasseViewSet(ModelViewSet):
    lookup_field = 'uid'
    lookup_value_converter = 'uuid'
    serializer_class = serializers.ClasseSerializer

    def get_queryset(self):
        congregacao_id = self.request.user.congregacao_id

        return models.Classe.objects.filter(congregacao_id=congregacao_id)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        return Response({ 'classes': response.data })

class PeriodoViewSet(ModelViewSet):
    lookup_field = 'uid'
    lookup_value_converter = 'uuid'
    serializer_class = serializers.PeriodoSerializer

    def get_queryset(self):
        igreja_id = self.request.user.igreja_id

        qs = models.Periodo.objects.filter(igreja_id=igreja_id)

        if self.action == 'list':
            ano = self.request.query_params.get('ano')

            if ano:
                qs = qs.filter(ano=ano)

        return qs
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        return Response({ 'periodos': response.data })

class AulaViewSet(ModelViewSet):
    lookup_field = 'uid'
    lookup_value_converter = 'uuid'
    serializer_class = serializers.AulaSerializer

    def get_queryset(self):
        igreja_id = self.request.user.igreja_id

        if self.action != 'list':
            return models.Aula.objects.filter(periodo__igreja_id=igreja_id)
        
        periodo_uid = validate_uuid(
            self.request.query_params.get('periodo_uid')
        )

        if not periodo_uid:
            raise ParseError('periodo_uid invalid', 'invalid_params')

        periodo = get_object_or_404(
            models.Periodo,
            uid=periodo_uid,
            igreja_id=igreja_id
        )

        return models.Aula.objects.filter(periodo_id=periodo.id)
    
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        return Response({ 'aulas': response.data })

class MatriculaViewSet(
    CreateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
    GenericViewSet
):
    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.ReadMatriculaSerializer

        return serializers.MatriculaSerializer

    def get_queryset(self):
        classe_uid = validate_uuid(self.request.query_params.get('classe_uid'))

        periodo_uid = validate_uuid(
            self.request.query_params.get('periodo_uid')
        )

        if not classe_uid:
            raise ParseError('classe_uid invalid', 'invalid_params')

        if not periodo_uid:
            raise ParseError('periodo_uid invalid', 'invalid_params')

        igreja_id = self.request.user.igreja_id
        congregacao_id = self.request.user.congregacao_id
        
        classe = get_object_or_404(
            models.Classe,
            uid=classe_uid,
            congregacao_id=congregacao_id
        )

        periodo = get_object_or_404(
            models.Periodo,
            uid=periodo_uid,
            igreja_id=igreja_id
        )

        return models.Matricula.objects.filter(
            classe_id=classe.id,
            periodo_id=periodo.id
        )
    
    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)

        return Response(status=204)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        return Response({ 'matriculas': response.data })

class DiarioViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):
    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.ReadDiarioSerializer

        return serializers.DiarioSerializer
    
    def get_queryset(self):
        aula_uid = validate_uuid(self.request.query_params.get('aula_uid'))

        if not aula_uid:
            raise ParseError('aula_uid invalid', 'invalid_params')
        
        user = self.request.user

        aula = get_object_or_404(
            models.Aula,
            periodo__igreja_id=user.igreja_id,
            uid=aula_uid
        )

        filter_dict = {
            'aula_id': aula.id,
        }

        classe_uid = validate_uuid(self.request.query_params.get('classe_uid'))

        if classe_uid:
            classe = get_object_or_404(
                models.Classe,
                congregacao_id=user.congregacao_id,
                uid=classe_uid
            )

            filter_dict.update({
                'classe_id': classe.id
            })

        return models.Diario.objects.filter(**filter_dict)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        return Response({ 'diarios': response.data })

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)

        return Response(status=204)
