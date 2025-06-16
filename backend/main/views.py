from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework.mixins import CreateModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import MethodNotAllowed

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

    def get_queryset(self):
        return models.Congregacao.objects\
            .filter(igreja_id=self.request.user.igreja_id)\
                .order_by('nome')
    
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

        ser = serializers.ClasseSerializer(
            congregacao.classe_set.order_by('nome'),
            many=True
        )

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

class ClasseViewSet(UpdateModelMixin, DestroyModelMixin, GenericViewSet):
    lookup_field = 'uid'
    serializer_class = serializers.ClasseSerializer

    def get_queryset(self):
        return models.Classe.objects.filter(
            congregacao__igreja_id=self.request.user.igreja_id
        )

    @action(detail=True, methods=['get', 'post'])
    def matriculas(self, request, *args, **kwargs):
        periodo_uid = request.query_params.get('periodo_uid')

        if not periodo_uid:
            return Response({ 'error': 'periodo_uid must be specified as query param' }, status=400)
        
        if request.method.lower() == 'post':
            ser = serializers.MatriculaSerializer(data={
                **request.data,
                'periodo_uid': periodo_uid,
                'classe_uid': kwargs['uid'],
            }, context={ 'request': request })

            ser.is_valid(raise_exception=True)
            ser.save()

            return Response(status=204)
        
        qs = models.Aluno.objects.filter(
            matricula__classe__uid=kwargs['uid'],
            matricula__periodo__uid=periodo_uid
        ).order_by('nome')

        ser = serializers.AlunoSerializer(qs, many=True)

        return Response({ 'alunos': ser.data })

class PeriodoViewSet(CreateModelMixin, UpdateModelMixin, DestroyModelMixin, GenericViewSet):
    lookup_field = 'uid'

    def get_serializer_class(self):
        if self.action == 'aulas':
            return serializers.AulaSerializer
        return serializers.PeriodoSerializer

    def get_queryset(self):
        return models.Periodo.objects.filter(
            congregacao__igreja_id=self.request.user.igreja_id
        )

    def create(self, request, *args, **kwargs):
        if self.action == 'create':
            raise MethodNotAllowed('POST')

        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        periodo = self.get_object()

        serializer.save(periodo=periodo)

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

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)

        return Response(status=204)
