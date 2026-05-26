# AtendeMax

## INTEGRANTES

- Ana Clara Silvestre
- Caio Victor Santos Valentim
- Adilson Valentim

## BACKEND 

- FastApi

## FRONTEND

- HTML, Javascript e CSS

## LINK DO JIRA

[Acesse Aqui](https://projetosana.atlassian.net/jira/software/projects/FLOW/boards/100/backlog?atlOrigin=eyJpIjoiYjBhYjI4ZmNlMmU5NDA3MzllNzQ0YzBmYTBhMmE4ZDUiLCJwIjoiaiJ9)

## COMO EXECUTAR O PROJETO

### 1. Subir o backend

O backend deste projeto esta no repositorio:

https://github.com/AtendeMax/atendemax-backend

Siga as instrucoes do README desse repositorio para iniciar a API.

Observacao: o frontend espera a API rodando em `http://127.0.0.1:8000`.

### 2. Executar o frontend

Como este frontend usa requisicoes HTTP para a API, execute com um servidor local (nao abra o `index.html` direto com `file://`).

No terminal, dentro da pasta do frontend, rode um dos comandos abaixo:

Opcao A (Python):

```bash
python -m http.server 5500
```

Opcao B (Node, via npx):

```bash
npx serve . -l 5500
```

### 3. Acessar no navegador

Abra:

http://127.0.0.1:5500

Com isso, voce podera cadastrar clientes e visualizar a fila de espera integrada ao backend.