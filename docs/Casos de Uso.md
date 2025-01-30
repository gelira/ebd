## Casos de Uso

### CDU.001 - Matrícula de alunos

- _Atores_: Professor, Secretário, Superintendente

**Descrição**:

Para fazer matrícula de alunos, o ator deve estar acessando a classe específica na qual quer fazer a matrícula. O sistema mostra uma lista de todos os alunos cadastrados que ainda não tem matrícula ativa no trimestre atual, de modo que o ator pode pesquisar pelo nome. Caso o aluno ainda não tenha sido cadastrado no sistema, é possível cadastrá-lo, com seu nome completo e data de nascimento, de maneira que agora será possível encontrá-lo na lista. O ator seleciona todos os alunos que quer incluir na classe e salva as matrículas. O sistema vai registrar os vínculos daqueles alunos naquela classe no trimestre atual.

---

### CDU.002 - Registro de diário

- _Atores_: Professor, Secretário, Superintendente

**Descrição**:

O diário é o registro da frequência e das contribuições da classe em uma aula específica. Ao criar um novo diário, o ator verá a lista de todos os alunos vinculados àquela classe naquele momento do trimestre atual. O ator deve marcar a presença ou ausência de cada aluno dessa lista e informar a quantidade de visitantes, de Bíblias, de revistas e os valores de dízimos e ofertas arrecadados. Ao salvar o diário, o sistema vai contabilizar a quantidade de ausentes e a frequência total. Será possível alterar o diário até que a aula seja concluída.

---

### CDU.003 - Gerar relatório da aula

- _Atores_: Secretário, Superintendente

**Descrição**:

O relatório da aula combina os dados de todos os diários abertos para aquela aula. O relatório mostra os dados de cada diário de forma separada (nome da classe, frequência e contribuições arracadadas) e, no final, a soma de todos os diários.

---

### CDU.004 - Concluir aula

- _Atores_: Secretário, Superintendente

**Descrição**:

Após todas as classes terem tido a ministração da lição daquela aula, o ator deve marcar a aula como concluída. Quando uma aula está marcada como concluída no sistema, não será possível registrar novos diários para aquela aula.

---

### CDU.005 - Transferir aluno de classe

- _Atores_: Secretário, Superintendente

**Descrição**:

Caso o professor matricule na sua classe um aluno que na verdade pertença a outra classe, o secretário/superintendente pode tranferir o aluno para outra classe no trimestre vigente, de modo que o aluno terá matrícula alterada para ter vínculo com a classe correta.

---

### CDU.006 - Cadastro de professor

- _Atores_: Superintendente

**Descrição**:

O superintendente pode vincular ou desvincular um usuário como professor de uma classe.

---

### CDU.007 - Iniciar trimestre

- _Atores_: Superintendente

**Descrição**:

O superintendente pode iniciar o trimestre cadastrando-o com a informação do ano atual e nome do trimestre atual (ex.: 1o trimestre, 2o trimestre, etc). Nesse processo de iniciar o trimestre, o superintendente deve fazer o cadastro das aulas daquele trimestre com um nome (ex.: Aula 01, Aula 02, etc) e a data prevista para que aquela lição seja ministrada.

---

### CDU.008 - Concluir trimestre

- _Atores_: Superintendente

**Descrição**:

Após todas as aulas terem sido ministradas, o superintendente pode concluir o trimestre. Quando o trimestre estiver marcado como concluído, não será mais possível fazer nenhuma modificação de classe ou de diários.
