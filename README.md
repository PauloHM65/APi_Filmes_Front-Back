> ### Sobre este Projeto Interativo
> 
> Este repositório contém uma aplicação web completa para busca e avaliação de filmes, com um dashboard de estatísticas pessoais. O projeto foi desenvolvido de forma interativa e está pronto para ser executado, testado e modificado diretamente através de comandos.
> 
> *   **Tecnologias:** Angular (Frontend), Node.js/Express (Backend), Nginx e Docker Compose (Conteinerização).
> *   **Como Interagir:** Você pode me dar instruções para continuar a desenvolver o projeto. Peça para `executar` testes, `editar` arquivos, `listar` o conteúdo de um diretório, ou qualquer outra tarefa de desenvolvimento.

---

# Proj_Filmes - Desafio Full Stack

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

Existem duas maneiras de executar o projeto: via **Docker Compose** (recomendado para facilidade de execução) ou **localmente** (ideal para desenvolvimento).

**Pré-requisitos:**
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (já inclui o Docker Compose)
*   Uma chave de API da OMDb. Obtenha uma gratuitamente em [omdbapi.com/apikey.aspx](https://omdbapi.com/apikey.aspx).

### Opção 1: Executando com Docker Compose (Imagens do Docker Hub)

Esta abordagem é a mais simples e recomendada. Ela conteineriza o frontend e o backend, subindo toda a aplicação com um único comando, utilizando imagens pré-construídas do Docker Hub.

**Passos:**

1.  **Prepare o Ambiente:**
    *   Crie uma pasta dedicada para a aplicação no seu computador (ex: `meus-filmes`).
    *   Faça o download do arquivo [`docker-compose.yml`](https://github.com/PauloHM65/site_filmes/blob/main/docker-compose.yml) (<- link) deste repositório e salve-o dentro da pasta que você criou.

2.  **Configure as Variáveis de Ambiente:**
    *   Na mesma pasta, crie um arquivo de texto chamado `.env`.
    *   Adicione a seguinte linha, substituindo `SUA_CHAVE_AQUI` pela sua chave da OMDb API:
        ```
        OMDB_API_KEY=SUA_CHAVE_AQUI
        ```
    *   O `docker-compose.yml` está configurado para ler este arquivo e injetar a variável de ambiente no contêiner do backend.

3.  **Suba os contêineres:**
    *   Abra seu terminal, navegue até a pasta que você criou e execute o seguinte comando:
    ```bash
    docker-compose up -d
    ```
    *   O Docker Compose irá baixar as imagens do Docker Hub (se não existirem localmente) e iniciar os serviços. O arquivo `db.json` será automaticamente criado na pasta `backend/data` se não existir.

4.  **Acesse a aplicação:**
    *   Abra seu navegador e acesse **`http://localhost:4200`**.

Para parar a aplicação, execute:
```bash
docker-compose down
```

---

### Opção 2: Executando Localmente (Frontend e Backend separados)

Esta abordagem é ideal para desenvolvimento, pois permite o hot-reload do frontend e um controle mais granular sobre cada parte da aplicação.

**Pré-requisitos:**
*   [Node.js](https://nodejs.org/) (versão 20 ou superior)
*   [Angular CLI](https://angular.io/cli)
*   Uma chave de API da OMDb (siga os passos da Opção 1 para obtê-la).

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

## Estrutura do Projeto e Decisões

*   **Separação Frontend/Backend:** O projeto foi dividido em duas pastas, `src` (frontend Angular) e `backend` (API Express), para manter uma separação clara de responsabilidades.
*   **Persistência de Dados:** Optei por usar um arquivo JSON (`db.json`) para persistir os dados de favoritos, avaliações e histórico. Esta abordagem foi escolhida pela simplicidade e para evitar a necessidade de configurar um banco de dados externo, facilitando a avaliação e execução do projeto.
*   **Componentização:** A interface do Angular foi construída de forma componentizada, com páginas, componentes de layout e serviços bem definidos para organizar o código e promover o reuso.
*   **Segurança da API Key:** A chave da OMDb API é mantida exclusivamente no backend. O frontend se comunica com a API do backend, que atua como um proxy, garantindo que a chave não seja exposta no navegador.

---


### Ferramentas/aceleradores de desenvolvimento:
O processo de desenvolvimento foi significativamente acelerado e assistido por:
*   **Gemini (Modelo de IA do Google):** Utilizado para entender requisitos, gerar trechwos de código, depurar, refatorar e explicar conceitos complexos.
*   **Angular CLI:** Para estruturar o projeto Angular, gerar componentes, serviços e gerenciar o processo de build.
*   **Node.js/npm:** Para gerenciar dependências do backend e executar o servidor Express.
*   **Visual Studio Code:** Como IDE principal, aproveitando suas extensões para desenvolvimento TypeScript, Angular e Node.js.