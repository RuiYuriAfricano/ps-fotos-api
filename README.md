# PS-Fotos-API - Backend para Aplicativo de Compartilhamento de Fotos

PS-Fotos-API é o backend do aplicativo PSFoto, desenvolvido com Node.js e Express. Esta API fornece serviços para gerenciamento de usuários, álbuns de fotos e compartilhamento de imagens.

## Funcionalidades

- **Autenticação e Autorização**
  - Registro e login de usuários
  - Autenticação com tokens JWT
  - Integração com Google OAuth
  - Gerenciamento de sessões

- **Gerenciamento de Álbuns**
  - Criação, leitura, atualização e exclusão de álbuns
  - Compartilhamento de álbuns entre usuários
  - Controle de permissões de acesso

- **Gerenciamento de Fotos**
  - Upload de imagens
  - Armazenamento de fotos
  - Recuperação e download de imagens
  - Metadados de imagens

- **Sincronização**
  - Suporte para sincronização entre dispositivos
  - Gerenciamento de conflitos
  - Histórico de alterações

## Tecnologias Utilizadas

- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web para Node.js
- **Prisma** - ORM para acesso ao banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **Multer** - Middleware para upload de arquivos
- **Google OAuth** - Autenticação com Google

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

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev
```

5. Inicie o servidor:
```bash
npm run dev
# ou
yarn dev
```

## Estrutura do Projeto

```
ps-fotos-api/
├── prisma/             # Configuração do Prisma e migrações
├── src/
│   ├── controllers/    # Controladores da API
│   ├── middlewares/    # Middlewares personalizados
│   ├── models/         # Modelos de dados
│   ├── routes/         # Rotas da API
│   ├── services/       # Serviços de negócios
│   ├── utils/          # Utilitários
│   └── app.js          # Configuração do Express
├── uploads/            # Diretório para arquivos enviados
└── index.js            # Ponto de entrada da aplicação
```

## Endpoints da API

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/google` - Autenticação com Google
- `POST /api/auth/logout` - Logout de usuário

### Álbuns

- `GET /api/albums` - Listar álbuns do usuário
- `GET /api/albums/:id` - Obter detalhes de um álbum
- `POST /api/albums` - Criar novo álbum
- `PUT /api/albums/:id` - Atualizar álbum
- `DELETE /api/albums/:id` - Excluir álbum
- `POST /api/albums/:id/share` - Compartilhar álbum

### Fotos

- `GET /api/photos` - Listar fotos do usuário
- `GET /api/photos/:id` - Obter detalhes de uma foto
- `POST /api/photos` - Fazer upload de foto
- `DELETE /api/photos/:id` - Excluir foto

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.

## Contato

Rui Yuri Africano - [GitHub](https://github.com/RuiYuriAfricano)
