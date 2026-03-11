<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## 🧠 Bem-vindo(a) ao Cérebro do Projeto (Backend)

Este diretório (`backend/`) guarda toda a lógica de segurança, banco de dados e conexão da nossa FakeStore. Ele foi construído usando **NestJS**, um framework incrivelmente robusto que ajuda desenvolvedores a não virarem reféns de um código "macarrônico" (código solto e confuso).

---

## 🧐 Para que serve essa pasta toda?

O nosso Backend não fabrica produtos novos. Ele atua como um **Serviço Proxy**:
1. O Frontend (Lá no diretório `frontend/`) pergunta ao Backend os produtos.
2. O Backend (aqui) recebe a pergunta, se conecta com a internet (na FakeStore API `https://fakestoreapi.com`) e devolve para as telas do usuário.

### O que o Prisma faz?
Dentro da pasta `src/prisma`, temos os arquivos do **Prisma ORM**.
Sabe aqueles momentos em que não queremos usar a `FakeStore API` para salvar coisas pessoais dos nossos usuários (como senhas, itens do Carrinho e Favoritos)? É pra isso que o Prisma serve. 
Ele lê o arquivo `schema.prisma` e cria uma tabela real, minúscula e veloz no arquivo `dev.db` (nosso mini banco de dados SQLite).

### Arquitetura de Cache na Memória para a FakeStore API
> **Nota de Arquitetura:** Como a FakeStore API retorna sucesso (200) para operações de escrita (POST, PUT, DELETE) mas **não persiste os dados em seu banco**, implementamos um padrão de Cache e Mock em Memória no arquivo `src/products/products.service.ts`. Isso permite que a aplicação continue consumindo a API real como fonte primária e, simultaneamente, ofereça uma experiência de CRUD 100% funcional para o usuário final durante as operações locais, já que os dados alterados persistem na memória do Node.js.

---

## 🏃‍♂️ Passo a passo para ligar o Motor (Rodar o Backend)

Quando você for programar (ou apenas testar), você precisa **acordar o servidor**. Na sua tela de terminal do VS Code, abra uma nova aba e siga isso:

```bash
# Entrar nessa pasta
$ cd backend

# Instalar todas as dependências do package.json (só a primeira vez ou se alguém atualizar os pacotes!)
$ npm install

# Iniciar o servidor com Hot-Reload (Ele atualiza sozinho sempre que você salvar um arquivo .ts)
$ npm run start:dev
```
A mágica acontecerá na porta `http://localhost:3000`.

---

## 🧪 Como rodar os Testes Unitários? (O Seu 'Anjo da Guarda')

Lembra do CI/CD rodando no GitHub, e também se você alterar algo que poderia quebrar o app? Fique em paz, os "Testes Unitários" testam o seu código sozinho pra garantir que nada quebrou!

Em um terminal separado (dentro de `backend/`), rode:

```bash
# Fazer os Robôs da Garantia de Qualidade testarem todos os módulos
$ npm run test
```

Ele fará 17 checagens. Se tudo ficar **verde**, você pode fazer o Push para o GitHub de cabeça fria! (Esses testes moram em arquivos chamados `arquivo.spec.ts`. O ".spec" significa "Isto é um teste, não código de produção").

---

## 📚 Arquitetura: Onde encontro as coisas?

Está com um bug pra consertar? Aqui vai um mapa rápido de onde achar as lógicas do Servidor:

- **Rotas e Envio para a FakeStore**: Vá até a pasta `src/products`.
- **Lógica e Salvar no Banco (Carrinho/Favoritos)**: O controlador mora no Frontend, mas a lógica que salva no nosso Prisma está em `src/cart` ou `src/wishlist`.
- **Tratamento de Login/JWT**: Todo o serviço que transforma aquela senha em *Tokens Invisíveis* de sessão está escondida dentro da pasta blindada `src/auth`.
- **Banco de Dados (Tabelas)**: Vá no arquivo puramente de configuração `prisma/schema.prisma`.

