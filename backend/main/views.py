from rest_framework.generics import get_object_or_404
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework.mixins import CreateModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import MethodNotAllowed

from . import models, serializers

PROFESSOR = models.Usuario.PROFESSOR

CARGOS_CONGREGACAO = [
    models.Usuario.SECRETARIO_CONGREGACAO,
    models.Usuario.SUPERINTENDENTE_CONGREGACAO
]

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
    serializer_class = serializers.AlunoSerializer
    lookup_field = 'uid'

    def get_queryset(self):
        qs = models.Aluno.objects.filter(igreja_id=self.request.user.igreja_id)

        nome = self.request.query_params.get('nome')
        if self.action == 'list' and nome:
            qs = qs.filter(nome__icontains=nome)

        return qs.order_by('nome')
    
    def perform_create(self, serializer):
        serializer.save(igreja_id=self.request.user.igreja_id)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        return Response({ 'alunos': response.data })

class CongregacaoViewSet(ModelViewSet):
    lookup_field = 'uid'
    lookup_value_converter = 'uuid'

    def get_queryset(self):
        user = self.request.user

        filter_dict = {
            'igreja_id': user.igreja_id
        }

        if user.role in CARGOS_CONGREGACAO:
            filter_dict['id'] = user.entity_id

        elif user.role == PROFESSOR:
            filter_dict['classe__id'] = user.entity_id

        return models.Congregacao.objects.filter(**filter_dict).order_by('nome')

    def get_serializer_class(self):
        if self.action == 'classes':
            return serializers.ClasseSerializer

        if self.action == 'periodos':
            return serializers.PeriodoSerializer

        return serializers.CongregacaoSerializer
    
    def perform_create(self, serializer):
        kw = {}

        if self.action in ['classes', 'periodos']:
            kw['congregacao'] = self.get_object()

        else:
            kw['igreja_id'] = self.request.user.igreja_id

        serializer.save(**kw)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        return Response({ 'congregacoes': response.data })

    @action(detail=True, methods=['get', 'post'])
    def classes(self, request, *args, **kwargs):
        if request.method.lower() == 'post':
            return self.create(request)

        congregacao = self.get_object()

        qs = congregacao.classe_set.order_by('nome')

        if request.user.role == PROFESSOR:
            qs = qs.filter(id=request.user.entity_id)

        ser = serializers.ClasseSerializer(qs, many=True)

        return Response({ 'classes': ser.data })
    
    @action(detail=True, methods=['get', 'post'])
    def periodos(self, request, *args, **kwargs):
        if request.method.lower() == 'post':
            return self.create(request)

        congregacao = self.get_object()

        qs = congregacao.periodo_set.all()

        ano = self.request.query_params.get('ano')
        if ano:
            qs = qs.filter(ano=ano)

        ser = serializers.PeriodoSerializer(qs.order_by('periodo'), many=True)

        return Response({ 'periodos': ser.data })

class ClasseViewSet(CreateModelMixin, UpdateModelMixin, DestroyModelMixin, GenericViewSet):
    lookup_field = 'uid'
    lookup_value_converter = 'uuid'

    def get_serializer_class(self):
        if self.action == 'matriculas':
            return serializers.MatriculaSerializer

        return serializers.ClasseSerializer

    def get_queryset(self):
        user = self.request.user

        filter_dict = {}

        if user.role in CARGOS_CONGREGACAO:
            filter_dict['congregacao_id'] = user.entity_id

        elif user.role == PROFESSOR:
            filter_dict['id'] = user.entity_id

        else:
            filter_dict['congregacao__igreja_id'] = user.igreja_id

        return models.Classe.objects.filter(**filter_dict).order_by('nome')
    
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
        ).order_by('nome')

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
        user = self.request.user

        filter_dict = {}

        if user.role in CARGOS_CONGREGACAO:
            filter_dict['congregacao_id'] = user.entity_id

        elif user.role == PROFESSOR:
            filter_dict['congregacao__classe__id'] = user.entity_id

        else:
            filter_dict['congregacao__igreja_id'] = user.igreja_id

        return models.Periodo.objects.filter(**filter_dict).order_by('-ano', 'periodo')

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

    def list(self, request, *args, **kwargs):
        igreja_id = request.user.igreja_id

        classe = get_object_or_404(
            models.Classe,
            uid=request.query_params.get('classe_uid'),
            congregacao__igreja_id=igreja_id
        )

        aula = get_object_or_404(
            models.Aula,
            uid=request.query_params.get('aula_uid'),
            periodo__congregacao__igreja_id=igreja_id
        )

        diario = get_object_or_404(
            models.Diario,
            aula_id=aula.id,
            classe_id=classe.id
        )

        ser = serializers.ReadDiarioSerializer(diario)

        return Response(ser.data)

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)

        return Response(status=204)
