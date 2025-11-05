# AppFilmes DTI - Desafio Full Stack

Esta é uma aplicação web full stack que permite aos usuários buscar filmes, favoritar, criar avaliações e visualizar estatísticas sobre seus hábitos cinematográficos.

## Tecnologias Utilizadas

*   **Frontend:** Angular 19, TypeScript, Bootstrap, ngx-charts
*   **Backend:** Node.js, Express.js
*   **Persistência de Dados:** Arquivo JSON local (`backend/data/db.json`)

## Funcionalidades

*   **Busca de Filmes:** Pesquise filmes em tempo real utilizando a OMDb API.
*   **Detalhes do Filme:** Veja informações detalhadas, como enredo, diretor, elenco e nota do IMDb.
*   **Favoritos:** Adicione ou remova filmes da sua lista de favoritos.
*   **Avaliações:** Crie e exclua avaliações (nota + comentário) para qualquer filme.
*   **Dashboard Pessoal:** Analise seus dados com estatísticas e gráficos, incluindo:
    *   Total de filmes buscados.
    *   Gênero mais pesquisado (com base nos favoritos).
    *   Década preferida (com base nos favoritos).
    *   Nota média das suas avaliações.
    *   Gráficos de distribuição de gêneros e anos de lançamento.

---

## Como Executar a Aplicação

Existem duas maneiras de executar o projeto: **localmente** (ideal para desenvolvimento) ou via **Docker Compose** (ideal para simular um ambiente de produção e para facilidade de execução).

### Opção 1: Executando Localmente (Frontend e Backend separados)

Esta abordagem permite o hot-reload do frontend e um controle mais granular sobre cada parte da aplicação.

