# Vôlei API

## Descrição do Projeto

O "Vôlei API" é o backend da plataforma, **construído com Ruby e Sinatra**, utilizando o **ActiveRecord** para persistência com o **PostgreSQL**. A API gerencia jogadores, partidas e um sistema de avaliação completo, servindo como base para uma aplicação web ou mobile. Segue os princípios de **Clean Architecture e Domain-Driven Design (DDD)**. Desenvolvido para a disciplina de Programação para Web II do curso de ADS.

## Sumário

* [Requisitos Funcionais](#requisitos-funcionais)
* [Estrutura do Projeto (Clean/DDD)](#estrutura-do-projeto-cleanddd)
* [Endpoints da API e Modelos de Dados](#endpoints-da-api-e-modelos-de-dados)
    * [Jogadores](#jogadores)
    * [Partidas](#partidas)
    * [Pedidos de Adesão](#pedidos-de-adesão)
    * [Avaliações](#avaliações)
* [Instalação e Teste](#instalação-e-teste)

## Requisitos Funcionais

A API foi projetada para atender aos seguintes requisitos:

#### Gerenciamento de Jogadores

- **Registro de Jogadores:** Permite que jogadores se registrem com informações básicas (sexo, categoria).

- **Visualização e Atualização de Perfil:** Jogadores podem visualizar e atualizar seus dados.

#### Gerenciamento de Partidas

- **Criação de Partidas:** Jogadores podem criar partidas, definindo local, data e categoria.

- **Adesão e Status:** Jogadores podem solicitar adesão a partidas, e organizadores podem aceitar ou rejeitar os pedidos.

- **Pagamento e Desistência:** Gerencia o status de pagamento e a desistência de jogadores.

#### Sistema de Avaliação e Ranking

- **Avaliações:** Jogadores podem avaliar outros jogadores e organizadores após as partidas.

- **Ranking:** Um sistema de ranking é gerado com base na pontuação média das avaliações.

## Estrutura do Projeto (Clean/DDD)

A API segue o padrão Modular do Sinatra e a Arquitetura Limpa (Clean Architecture / DDD), separando as responsabilidades em camadas: Apresentação (Controllers), Aplicação (Services) e Domínio (Models).

```text
volei-api/
├── config/                  # Configuração da Aplicação
│   └── database.yml         # Configuração da conexão com o PostgreSQL.
├── db/                      # Gerenciamento do Banco de Dados
│   └── migrate/             # Arquivos de Migração (criação e alteração de tabelas).
├── app/                     # Lógica da Aplicação (Camadas)
│   ├── models/              # Camada de DOMÍNIO (Entidades)
│   │   ├── player.rb        # Entidade Player (com regras de negócio e validações).
│   │   ├── match.rb         # Entidade Match.
│   │   ├── match_request.rb # Entidade MatchRequest.
│   │   └── rating.rb        # Entidade Rating.
│   ├── services/            # Camada de APLICAÇÃO (Regras de Negócio/Casos de Uso - DDD)
│   │   └── *.rb             # Lógica complexa (e.g., MatchCreationService, PlayerRankingService).
│   └── controllers/         # Camada de APRESENTAÇÃO (Interface/Sinatra Endpoints)
│       └── *_controller.rb  # Define as rotas HTTP e chama os Services (e.g., PlayerController).
├── .env                     # Variáveis de ambiente (credenciais do DB) - IGNORADO pelo Git.
├── Gemfile                  # Lista de dependências (gems: sinatra, activerecord, pg, dotenv).
├── Rakefile                 # Tarefas do Rake (gerenciamento de migrations do ActiveRecord).
└── app.rb                   # Ponto de entrada da aplicação (configura o DB e monta os Controllers).
```

## Endpoints da API e Modelos de Dados

A API segue os princípios de arquitetura RESTful. Abaixo estão os endpoints principais e os modelos de dados.

### Jogadores

#### Criar Jogador

- Método: ``POST``
- URL: ``/players``
- Request Body:

    ```json
    {
      "name": "string",
      "email": "string",
      "gender": "string",
      "category": "string"
    }
    ```

- Response Body (Success 201 Created):

    ```json
    {
      "id": 1,
      "name": "string",
      "email": "string",
      "gender": "string",
      "category": "string"
    }
    ```

#### Buscar Jogador

- Método: ``GET``
- URL: ``/players/{id}``
- Response Body (Success 200 OK):

    ```json
    {
      "id": 1,
      "name": "string",
      "email": "string",
      "gender": "string",
      "category": "string"
    }
    ```

#### Atualizar Jogador

- Método: ``PATCH``
- URL: ``/players/{id}``
- Request Body:

    ```json
    {
      "category": "string"
    }
    ```

- Response Body (Success 200 OK):

    ```json
    {
      "id": 1,
      "name": "string",
      "email": "string",
      "gender": "string",
      "category": "string"
    }
    ```

#### Ranking de Jogadores

- Método: ``GET``
- URL: ``/players/ranking``
- Response Body (Success 200 OK):

    ```json
    [
      {
        "id": 1,
        "name": "string",
        "email": "string",
        "average_score": "float"
      }
    ]
    ```

### Partidas

#### Criar Partida

- Método: ``POST``
- URL: ``/matches``
- Request Body:

    ```json
    {
      "title": "string",
      "location": "string",
      "date": "datetime",
      "category": "string",
      "status": "string",
      "organizer_id": "integer"
    }
    ```

- Response Body (Success 201 Created):

    ```json
    {
      "id": 1,
      "title": "string",
      "location": "string",
      "date": "datetime",
      "category": "string",
      "status": "string",
      "organizer_id": "integer"
    }
    ```

#### Listar Partidas

- Método: ``GET``
- URL: ``/matches``
- Response Body (Success 200 OK):

    ```json
    [
      {
        "id": 1,
        "title": "string",
        "location": "string",
        "date": "datetime",
        "category": "string",
        "status": "string",
        "organizer_id": "integer"
      }
    ]
    ```

### Pedidos de Adesão

#### Solicitar Adesão

- Método: ``POST``
- URL: ``/match_requests``
- Request Body:

    ```json
    {
      "player_id": "integer",
      "match_id": "integer"
    }
    ```

- Response Body (Success 201 Created):

    ```json
    {
      "id": 1,
      "player_id": "integer",
      "match_id": "integer",
      "status": "pending"
    }
    ```

#### Aceitar Adesão

- Método: ``PATCH``
- URL: ``/match_requests/{id}/accept``
- Response Body (Success 200 OK):

    ```json
    {
      "id": 1,
      "player_id": "integer",
      "match_id": "integer",
      "status": "accepted"
    }
    ```

#### Rejeitar Adesão

- Método: ``PATCH``
- URL: ``/match_requests/{id}/reject``
- Response Body (Success 200 OK):

    ```json
    {
      "id": 1,
      "player_id": "integer",
      "match_id": "integer",
      "status": "rejected"
    }
    ```

#### Marcar Pagamento

- Método: ``PATCH``
- URL: ``/match_requests/{id}/pay``
- Response Body (Success 200 OK):

    ```json
    {
      "id": 1,
      "player_id": "integer",
      "match_id": "integer",
      "status": "pending",
      "payment_status": "paid"
    }
    ```

#### Desistir de Partida

- Método: ``PATCH``
- URL: ``/match_requests/{id}/withdraw``
- Response Body (Success 200 OK):

    ```json
    {
      "id": 1,
      "player_id": "integer",
      "match_id": "integer",
      "status": "withdrawn"
    }
    ```

### Avaliações

#### Criar Avaliação

- Método: ``POST``
- URL: ``/ratings``
- Request Body:

    ```json
    {
      "rater_id": "integer",
      "rated_id": "integer",
      "match_id": "integer",
      "score": "integer"
    }
    ```

- Response Body (Success 201 Created):

    ```json
    {
      "id": 1,
      "rater_id": "integer",
      "rated_id": "integer",
      "match_id": "integer",
      "score": "integer"
    }
    ```

**Para uma documentação completa e interativa, consulte a interface do Swagger UI após a instalação.**

## Instalação e Teste

Siga estes passos para configurar e executar a API localmente.

### 1. Pré-requisitos

Certifique-se de que você tem o Ruby (versão 3.4+) e o PostgreSQL instalados e configurados em sua máquina.

### 2. Instalação

#### 2.1 Clone o repositório do projeto.

```bash
git clone https://github.com/rsmwall/volei-rails-api.git
cd volei-rails-api
```

#### 2.2 Configure o ambiente e instale as gems.

Crie o arquivo ``.env`` na raiz do projeto para suas credenciais de banco de dados:

```text
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_HOST=localhost
```

Instale as gems do projeto:

```bash
bundle install
```

#### 2.3 Crie e prepare o banco de dados.

```bash
bundle exec rake db:create
bundle exec rake db:migrate
```

### 3. Como rodar e testar a API

#### 3.1 Inicie o servidor local:

```bash
bundle exec ruby app.rb
# O servidor rodará e informará a porta (geralmente 4567 ou 3000)
```

#### 3.2 Teste os Endpoints:

Use uma ferramenta de teste de API (como Insomnia ou Postman) para interagir com os endpoints.

**Exemplo de Rota de Teste de Status:**

```text
GET http://localhost:4567/
```

**Exemplo de Rota de Criação de Jogador:**

```text
POST http://localhost:4567/players
Content-Type: application/json
Body: { "name": "Teste", "email": "teste@email.com", "gender": "M", "category": "Novato" }
```

## Contribuições

Pull requests são bem-vindos! Se encontrar bugs ou tiver sugestões, abra uma issue.

## Autor

Rafael Ribeiro da Silva
[Github](https://github.com/rsmwall)
[Bluesky](https://bsky.app/profile/rsmwall.dev)
