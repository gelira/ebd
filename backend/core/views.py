from rest_framework.generics import get_object_or_404
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework.mixins import CreateModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import MethodNotAllowed, ParseError
from utils import validate_uuid

from . import models, serializers

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
        qs = models.Aluno.objects.filter(igreja_id=self.request.user.igreja_id)

        if self.action in ['list', 'nao_matriculados']:
            nome = self.request.query_params.get('nome')

            if nome:
                qs = qs.filter(nome__icontains=nome)

        if self.action == 'nao_matriculados':
            periodo_uid = validate_uuid(self.request.query_params.get('periodo_uid'))

            if not periodo_uid:
                raise ParseError('periodo_uid invalid', 'invalid_params')

            igreja_id = self.request.user.igreja_id

            periodo = models.Periodo.objects.filter(uid=periodo_uid, igreja_id=igreja_id).first()

            if not periodo:
                raise ParseError('periodo_uid invalid', 'invalid_params')

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

    @action(detail=False, methods=['get'], url_path='nao-matriculados')
    def nao_matriculados(self, request):
        return self.list(request)

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

    def get_serializer_class(self):
        if self.action == 'matriculas':
            return serializers.MatriculaSerializer

        return serializers.ClasseSerializer

    def get_queryset(self):
        congregacao_id = self.request.user.congregacao_id

        return models.Classe.objects.filter(congregacao_id=congregacao_id)
    
    def create(self, request, *args, **kwargs):
        if self.action == 'create':
            raise MethodNotAllowed('POST')
        
        super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(classe=self.get_object())

    @action(detail=True, methods=['get', 'post'])
    def matriculas(self, request, *args, **kwargs):
        if request.method.lower() == 'post':
            self.create(request)

            return Response(status=204)

        periodo_uid = request.query_params.get('periodo_uid')

        if not periodo_uid:
            return Response({ 'error': 'periodo_uid must be specified as query param' }, status=400)

        classe = self.get_object()

        periodo = get_object_or_404(
            models.Periodo,
            uid=periodo_uid,
            congregacao_id=classe.congregacao_id
        )

        qs = models.Aluno.objects.filter(
            matricula__classe_id=classe.id,
            matricula__periodo_id=periodo.id
        )

        ser = serializers.AlunoSerializer(qs, many=True)

        return Response({ 'alunos': ser.data })

class PeriodoViewSet(CreateModelMixin, UpdateModelMixin, DestroyModelMixin, GenericViewSet):
    lookup_field = 'uid'
    lookup_value_converter = 'uuid'

    def get_serializer_class(self):
        if self.action == 'aulas':
            return serializers.AulaSerializer

        return serializers.PeriodoSerializer

    def get_queryset(self):
        igreja_id = self.request.user.igreja_id

        return models.Periodo.objects.filter(igreja_id=igreja_id)

    def create(self, request, *args, **kwargs):
        if self.action == 'create':
            raise MethodNotAllowed('POST')

        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(periodo=self.get_object())

    @action(detail=True, methods=['get', 'post'])
    def aulas(self, request, *args, **kwargs):
        if request.method.lower() == 'post':
            return self.create(request)

        periodo = self.get_object()

        ser = serializers.AulaSerializer(
            periodo.aula_set.order_by('data_prevista', 'aula'),
            many=True
        )

        return Response({ 'aulas': ser.data })

class DiarioViewSet(CreateModelMixin, GenericViewSet):
    serializer_class = serializers.DiarioSerializer

    # def list(self, request, *args, **kwargs):
    #     user = request.user
    #     classe_uid = request.query_params.get('classe_uid')
    #     aula_uid = request.query_params.get('aula_uid')

    #     classe = utils.get_classe(user, classe_uid)
    #     aula = utils.get_aula(user, aula_uid)

    #     diario = get_object_or_404(
    #         models.Diario,
    #         aula_id=aula.id,
    #         classe_id=classe.id
    #     )

    #     ser = serializers.ReadDiarioSerializer(diario)

    #     return Response(ser.data)

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)

        return Response(status=204)
