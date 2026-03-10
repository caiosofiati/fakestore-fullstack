# 🎨 Bem-vindo(a) à Cara do Projeto (Frontend)

Este diretório (`frontend/`) guarda toda a parte visual do nosso E-commerce. Tudo o que o usuário clica, vê e interage mora aqui. Nós usamos **React** (a biblioteca mais popular do mundo para criar interfaces) junto com **Vite** (um empacotador super rápido que faz o seu código aparecer no navegador em milissegundos).

E sim, usamos **TypeScript**! Isso significa que o nosso código tem "tipos", o que evita que a gente tente somar uma palavra com um número por acidente.

---

## 🧐 O que o Frontend faz?

O Frontend é basicamente o "Cliente no Restaurante". Ele **não** guarda os produtos da loja no código dele.
Em vez disso, ele pede os produtos para o "Garçom" (que é o nosso Backend, na pasta `backend/`). O Backend busca os produtos da internet (da `FakeStore API`) e entrega para as nossas telas React desenharem lindamente.

### Onde estão os arquivos mágicos?

Aqui vai um mapa de como se achar nessa pasta se precisarem de você pra arrumar um bug:

* 📞 **A pasta de "Telefone" (`src/api/`)**: Sabe aquele momento que a tela precisa pedir dados pro Servidor? Entra na pasta `api`. Lá estão os arquivos tipo `productsApi.ts`, que fazem a ligação HTTP (fetch) com o nosso Backend (na porta 3000).
* 🧱 **As Peças de Lego (`src/components/`)**: Aqui moram botões, cards de produtos, navegação. São pedacinhos visuais reaproveitáveis de código que você encaixa pra formar uma página inteira.
* 📄 **As Telas Inteiras (`src/pages/`)**: É a junção de vários `components`. Quando você clica num menu, o React Router joga você pra uma dessas páginas (ex: `Cart.tsx` ou `Home.tsx`).
* 🎣 **Os Ganchos Inteligentes (`src/hooks/`)**: Se várias telas precisam da mesma regra lógica (ex: "Verificar se o cara tá logado e buscar os Favoritos dele"), nós colocamos num "Custom Hook" como o `useAuth` ou `useWishlist`.

---

## 🏃‍♀️ Como Ligar a Interface?

Você precisa rodar o servidor de desenvolvimento para ver a sua tela no navegador. Abra um terminal só para esta pasta e digite:

```bash
# Entrar nessa pasta
$ cd frontend

# Instalar os pacotes necessários que o React e o Vite precisam para ligar (apenas na 1ª vez!)
$ npm install

# Ligar o motor visual! (Vai abrir a tela atualizando em tempo real)
$ npm run dev
```

Assim que ele disser que está "Ready", abra `http://localhost:5173` no seu Chrome e seja feliz. 

*(Dica: Se a tela ficar em loading infinito e os produtos não aparecerem, confira se a telinha preta do **Backend** também está ligada e rodando sem erros! Um depende do outro)*

---

## 🛡️ Entendendo a Segurança Rápida (Login Mágico)

O sistema inteiro da nossa loja usa uma credencial chamada **JWT (Token de Segurança)**.
Se um bug te pedir para consertar algo de Login:
1. O usuário digita a senha.
2. Nós enviamos pro Backend aprovar.
3. Se aprovar, o Backend nos devolve uma chave secreta e invisível (o Token JWT).
4. O nosso Frontend pega essa chave silenciosa e esconde no `localStorage` do navegador do usuário.
5. Em todas as próximas vezes que a pessoa tentar comprar ou favoritar algo (ir no `/api/wishlist`), nós anexamos a chave silenciosa pra provar quem nós somos, se não a porta fecha! (Essa anexação automática de chave está em arquivos como `src/api/wishlistApi.ts`).

Qualquer dúvida, quebre, teste e experimente. Divirta-se criando interfaces incríveis! 🚀
