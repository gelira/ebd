from rest_framework.viewsets import ViewSet
from rest_framework.response import Response

from . import models, serializers

class AlunoViewSet(ViewSet):
    def list(self, request):
        qs = models.Aluno.objects.filter(igreja_id=1) # MOCKED

        return Response({ 'alunos': serializers.AlunoSerializer(qs, many=True).data })

    def create(self, request):
        ser = serializers.AlunoSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ser.save()

        return Response(serializers.AlunoSerializer(ser.instance).data)
