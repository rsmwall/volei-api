# Vôlei Rails API

## Descrição do Projeto

O "Vôlei Rails API" é o backend da plataforma, construído com Ruby on Rails e documentado com Rswag. A API gerencia jogadores, partidas e um sistema de avaliação completo, servindo como base para uma aplicação web ou mobile. Desenvolvido para a disciplina de Programação
para Web II do curso de ADS.

## Requisitos Funcionais

A API foi projetada para atender aos seguintes requisitos:

#### Gerenciamento de Jogadores

- Registro de Jogadores: Permite que jogadores se registrem com informações básicas (sexo, categoria).

- Visualização e Atualização de Perfil: Jogadores podem visualizar e atualizar seus dados.

#### Gerenciamento de Partidas

- Criação de Partidas: Jogadores podem criar partidas, definindo local, data e categoria.

- Adesão e Status: Jogadores podem solicitar adesão a partidas, e organizadores podem aceitar ou rejeitar os pedidos.

- Pagamento e Desistência: Gerencia o status de pagamento e a desistência de jogadores.

#### Sistema de Avaliação e Ranking

- Avaliações: Jogadores podem avaliar outros jogadores e organizadores após as partidas.

- Ranking: Um sistema de ranking é gerado com base na pontuação média das avaliações.

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

#### 2.2 Instale as gems do projeto.

```bash
bundle install
```

#### 2.3 Crie e prepare o banco de dados.

```bash
rails db:create
rails db:migrate
```

### 3. Como Testar

#### 3.1 Gere a documentação da API: A documentação é gerada automaticamente a partir dos testes.

```bash
bundle exec rake rswag:specs:swaggerize
```

#### 3.2 Execute a suíte de testes:

```bash
bundle exec rspec
```

#### 3.4 Inicie o servidor local:

```bash
rails server
```

#### 3.5 Acesse a documentação da API: Abra seu navegador e acesse a URL abaixo. Você poderá ver todos os endpoints e testá-los diretamente pela interface.

```
http://localhost:3000/api-docs
```

## Contribuições

Pull requests são bem-vindos! Se encontrar bugs ou tiver sugestões, abra uma issue.

## Autor

Rafael Ribeiro da Silva
[Github](https://github.com/rsmwall)
[Bluesky](https://bsky.app/profile/rsmwall.dev)
