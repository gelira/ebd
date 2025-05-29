from rest_framework.viewsets import ViewSet, GenericViewSet
from rest_framework.mixins import CreateModelMixin
from rest_framework.response import Response

from . import models, serializers

class AuthCodeViewSet(CreateModelMixin, GenericViewSet):
    def get_serializer_class(self):
        return serializers.LoginSerializer

class AlunoViewSet(ViewSet):
    def list(self, request):
        nome = request.query_params.get('nome')

        qs = models.Aluno.objects.filter(igreja_id=1) # MOCKED
        if nome:
            qs = qs.filter(nome__icontains=nome)

        return Response({ 'alunos': serializers.AlunoSerializer(qs, many=True).data })

    def create(self, request):
        ser = serializers.AlunoSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ser.save()

        return Response(serializers.AlunoSerializer(ser.instance).data)