**Pré-requisitos:**
*   [Node.js](https://nodejs.org/) (versão 20 ou superior)
*   [Angular CLI](https://angular.io/cli)
*   Uma chave de API da OMDb. Obtenha uma gratuitamente em [omdbapi.com/apikey.aspx](https://omdbapi.com/apikey.aspx).

**Passos:**

1.  **Clone o repositório e instale as dependências:**
    ```bash
    # Clone este repositório
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DA_PASTA>

    # Instale as dependências do frontend
    npm install

    # Instale as dependências do backend
    npm install --prefix backend
    ```

2.  **Configure as variáveis de ambiente:**
    *   Crie um arquivo chamado `.env` na raiz do projeto.
    *   Adicione a seguinte linha, substituindo `SUA_CHAVE_AQUI` pela sua chave da OMDb API:
        ```
        OMDB_API_KEY=SUA_CHAVE_AQUI
        ```

3.  **Execute o Backend (API):**
    *   Em um terminal, execute o comando a partir da raiz do projeto:
    ```bash
    npm start --prefix backend
    ```
    *   O servidor backend estará rodando em `http://localhost:3000`.

4.  **Execute o Frontend (Angular):**
    *   **Em outro terminal**, execute o comando a partir da raiz do projeto:
    ```bash
    ng serve
    ```
    *   Abra seu navegador e acesse **`http://localhost:4200`**.

---

### Opção 2: Executando com Docker Compose (Recomendado para Simplicidade)

Esta abordagem conteineriza o frontend e o backend, subindo toda a aplicação com um único comando.

**Pré-requisitos:**
*   [Docker](https://www.docker.com/products/docker-desktop/)
*   [Docker Compose](https://docs.docker.com/compose/install/)
*   Uma chave de API da OMDb (siga os passos da Opção 1 para obtê-la).

**Passos:**

1.  **Clone o repositório.**

2.  **Configure as variáveis de ambiente:**
    *   Crie um arquivo chamado `.env` na raiz do projeto.
    *   Adicione a seguinte linha, substituindo `SUA_CHAVE_AQUI` pela sua chave da OMDb API:
        ```
        OMDB_API_KEY=SUA_CHAVE_AQUI
        ```
    *   O `docker-compose.yml` está configurado para ler este arquivo e injetar a variável de ambiente no contêiner do backend.

3.  **Construa e suba os contêineres:**
    *   Execute o seguinte comando na raiz do projeto:
    ```bash
    docker-compose up --build -d
    ```
    *   O comando `--build` força a reconstrução das imagens, e `-d` executa os contêineres em segundo plano.

4.  **Acesse a aplicação:**
    *   Abra seu navegador e acesse **`http://localhost:4200`**.

Para parar a aplicação, execute:
```bash
docker-compose down
```

---

## Estrutura do Projeto e Decisões

*   **Separação Frontend/Backend:** O projeto foi dividido em duas pastas, `src` (frontend Angular) e `backend` (API Express), para manter uma separação clara de responsabilidades.
*   **Persistência de Dados:** Optei por usar um arquivo JSON (`db.json`) para persistir os dados de favoritos, avaliações e histórico. Esta abordagem foi escolhida pela simplicidade e para evitar a necessidade de configurar um banco de dados externo, facilitando a avaliação e execução do projeto.
*   **Componentização:** A interface do Angular foi construída de forma componentizada, com páginas, componentes de layout e serviços bem definidos para organizar o código e promover o reuso.
*   **Segurança da API Key:** A chave da OMDb API é mantida exclusivamente no backend. O frontend se comunica com a API do backend, que atua como um proxy, garantindo que a chave não seja exposta no navegador.

---

## Perguntas e Respostas

### Qual foi o maior desafio técnico?
O maior desafio técnico foi integrar a funcionalidade de busca da OMDb API com o requisito de exibir filmes quando o input de busca está vazio. Como a API da OMDb exige um termo de busca, a solução foi implementar um termo de busca padrão ("Matrix") quando o input está vazio, garantindo uma experiência de usuário consistente sem alterar o comportamento central da API. Outro desafio foi garantir que a interface `Movie` mapeasse corretamente todos os campos da resposta da OMDb API para exibir detalhes abrangentes do filme, o que exigiu sincronização cuidadosa entre a interface do frontend e o comportamento de proxy do backend.

### Como você organizou e estruturou os dados coletados?
Os dados coletados são estruturados e organizados da seguinte forma:
*   **Frontend (Angular):** Os dados são gerenciados principalmente usando RxJS Observables para operações assíncronas. Interfaces (ex: `Movie`, `Review`, `Stats`) são usadas para tipar fortemente os dados, garantindo consistência e melhorando a experiência do desenvolvedor.
*   **Backend (Node.js/Express):** Dados relacionados às interações do usuário (favoritos, avaliações, histórico de busca) são persistidos em um arquivo JSON local (`backend/data/db.json`). Este arquivo atua como um banco de dados simples, armazenando arrays de `favorites`, `reviews` e entradas de `history`. Cada entrada de `history` agora inclui os anos dos filmes encontrados naquela busca (`movieYears`), permitindo análises mais ricas.
*   **Dados da OMDb API:** Os dados da OMDb API são buscados pelo backend, que atua como um proxy. Esses dados são então transformados (ex: extraindo anos de filmes para o histórico de busca) e passados para o frontend.

### Que insights interessantes o dashboard poderia oferecer?
O dashboard oferece vários insights interessantes sobre as preferências e hábitos de busca do usuário:
*   **Popularidade de Gêneros:** O gráfico de distribuição de gêneros (baseado em filmes favoritos) pode revelar quais tipos de filmes o usuário mais gosta.
*   **Tendências de Anos/Décadas:** A "Linha do Tempo dos Filmes Buscados" e a "Década Favorita" podem mostrar se o usuário tem preferência por filmes de certas épocas.
*   **Engajamento:** O total de buscas e a nota média das avaliações indicam o nível de atividade e a satisfação geral do usuário com os filmes que assiste/busca.
*   **Padrões de Busca:** Ao longo do tempo, o histórico de buscas pode revelar padrões de interesse em determinados atores, diretores ou temas.

### O que faria diferente com mais tempo?
Com mais tempo, implementaria as seguintes melhorias:
*   **Gerenciamento Robusto de Usuários:** Embora a configuração atual seja para uso individual, adicionar um sistema simples de autenticação de usuários permitiria que múltiplos usuários tivessem seus próprios favoritos, avaliações e dashboards.
*   **Persistência Aprimorada:** Migrar de um arquivo JSON simples para uma solução de banco de dados mais robusta (ex: MongoDB, PostgreSQL) para melhor escalabilidade, capacidade de consulta e integridade dos dados.
*   **Conteinerização:** Configurar o projeto em contêineres Docker para facilitar a implantação e o ambiente de desenvolvimento. Isso permitiria que o aplicativo fosse executado de forma consistente em diferentes máquinas, garantindo portabilidade, isolamento e facilidade na configuração do ambiente.
*   **Análises Avançadas:** Implementar análises de dados mais sofisticadas no backend, como análise de sentimento em avaliações, correlação entre gêneros e classificações, ou recomendações preditivas.
*   **UI/UX Aprimorada:** Refinar a interface do usuário com mais animações, melhores mensagens de tratamento de erros e, potencialmente, uma experiência de busca mais interativa (ex: sugestões de autocompletar).
*   **Testes:** Implementar testes unitários e de integração abrangentes para frontend e backend para garantir confiabilidade e manutenibilidade.
*   **Paginação/Scroll Infinito:** Para resultados de busca e favoritos, implementar paginação ou scroll infinito para melhorar o desempenho e a experiência do usuário com grandes conjuntos de dados.

### Quais ferramentas/aceleradores de desenvolvimento utilizou?
O processo de desenvolvimento foi significativamente acelerado e assistido por:
*   **Gemini (Modelo de IA do Google):** Utilizado para entender requisitos, gerar trechwos de código, depurar, refatorar e explicar conceitos complexos.
*   **Angular CLI:** Para estruturar o projeto Angular, gerar componentes, serviços e gerenciar o processo de build.
*   **Node.js/npm:** Para gerenciar dependências do backend e executar o servidor Express.
*   **Visual Studio Code:** Como IDE principal, aproveitando suas extensões para desenvolvimento TypeScript, Angular e Node.js.