from uuid import uuid4
from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate

from core.models import (
    Igreja,
    Congregacao,
    Usuario,
    Periodo,
)
from core.views import PeriodoViewSet


# Create your tests here.
class PeriodoTeste(TestCase):
    def setUp(self):
        igreja = Igreja.objects.create(nome='Igreja Teste')
        congregacao = Congregacao.objects.create(nome='Congregacao Teste', igreja=igreja)
        
        Periodo.objects.create(periodo='Periodo 1', ano='2025', igreja=igreja)
        Periodo.objects.create(periodo='Periodo 2', ano='2025', igreja=igreja)
        Periodo.objects.create(periodo='Periodo 3', ano='2025', igreja=igreja)
        Periodo.objects.create(periodo='Periodo 4', ano='2025', igreja=igreja)
        Periodo.objects.create(periodo='Periodo 1', ano='2026', igreja=igreja)

        self.factory = APIRequestFactory()
        self.user = Usuario.objects.create(
            igreja=igreja,
            congregacao=congregacao,
            nome='Teste',
            email='teste@teste.com',
            role=Usuario.SUPERINTENDENTE
        )

    def test_list_periodos_by_ano_2025(self):
        request = self.factory.get('/api/periodos?ano=2025')

        force_authenticate(request, user=self.user)

        response = PeriodoViewSet.as_view({ 'get': 'list' })(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['periodos']), 4)

    def test_list_periodos_by_ano_2026(self):
        request = self.factory.get('/api/periodos?ano=2026')

        force_authenticate(request, user=self.user)

        response = PeriodoViewSet.as_view({ 'get': 'list' })(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['periodos']), 1)
