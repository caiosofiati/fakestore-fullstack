# 🛍️ FakeStore — Um Guia Amigável

Bem-vindo(a) ao projeto principal da loja virtual FakeStore! 

## 🗺️ Visão Geral do Projeto

Este repositório contém uma aplicação **Fullstack** (Frontend + Backend) completa que simula um E-commerce de alta performance. 

### 🛠️ Stack Tecnológica

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Backend**: [NestJS](https://nestjs.com/) (Node.js) + [TypeScript](https://www.typescriptlang.org/)
- **Banco de Dados**: [SQLite](https://www.sqlite.org/) via [Prisma ORM](https://www.prisma.io/)
- **Autenticação**: [JWT (JSON Web Token)](https://jwt.io/) + [Passport.js](http://www.passportjs.org/)
- **Testes**: [Jest](https://jestjs.io/)
- **CI**: [GitHub Actions](https://github.com/features/actions)

### ✨ Funcionalidades Principais

- **Proxy API**: O Backend atua como um intermediário seguro para a FakeStore API.
- **Autenticação Segura**: Login com JWT para proteção de rotas privadas.
- **Carrinho de Compras**: Adicionar, remover e atualizar quantidades de itens.
- **Wishlist (Favoritos)**: Salvar produtos com notas personalizadas e prioridades.
- **Histórico de Pedidos**: Fluxo de checkout simulado com persistência de ordens.
- **Painel Administrativo**: Área restrita para CRUD de produtos (disponível para usuários ADMIN).
- **Tema Customizado**: Suporte a Dark Mode e Light Mode.

---

## 🧠 Decisões de Arquitetura, Regras de Negócio e API Externa

### 🌐 A API Externa (FakeStore API)
Para o catálogo de produtos e dados iniciais, optamos por consumir a **[FakeStore API](https://fakestoreapi.com/)**. Ela fornece dados perfeitamente estruturados para simular um e-commerce. O detalhe arquitetural principal é: nosso Frontend **não** consome essa API diretamente. Nosso Backend (NestJS) atua num formato de **Proxy / BFF (Backend For Frontend)**. 

Pense no **Frontend (React)** como um cliente em um restaurante, e o **Backend (NestJS)** como o garçom:
1. O React pede: *"Garçom, me traga a lista de produtos!"*
2. O NestJS vai até a cozinha (a internet, na FakeStore), pega a bandeja, junta aos processos internos, e entrega pronta para o React.

### 💼 Regras de Negócio do nosso CRUD
Enquanto consumimos os produtos de uma API externa base, temos o nosso próprio banco de dados local (um arquivo `dev.db` em SQLite via Prisma ORM) para gerenciar o CRUD e as regras da jornada do usuário que a FakeStore não suporta nativamente:
- **CRUD e Perfis de Usuários**: Sistema de registro e autênticação própria com senhas criptografadas (Bcrypt). Existem permissões de `USER` e `ADMIN`. O login gera um JWT validado via **Passport.js**.
- **Carrinho (Cart) e Wishlist**: Operações de Carrinho (adicionar, remover, mudar quantidade) e Favoritos exigem autenticação (bloqueadas pela *JWT Auth Guard*) e persistem os itens atrelados ao ID do usuário no banco local.
- **Gestão Híbrida de Produtos**: A FakeStore fornece a vitrine principal, mas o painel administrativo (restrito a `ADMIN`) fornece uma interface de CRUD unificada para gestão.
- **Checkout (Orders)**: Finalizar a compra varre o carrinho ativo do usuário, consolida um evento e salva as informações como Histórico de Pedidos (`Orders`), em seguida limpa o carrinho para a próxima compra.

### 🏗️ Decisões de Arquitetura
1. **Padrão Proxy / Intermediário Seguro**: Evita a exposição de lógicas diretas no Client-side. O NestJS concentra a responsabilidade de mesclar dados da API externa com as preferências privadas do usuário vindas do nosso banco, evitando vazamento de dados.
2. **Arquitetura Modular (NestJS)**: Utilizamos a estrutura opinionada do NestJS com injeção de dependências, uso pesado de Decorators e *Guards* para proteção de rotas (Auth) isolando regras de negócio em *Services* limpos.
3. **SQLite (Prisma ORM)**: Optamos por SQLite local em vez de algo como PostgreSQL pensando na **Developer Experience (DX)** e validação. Elimina a necessidade de quem estiver avaliando o projeto precisar subir containers Docker ou instanciar bancos virtuais, mantendo mesmo assim uma estrutura robusta de relacionamentos mapeados via Prisma ORM.

### Arquitetura de Cache na Memória para a FakeStore API
> **Nota de Arquitetura:** Como a FakeStore API retorna sucesso (200) para operações de escrita (POST, PUT, DELETE) mas **não persiste os dados em seu banco**, implementamos um padrão de Cache e Mock em Memória no arquivo `src/products/products.service.ts`. Isso permite que a aplicação continue consumindo a API real como fonte primária e, simultaneamente, ofereça uma experiência de CRUD 100% funcional para o usuário final durante as operações locais, já que os dados alterados persistem na memória do Node.js.

---

## ⚡ Como rodar a aplicação na sua máquina?

Para a loja ganhar vida, você precisa ligar o **Frontend** e o **Backend** ao mesmo tempo (cada um em uma telinha separada do terminal do VS Code).

### Passo 1: Configuração de Ambiente (.env)
Tanto no `frontend/` quanto no `backend/`, você encontrará um arquivo chamado `.env.example`.
1. Faça uma cópia deste arquivo e renomeie para `.env`.
2. O Backend já vem pré-configurado para usar o SQLite localmente, então você não precisa mudar nada para testar!

### Passo 2: Ligando o Motor (Backend)
Abra um terminal, acesse a pasta do backend e rode os comandos:
```bash
cd backend
npm install
npx prisma migrate dev --name init  # Isso cria a tabela do banco de dados na 1ª vez
npx prisma generate                 # Isso gera os tipos do Prisma Client
npm run start:dev                   # Isso inicia o servidor na porta 3000
```

### Passo 3: Ligando a Tela (Frontend)
Abra um **SEGUNDO** terminal (deixe o primeiro rodando em paz), acesse a pasta do frontend e rode:
```bash
cd frontend
npm install
npm run dev                         # Isso abre a tela do site no seu navegador (porta 5173)
```

Pronto! Abra `http://localhost:5173` no seu navegador para ver a loja em ação.

---

## 🧪 Testes Unitários

A qualidade do código é garantida por testes automatizados. Para rodar a bateria de testes do Backend:
```bash
cd backend
npm run test
```
*(Os testes validam a lógica de produtos, usuários e segurança do sistema)*

---

## 🔑 Testando o Login (Cheat Sheet)

Pular de tela em tela digitando usuário e senha cansa. Por isso, a nossa tela de login já tem botões de **"1-Click Login"** para preencher as credenciais automaticamente para você! 

**Por que fizemos isso?**
- **Melhoria da DX (Developer Experience)**: Facilita a vida de quem está testando o projeto repetidas vezes.
- **Agilidade para Testes**: Permite que você valide as funcionalidades de Admin e Usuário Comum sem precisar consultar arquivos de texto ou o banco de dados.

Se preferir digitar manualmente:
- **Admin**: User `johnd` | Senha `m38rmF$`
- **Comum**: User `mor_2314` | Senha `83r5^_`

*(Isso gera um Token JWT que protege absolutamente toda tentativa de colocar algo no carrinho! O código disso mora na pasta `backend/src/auth`)*

---

## 🛠️ Por que CI e não CD?

Optou-se por focar no CI pelas seguintes razões:
1. **Foco na Estabilidade do Código**: O CI garante que cada alteração no NestJS (Backend) ou React (Frontend) passe por linter, build rigoroso e pela bateria de **Testes Unitários (Jest)**. O código só é mergeado se tiver 100% de integridade.
2. **Avaliação Prática**: Para um recrutador ou tech lead avaliando o projeto, é muito mais valioso baixar o código e rodar localmente (como as instruções acima ensinam), para checar a arquitetura de pastas, o Clean Code e testar a API na prática.
3. **Redução de Custos com Cloud**: Como existem duas pontas separadas (Backend e Frontend), exigir um CD configurado significaria manter servidores ligados em operadoras Cloud (como AWS, Render, Vercel) indefinidamente apenas para exibição, o que pode incorrer em custos com o passar do tempo.

Portanto, a base para um CD (Continuous Deployment) automatizado já existe dentro do Actions do GitHub de forma latente, mas a decisão arquitetural foi parar a esteira assim que os robôs garantem a saúde do código!

---