from uuid import uuid4
from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate

from core.models import (
    Igreja,
    Congregacao,
    Usuario,
    Periodo,
    Classe,
    Aluno
)
from core.views import MatriculaViewSet


# Create your tests here.
class MatriculaTeste(TestCase):
    def setUp(self):
        igreja = Igreja.objects.create(nome='Igreja Teste')
        congregacao = Congregacao.objects.create(nome='Congregacao Teste', igreja=igreja)
        
        self.periodo = Periodo.objects.create(periodo='Periodo 1', ano='2025', igreja=igreja)
        self.classe1 = Classe.objects.create(nome='Classe Teste 1', congregacao=congregacao)
        self.classe2 = Classe.objects.create(nome='Classe Teste 2', congregacao=congregacao)

        self.aluno1 = Aluno.objects.create(nome='Aluno 1', igreja=igreja)
        self.aluno2 = Aluno.objects.create(nome='Aluno 2', igreja=igreja)
        self.aluno3 = Aluno.objects.create(nome='Aluno 3', igreja=igreja)
        self.aluno4 = Aluno.objects.create(nome='Aluno 4', igreja=igreja)
        self.aluno5 = Aluno.objects.create(nome='Aluno 5', igreja=igreja)

        self.factory = APIRequestFactory()
        self.user = Usuario.objects.create(
            igreja=igreja,
            congregacao=congregacao,
            nome='Teste',
            email='teste@teste.com',
            role=Usuario.SUPERINTENDENTE
        )

    def test_create_matricula_with_invalid_aluno_uid(self):
        request = self.factory.post(
            '/api/matriculas',
            {
                'aluno_uid': uuid4(),
                'classe_uid': self.classe1.uid,
                'periodo_uid': self.periodo.uid
            },
            format='json'
        )

        force_authenticate(request, user=self.user)

        response = MatriculaViewSet.as_view({ 'post': 'create' })(request)

        self.assertEquals(response.status_code, 400)

    def test_create_matricula_with_invalid_classe_uid(self):
        request = self.factory.post(
            '/api/matriculas',
            {
                'aluno_uid': self.aluno1.uid,
                'classe_uid': uuid4(),
                'periodo_uid': self.periodo.uid
            },
            format='json'
        )

        force_authenticate(request, user=self.user)

        response = MatriculaViewSet.as_view({ 'post': 'create' })(request)

        self.assertEquals(response.status_code, 400)

    def test_create_matricula_with_invalid_periodo_uid(self):
        request = self.factory.post(
            '/api/matriculas',
            {
                'aluno_uid': self.aluno1.uid,
                'classe_uid': self.classe1.uid,
                'periodo_uid': uuid4()
            },
            format='json'
        )

        force_authenticate(request, user=self.user)

        response = MatriculaViewSet.as_view({ 'post': 'create' })(request)

        self.assertEquals(response.status_code, 400)

    def test_create_matricula_for_aluno_already_matriculated_in_period(self):
        request1 = self.factory.post(
            '/api/matriculas',
            {
                'aluno_uid': self.aluno1.uid,
                'classe_uid': self.classe1.uid,
                'periodo_uid': self.periodo.uid
            },
            format='json'
        )

        force_authenticate(request1, user=self.user)

        response1 = MatriculaViewSet.as_view({ 'post': 'create' })(request1)

        self.assertEquals(response1.status_code, 204)

        request2 = self.factory.post(
            '/api/matriculas',
            {
                'aluno_uid': self.aluno1.uid,
                'classe_uid': self.classe1.uid,
                'periodo_uid': self.periodo.uid
            },
            format='json'
        )

        force_authenticate(request2, user=self.user)

        response2 = MatriculaViewSet.as_view({ 'post': 'create' })(request2)

        self.assertEquals(response2.status_code, 400)

        request3 = self.factory.post(
            '/api/matriculas',
            {
                'aluno_uid': self.aluno1.uid,
                'classe_uid': self.classe2.uid,
                'periodo_uid': self.periodo.uid
            },
            format='json'
        )

        force_authenticate(request3, user=self.user)

        response3 = MatriculaViewSet.as_view({ 'post': 'create' })(request3)

        self.assertEquals(response3.status_code, 400)

    def test_create_2_matriculas_to_same_classe_and_list_them(self):
        request1 = self.factory.post(
            '/api/matriculas',
            {
                'aluno_uid': self.aluno1.uid,
                'classe_uid': self.classe1.uid,
                'periodo_uid': self.periodo.uid
            },
            format='json'
        )

        force_authenticate(request1, user=self.user)

        response1 = MatriculaViewSet.as_view({ 'post': 'create' })(request1)

        self.assertEquals(response1.status_code, 204)

        request2 = self.factory.post(
            '/api/matriculas',
            {
                'aluno_uid': self.aluno2.uid,
                'classe_uid': self.classe1.uid,
                'periodo_uid': self.periodo.uid
            },
            format='json'
        )

        force_authenticate(request2, user=self.user)

        response2 = MatriculaViewSet.as_view({ 'post': 'create' })(request2)

        self.assertEquals(response2.status_code, 204)

        request3 = self.factory.get(
            f'/api/matriculas?classe_uid={self.classe1.uid}&periodo_uid={self.periodo.uid}'
        )

        force_authenticate(request3, user=self.user)

        response3 = MatriculaViewSet.as_view({ 'get': 'list' })(request3)

        self.assertEquals(response3.status_code, 200)
        self.assertEquals(len(response3.data['matriculas']), 2)

    def test_list_matriculas_with_invalid_classe_uid(self):
        request = self.factory.get(
            f'/api/matriculas?classe_uid={uuid4()}&periodo_uid={self.periodo.uid}'
        )

        force_authenticate(request, user=self.user)

        response = MatriculaViewSet.as_view({ 'get': 'list' })(request)

        self.assertEquals(response.status_code, 404)

    def test_list_matriculas_with_invalid_periodo_uid(self):
        request = self.factory.get(
            f'/api/matriculas?classe_uid={self.classe1.uid}&periodo_uid={uuid4()}'
        )

        force_authenticate(request, user=self.user)

        response = MatriculaViewSet.as_view({ 'get': 'list' })(request)

        self.assertEquals(response.status_code, 404)
