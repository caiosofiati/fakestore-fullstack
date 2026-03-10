# 🛍️ FakeStore Wishlist — Um Guia Amigável

Bem-vindo(a) ao projeto principal da nossa loja virtual FakeStore! Se você é um desenvolvedor Júnior chegando agora, você está no lugar certo.

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

## 🏗️ Como as peças se encaixam? (A Arquitetura)

Nosso sistema funciona num formato chamado de **Proxy**.
Pense no **Frontend (React)** como um cliente em um restaurante, e o **Backend (NestJS)** como o garçom.

1. O React pede: *"Garçom, me traga a lista de produtos!"*
2. O NestJS vai até a cozinha (a internet, na `https://fakestoreapi.com/products`), pega a bandeja de produtos, e entrega para o React.

### E o Banco de Dados?
Nós **NÃO** salvamos os produtos no nosso banco de dados. Nós usamos o banco de dados (um arquivo levinho chamado `dev.db` que roda em SQLite) **apenas** para salvar as escolhas pessoais dos nossos clientes logados:
- Itens salvos no Carrinho (Cart).
- Produtos marcados como Favoritos (Wishlist).
- Tabela de Usuários cadastrados e Pedidos (Orders) finalizados.

---

## ⚡ Como rodar a aplicação na sua máquina?

Para a loja ganhar vida, você precisa ligar o **Frontend** e o **Backend** ao mesmo tempo (cada um em uma telinha separada do terminal do VS Code).

### Passo 1: Ligando o Motor (Backend)
Abra um terminal, acesse a pasta do backend e rode os comandos:
```bash
cd backend
npm install
npx prisma migrate dev --name init  # Isso cria a tabela do banco de dados na 1ª vez
npm run start:dev                   # Isso inicia o servidor na porta 3000
```

### Passo 2: Ligando a Tela (Frontend)
Abra um **SEGUNDO** terminal (deixe o primeiro rodando em paz), acesse a pasta do frontend e rode:
```bash
cd frontend
npm install
npm run dev                         # Isso abre a tela do site no seu navegador (porta 5173)
```
### Passo 3: Configuração de Ambiente (.env)
Tanto no `frontend/` quanto no `backend/`, você encontrará um arquivo chamado `.env.example`.
1. Faça uma cópia deste arquivo e renomeie para `.env`.
2. O Backend já vem pré-configurado para usar o SQLite localmente, então você não precisa mudar nada para testar!

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

Como este é um projeto de demonstração para vagas de Fullstack, você deve ter notado que temos um pipeline configurado usando **GitHub Actions** (`.github/workflows/ci.yml`), focado inteiramente em **Integração Contínua (CI)**. 

Optou-se por focar no CI pelas seguintes razões:
1. **Foco na Estabilidade do Código**: O CI garante que cada alteração no NestJS (Backend) ou React (Frontend) passe por linter, build rigoroso e pela bateria de **Testes Unitários (Jest)**. O código só é mergeado se tiver 100% de integridade.
2. **Avaliação Prática**: Para um recrutador ou tech lead avaliando o projeto, é muito mais valioso baixar o código e rodar localmente (como as instruções acima ensinam), para checar a arquitetura de pastas, o Clean Code e testar a API na prática.
3. **Redução de Custos com Cloud**: Como existem duas pontas separadas (Backend e Frontend), exigir um CD configurado significaria manter servidores ligados em operadoras Cloud (como AWS, Render, Vercel) indefinidamente apenas para exibição, o que pode incorrer em custos com o passar do tempo.

Portanto, a base para um CD (Continuous Deployment) automatizado já existe dentro do Actions do GitHub de forma latente, mas a decisão arquitetural foi parar a esteira assim que os robôs garantem a saúde do código!

---

**Quer entender onde dar manutenção?**
Temos um manual exclusivo só para você! Leia o arquivo **[DOCUMENTACAO_JUNIOR.md](./DOCUMENTACAO_JUNIOR.md)** que está na raiz do projeto para entender todos os arquivos de ponta a ponta. 

Mãos à obra e divirta-se codando! 🚀
