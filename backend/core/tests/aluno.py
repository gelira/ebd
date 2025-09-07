from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate

from core.models import (
    Igreja,
    Congregacao,
    Classe,
    Usuario,
    Periodo,
    Aluno,
    Matricula,
)
from core.views import AlunoViewSet

# Create your tests here.
class AlunoTeste(TestCase):
    def setUp(self):
        igreja1 = Igreja.objects.create(nome='Igreja Teste 1')
        igreja2 = Igreja.objects.create(nome='Igreja Teste 2')
        congregacao = Congregacao.objects.create(nome='Congregacao Teste', igreja=igreja1)
        classe = Classe.objects.create(nome='Classe Teste', congregacao=congregacao)
        
        self.periodo = Periodo.objects.create(periodo='Periodo Teste', ano='2025', igreja=igreja1)

        Aluno.objects.create(nome='Ana Lucia', igreja=igreja1)
        Aluno.objects.create(nome='Ananias', igreja=igreja1)
        Aluno.objects.create(nome='Mariana', igreja=igreja1)
        Aluno.objects.create(nome='João', igreja=igreja2)

        aluno = Aluno.objects.create(nome='Ana Clara', igreja=igreja1)

        Matricula.objects.create(aluno=aluno, classe=classe, periodo=self.periodo)

        self.factory = APIRequestFactory()
        self.user = Usuario.objects.create(
            igreja=igreja1,
            congregacao=congregacao,
            nome='Teste',
            email='teste@teste.com',
            role=Usuario.SUPERINTENDENTE
        )

    def test_list_all_alunos(self):
        request = self.factory.get('/api/alunos')

        force_authenticate(request, user=self.user)

        response = AlunoViewSet.as_view({ 'get': 'list' })(request)

        self.assertEquals(response.status_code, 200)
        self.assertEquals(len(response.data['alunos']), 4)

    def test_list_alunos_filtered_by_name(self):
        request = self.factory.get('/api/alunos?nome=ari')

        force_authenticate(request, user=self.user)

        response = AlunoViewSet.as_view({ 'get': 'list' })(request)

        self.assertEquals(response.status_code, 200)
        self.assertEquals(len(response.data['alunos']), 1)

    def test_list_nao_matriculados_sem_periodo_uid(self):
        request = self.factory.get('/api/alunos/nao_matriculados')

        force_authenticate(request, user=self.user)

        response = AlunoViewSet.as_view({ 'get': 'nao_matriculados' })(request)

        self.assertEquals(response.status_code, 400)

    def test_list_nao_matriculados_com_periodo_uid(self):
        request = self.factory.get(f'/api/alunos/nao_matriculados?periodo_uid={self.periodo.uid}')

        force_authenticate(request, user=self.user)

        response = AlunoViewSet.as_view({ 'get': 'nao_matriculados' })(request)

        self.assertEquals(response.status_code, 200)
        self.assertEquals(len(response.data['alunos']), 3)

