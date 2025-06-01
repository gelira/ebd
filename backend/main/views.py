from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework.mixins import CreateModelMixin
from rest_framework.response import Response
from rest_framework.decorators import action

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

    @action(detail=False, methods=['post'], url_path='verify')
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
    serializer_class = serializers.CongregacaoSerializer
    lookup_field = 'uid'

    def get_queryset(self):
        return models.Congregacao.objects\
            .filter(igreja_id=self.request.user.igreja_id)\
                .order_by('nome')
    
    def perform_create(self, serializer):
        serializer.save(igreja_id=self.request.user.igreja_id)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        return Response({ 'congregacoes': response.data })

class ClasseViewSet(ModelViewSet):
    lookup_field = 'uid'

    def get_queryset(self):
        return models.Classe.objects\
            .filter(congregacao__igreja_id=self.request.user.igreja_id)\
                .order_by('nome')
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return serializers.ClasseUpdateSerializer
        return serializers.ClasseSerializer

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)

        return Response({ 'classes': response.data })
