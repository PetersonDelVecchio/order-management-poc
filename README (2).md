# Order Management POC 🚀

## 📌 Visão Geral

Este projeto é uma Prova de Conceito (POC) de um sistema de
gerenciamento de pedidos, composto por:

-   API REST (.NET 9 + EF Core + PostgreSQL)
-   Worker (.NET BackgroundService + Azure Service Bus)
-   Frontend (React + TailwindCSS)
-   Docker Compose (orquestração completa)

------------------------------------------------------------------------

## 🏗 Arquitetura

-   Cliente cria pedido via Frontend
-   API persiste no PostgreSQL
-   API publica evento no Azure Service Bus
-   Worker consome mensagem
-   Worker processa pedido (Pendente → Processando → Finalizado)
-   Frontend recebe atualização via polling

------------------------------------------------------------------------

## 🛠 Tecnologias Utilizadas

### Backend

-   .NET 9
-   Entity Framework Core
-   PostgreSQL
-   Azure Service Bus
-   Health Checks

### Frontend

-   React (Vite + TSX)
-   TailwindCSS

### Infra

-   Docker
-   Docker Compose

------------------------------------------------------------------------

## 📦 Como Rodar com Docker

### 1️⃣ Criar arquivo .env

Baseie-se no `.env.example`.

### 2️⃣ Subir containers

``` bash
docker compose up --build
```

API disponível em: http://localhost:5108

PgAdmin: http://localhost:5050

------------------------------------------------------------------------

## 🔎 Endpoints da API

### Criar Pedido

POST /api/orders

### Listar Pedidos

GET /api/orders

### Detalhes do Pedido

GET /api/orders/{id}

### Health Check

GET /health

------------------------------------------------------------------------

## 🔐 Segurança

-   Variáveis sensíveis via `.env`
-   Segredos removidos do repositório

------------------------------------------------------------------------

## ⭐ Diferenciais Implementados

-   Idempotência no Worker
-   Sequência obrigatória de status
-   CorrelationId e EventType no Service Bus
-   Health Checks (API, banco e fila)
-   Migrations automáticas
-   Histórico de status do pedido

------------------------------------------------------------------------

## 📄 Estrutura Simplificada

backend/ ├── Order.API ├── Order.Application ├── Order.Domain ├──
Order.Infrastructure ├── Order.Worker

frontend/

------------------------------------------------------------------------

## 👨‍💻 Autor

Peterson Del Vecchio
