from uuid import uuid4
from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate

from core.models import (
    Igreja,
    Congregacao,
    Usuario,
    Periodo,
    Aula
)
from core.views import AulaViewSet


# Create your tests here.
class AulaTeste(TestCase):
    def setUp(self):
        igreja = Igreja.objects.create(nome='Igreja Teste')
        congregacao = Congregacao.objects.create(nome='Congregacao Teste', igreja=igreja)
        
        self.periodo1 = Periodo.objects.create(periodo='Periodo 1', ano='2025', igreja=igreja)
        self.periodo2 = Periodo.objects.create(periodo='Periodo 2', ano='2025', igreja=igreja)

        for i in range(1, 6):
            Aula.objects.create(periodo=self.periodo1, aula=f'Aula {i}', data_prevista='2025-01-01')

        for i in range(1, 5):
            Aula.objects.create(periodo=self.periodo2, aula=f'Aula {i}', data_prevista='2025-01-01')

        self.factory = APIRequestFactory()
        self.user = Usuario.objects.create(
            igreja=igreja,
            congregacao=congregacao,
            nome='Teste',
            email='teste@teste.com',
            role=Usuario.SUPERINTENDENTE
        )

    def test_list_aulas_by_periodo_uid_1(self):
        request = self.factory.get(f'/api/aulas?periodo_uid={self.periodo1.uid}')

        force_authenticate(request, user=self.user)

        response = AulaViewSet.as_view({ 'get': 'list' })(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['aulas']), 5)

    def test_list_aulas_by_periodo_uid_2(self):
        request = self.factory.get(f'/api/aulas?periodo_uid={self.periodo2.uid}')

        force_authenticate(request, user=self.user)

        response = AulaViewSet.as_view({ 'get': 'list' })(request)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['aulas']), 4)

    def test_list_aulas_without_periodo_uid(self):
        request = self.factory.get('/api/aulas')

        force_authenticate(request, user=self.user)

        response = AulaViewSet.as_view({ 'get': 'list' })(request)

        self.assertEqual(response.status_code, 400)

    def test_list_aulas_with_invalid_periodo_uid(self):
        request = self.factory.get(f'/api/aulas?periodo_uid={uuid4()}')

        force_authenticate(request, user=self.user)

        response = AulaViewSet.as_view({ 'get': 'list' })(request)

        self.assertEqual(response.status_code, 404)
