from uuid import uuid4
from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate

from core.models import (
    Igreja,
    Congregacao,
    Usuario,
    Periodo,
    Classe,
    Aluno,
    Aula,
    Matricula,
    Diario,
    Presenca
)
from core.views import DiarioViewSet

# Create your tests here.
class DiarioTeste(TestCase):
    def setUp(self):
        igreja = Igreja.objects.create(nome='Igreja Teste')
        congregacao = Congregacao.objects.create(nome='Congregacao Teste', igreja=igreja)
        periodo = Periodo.objects.create(periodo='Periodo 1', ano='2025', igreja=igreja)

        self.classe1 = Classe.objects.create(nome='Classe Teste 1', congregacao=congregacao)
        self.classe2 = Classe.objects.create(nome='Classe Teste 2', congregacao=congregacao)
        self.aula = Aula.objects.create(periodo=periodo, aula='Aula 1', data_prevista='2025-01-01')

        self.aluno1 = Aluno.objects.create(nome='Aluno 1', igreja=igreja)
        self.aluno2 = Aluno.objects.create(nome='Aluno 2', igreja=igreja)
        self.aluno3 = Aluno.objects.create(nome='Aluno 3', igreja=igreja)
        self.aluno4 = Aluno.objects.create(nome='Aluno 4', igreja=igreja)
        self.aluno5 = Aluno.objects.create(nome='Aluno 5', igreja=igreja)
        self.aluno6 = Aluno.objects.create(nome='Aluno 6', igreja=igreja)
        self.aluno7 = Aluno.objects.create(nome='Aluno 7', igreja=igreja)
        self.aluno8 = Aluno.objects.create(nome='Aluno 8', igreja=igreja)
        self.aluno9 = Aluno.objects.create(nome='Aluno 9', igreja=igreja)

        self.factory = APIRequestFactory()
        self.user = Usuario.objects.create(
            igreja=igreja,
            congregacao=congregacao,
            nome='Teste',
            email='teste@teste.com',
            role=Usuario.SUPERINTENDENTE
        )

        Matricula.objects.create(aluno=self.aluno1, classe=self.classe1, periodo=periodo)
        Matricula.objects.create(aluno=self.aluno2, classe=self.classe1, periodo=periodo)
        Matricula.objects.create(aluno=self.aluno3, classe=self.classe1, periodo=periodo)
        Matricula.objects.create(aluno=self.aluno4, classe=self.classe1, periodo=periodo)
        Matricula.objects.create(aluno=self.aluno5, classe=self.classe1, periodo=periodo)
        Matricula.objects.create(aluno=self.aluno6, classe=self.classe2, periodo=periodo)
        Matricula.objects.create(aluno=self.aluno7, classe=self.classe2, periodo=periodo)
        Matricula.objects.create(aluno=self.aluno8, classe=self.classe2, periodo=periodo)
        Matricula.objects.create(aluno=self.aluno9, classe=self.classe2, periodo=periodo)

    def test_create_diario_for_same_aula_and_classe_twice(self):
        Diario.objects.create(
            aula=self.aula,
            classe=self.classe1,
            data_aula='2025-01-01',
            quantidade_presentes=0,
            quantidade_ausentes=0,
            quantidade_visitantes=0,
            quantidade_biblias=0,
            quantidade_revistas=0,
            ofertas=0,
            dizimos=0
        )

        request = self.factory.post(
            '/api/diarios',
            {
                'aula_uid': self.aula.uid,
                'classe_uid': self.classe1.uid,
                'data_aula': '2025-01-01',
                'quantidade_visitantes': 0,
                'quantidade_biblias': 0,
                'quantidade_revistas': 0,
                'ofertas': 0,
                'dizimos': 0,
                'presencas': []
            },
            format='json'
        )

        force_authenticate(request, user=self.user)

        response = DiarioViewSet.as_view({ 'post': 'create' })(request)

        self.assertEquals(response.status_code, 400)

    def test_create_diario_with_less_presences_than_matriculated_students(self):
        request = self.factory.post(
            '/api/diarios',
            {
                'aula_uid': self.aula.uid,
                'classe_uid': self.classe1.uid,
                'data_aula': '2025-01-01',
                'quantidade_visitantes': 0,
                'quantidade_biblias': 0,
                'quantidade_revistas': 0,
                'ofertas': 0,
                'dizimos': 0,
                'presencas': [
                    { 'aluno_uid': self.aluno1.uid, 'presenca': Presenca.PRESENTE },
                    { 'aluno_uid': self.aluno2.uid, 'presenca': Presenca.PRESENTE },
                    { 'aluno_uid': self.aluno3.uid, 'presenca': Presenca.PRESENTE },
                    { 'aluno_uid': self.aluno4.uid, 'presenca': Presenca.PRESENTE },
                ]
            },
            format='json'
        )

        force_authenticate(request, user=self.user)

        response = DiarioViewSet.as_view({ 'post': 'create' })(request)

        self.assertEquals(response.status_code, 400)

    def test_create_diario_and_check_created_diario(self):
        request1 = self.factory.post(
            '/api/diarios',
            {
                'aula_uid': self.aula.uid,
                'classe_uid': self.classe1.uid,
                'data_aula': '2025-01-01',
                'quantidade_visitantes': 4,
                'quantidade_biblias': 0,
                'quantidade_revistas': 0,
                'ofertas': 0,
                'dizimos': 0,
                'presencas': [
                    { 'aluno_uid': self.aluno1.uid, 'presenca': Presenca.PRESENTE },
                    { 'aluno_uid': self.aluno2.uid, 'presenca': Presenca.PRESENTE },
                    { 'aluno_uid': self.aluno3.uid, 'presenca': Presenca.PRESENTE },
                    { 'aluno_uid': self.aluno4.uid, 'presenca': Presenca.PRESENTE },
                    { 'aluno_uid': self.aluno5.uid, 'presenca': Presenca.FALTA },
                ]
            },
            format='json'
        )

        force_authenticate(request1, user=self.user)

        response1 = DiarioViewSet.as_view({ 'post': 'create' })(request1)

        self.assertEquals(response1.status_code, 204)

        request2 = self.factory.get(
            f'/api/diarios?aula_uid={self.aula.uid}&classe_uid={self.classe1.uid}'
        )

        force_authenticate(request2, user=self.user)

        response2 = DiarioViewSet.as_view({ 'get': 'list' })(request2)

        self.assertEquals(response2.status_code, 200)
        self.assertEquals(len(response2.data['diarios']), 1)

        diario = response2.data['diarios'][0]

        self.assertEquals(diario['aula']['uid'], str(self.aula.uid))
        self.assertEquals(diario['classe']['uid'], str(self.classe1.uid))
        self.assertEquals(len(diario['presencas']), 5)
        self.assertEquals(diario['quantidade_presentes'], 4)
        self.assertEquals(diario['quantidade_ausentes'], 1)

    def test_create_diarios_for_both_classes_and_list_them(self):
        request1 = self.factory.post(
            '/api/diarios',
            {
                'aula_uid': self.aula.uid,
                'classe_uid': self.classe1.uid,
                'data_aula': '2025-01-01',
                'quantidade_visitantes': 0,
                'quantidade_biblias': 0,
                'quantidade_revistas': 0,
                'ofertas': 0,
                'dizimos': 0,
                'presencas': [
                    { 'aluno_uid': self.aluno1.uid, 'presenca': Presenca.PRESENTE },
                    { 'aluno_uid': self.aluno2.uid, 'presenca': Presenca.PRESENTE },
                    { 'aluno_uid': self.aluno3.uid, 'presenca': Presenca.PRESENTE },
                    { 'aluno_uid': self.aluno4.uid, 'presenca': Presenca.PRESENTE },
                    { 'aluno_uid': self.aluno5.uid, 'presenca': Presenca.FALTA },
                ]
            },
            format='json'
        )

        force_authenticate(request1, user=self.user)

        response1 = DiarioViewSet.as_view({ 'post': 'create' })(request1)

        self.assertEquals(response1.status_code, 204)

        request2 = self.factory.post(
            '/api/diarios',
            {
                'aula_uid': self.aula.uid,
                'classe_uid': self.classe2.uid,
                'data_aula': '2025-01-01',
                'quantidade_visitantes': 0,
                'quantidade_biblias': 0,
                'quantidade_revistas': 0,
                'ofertas': 0,
                'dizimos': 0,
                'presencas': [
                    { 'aluno_uid': self.aluno6.uid, 'presenca': Presenca.PRESENTE },
                    { 'aluno_uid': self.aluno7.uid, 'presenca': Presenca.PRESENTE },
                    { 'aluno_uid': self.aluno8.uid, 'presenca': Presenca.PRESENTE },
                    { 'aluno_uid': self.aluno9.uid, 'presenca': Presenca.PRESENTE },
                ]
            },
            format='json'
        )

        force_authenticate(request2, user=self.user)

        response2 = DiarioViewSet.as_view({ 'post': 'create' })(request2)

        self.assertEquals(response2.status_code, 204)

        request3 = self.factory.get(
            f'/api/diarios?aula_uid={self.aula.uid}'
        )

        force_authenticate(request3, user=self.user)

        response3 = DiarioViewSet.as_view({ 'get': 'list' })(request3)

        self.assertEquals(response3.status_code, 200)
        self.assertEquals(len(response3.data['diarios']), 2)
