# PS-Fotos-API

Backend para o aplicativo PSFoto, desenvolvido com NestJS e Prisma ORM. Esta API fornece serviços para gerenciamento de usuários, álbuns de fotos e upload de imagens.

## Tecnologias Utilizadas

- **NestJS** - Framework para construção de aplicações Node.js escaláveis
- **Prisma ORM** - ORM para acesso ao banco de dados PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **Multer** - Middleware para upload de arquivos
- **Google APIs** - Integração com serviços Google

## Estrutura do Banco de Dados

O sistema utiliza três modelos principais:

- **utilizador** - Gerencia informações de usuários
- **album** - Armazena informações sobre álbuns de fotos
- **catalogAlbum** - Relaciona usuários a álbuns e armazena referências a fotos

## Funcionalidades Principais

### Gerenciamento de Usuários
- Registro e login de usuários
- Gerenciamento de sessões
- Listagem de usuários

### Gerenciamento de Álbuns
- Criação, atualização e exclusão de álbuns
- Listagem de álbuns por usuário
- Compartilhamento de álbuns entre usuários

### Gerenciamento de Fotos
- Upload de fotos para álbuns
- Listagem de fotos por álbum
- Armazenamento local de arquivos

## Endpoints da API

### Usuários (Utilizador)
- `POST /utilizador` - Registrar novo usuário
- `POST /utilizador/login` - Login de usuário
- `POST /utilizador/logout` - Logout de usuário
- `GET /utilizador/session/:sessionId` - Obter informações da sessão
- `GET /utilizador/:id` - Obter detalhes de um usuário
- `POST /utilizador/pesquisapornome` - Buscar usuário por nome
- `POST /utilizador/listarUsers` - Listar usuários de um álbum
- `PUT /utilizador` - Atualizar usuário
- `DELETE /utilizador/:id` - Excluir usuário

### Álbuns
- `POST /album` - Criar novo álbum (com suporte para upload de arquivos)
- `GET /album` - Listar todos os álbuns
- `GET /album/:id` - Obter detalhes de um álbum
- `POST /album/listarAlbuns` - Listar álbuns de um usuário
- `PUT /album` - Atualizar álbum
- `DELETE /album/:id` - Excluir álbum
- `POST /album/updateTokens` - Atualizar tokens de acesso do álbum
- `POST /album/adicionarFotosAoAlbum/:albumId/:catalogoId` - Adicionar fotos a um álbum

### Catálogo de Álbum
- `POST /catalogoalbum` - Adicionar entrada no catálogo
- `GET /catalogoalbum` - Listar todas as entradas do catálogo
- `GET /catalogoalbum/:id` - Obter detalhes de uma entrada do catálogo
- `PUT /catalogoalbum` - Atualizar entrada do catálogo
- `PUT /catalogoalbum/atualizaCatalogo` - Atualizar catálogo (método alternativo)
- `DELETE /catalogoalbum/:id` - Excluir entrada do catálogo
- `POST /catalogoalbum/todas` - Listar todas as fotos
- `POST /catalogoalbum/fotos` - Listar fotos de um álbum
- `POST /catalogoalbum/addFotos` - Adicionar fotos ao catálogo
- `POST /catalogoalbum/file` - Obter ID de arquivo
- `POST /catalogoalbum/addUserCatalogo` - Adicionar usuários ao catálogo

## Configuração do Ambiente

O projeto utiliza variáveis de ambiente para configuração:

- `DATABASE_URL` - URL de conexão com o banco de dados PostgreSQL
- `YOUR_CLIENT_ID` - ID do cliente para autenticação Google
- `YOUR_CLIENT_SECRET` - Segredo do cliente para autenticação Google
- `YOUR_REDIRECT_URL` - URL de redirecionamento para autenticação Google

## Pré-requisitos

- Node.js 14+
- PostgreSQL 12+
- NPM ou Yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/RuiYuriAfricano/ps-fotos-api.git
cd ps-fotos-api
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure o arquivo .env com suas credenciais de banco de dados e Google API:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Execute as migrações do Prisma:
```bash
npx prisma migrate dev
```

5. Inicie o servidor:
```bash
npm run start:dev
# ou
npm run dev
```

## Scripts Disponíveis

- `npm run build` - Compila o projeto
- `npm run start` - Inicia o servidor
- `npm run start:dev` - Inicia o servidor em modo de desenvolvimento
- `npm run start:prod` - Inicia o servidor em modo de produção
- `npm run lint` - Executa o linter
- `npm run test` - Executa os testes

## Estrutura do Projeto

```
ps-fotos-api/
├── prisma/             # Configuração do Prisma e migrações
├── src/
│   ├── album/          # Módulo de álbuns
│   ├── catalogoalbum/  # Módulo de catálogo de álbuns
│   ├── utilizador/     # Módulo de usuários
│   ├── prisma/         # Serviço do Prisma
│   ├── app.module.ts   # Módulo principal da aplicação
│   └── main.ts         # Ponto de entrada da aplicação
├── upload/             # Diretório para arquivos enviados
└── .env                # Variáveis de ambiente
```

## Contato

Rui Yuri Africano - [GitHub](https://github.com/RuiYuriAfricano)
