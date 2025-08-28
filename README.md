# Wayne Industries - Sistema de Gerenciamento de Segurança

## 📁 Estrutura Completa do Projeto

```
wayne-security-system/
├── backend/
│   ├── app.py                          # Aplicação principal Flask
│   ├── config.py                       # Configurações
│   ├── extensions.py                   # Inicialização das extensões
│   ├── requirements.txt                # Dependências Python
│   │
│   ├── models/                         # Modelos de dados
│   │   ├── __init__.py
│   │   ├── user.py                     # Modelo de usuário
│   │   ├── access_log.py               # Modelo de log de acesso
│   │   ├── resource.py                 # Modelo de recursos
│   │   └── security_alert.py           # Modelo de alertas
│   │
│   ├── routes/                         # Rotas/Controllers
│   │   ├── __init__.py                 # Registro das rotas
│   │   ├── auth_routes.py              # Rotas de autenticação
│   │   ├── user_routes.py              # Rotas de usuários
│   │   ├── access_routes.py            # Rotas de controle de acesso
│   │   ├── resource_routes.py          # Rotas de recursos
│   │   ├── alert_routes.py             # Rotas de alertas
│   │   └── dashboard_routes.py         # Rotas do dashboard
│   │
│   ├── services/                       # Lógica de negócios
│   │   ├── __init__.py
│   │   ├── auth_service.py             # Serviços de autenticação
│   │   ├── resource_service.py         # Serviços de recursos
│   │   ├── alert_service.py            # Serviços de alertas
│   │   └── dashboard_service.py        # Serviços do dashboard
│   │
│   └── migrations/                     # Migrações do banco (se usar Alembic)
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── App.js                      # Aplicação principal
│   │   ├── index.js                    # Entry point
│   │   │
│   │   ├── components/                 # Componentes reutilizáveis
│   │   │   ├── Layout/
│   │   │   │   ├── Layout.js           # Layout principal
│   │   │   │   ├── Header.js           # Cabeçalho
│   │   │   │   ├── Sidebar.js          # Menu lateral
│   │   │   │   └── Footer.js           # Rodapé
│   │   │   │
│   │   │   ├── Common/
│   │   │   │   ├── Button.js           # Botão personalizado
│   │   │   │   ├── Modal.js            # Modal reutilizável
│   │   │   │   ├── Table.js            # Tabela customizada
│   │   │   │   ├── Card.js             # Card component
│   │   │   │   ├── LoadingSpinner.js   # Indicador de carregamento
│   │   │   │   └── Alert.js            # Componente de alerta
│   │   │   │
│   │   │   ├── Forms/
│   │   │   │   ├── ResourceForm.js     # Formulário de recursos
│   │   │   │   ├── AlertForm.js        # Formulário de alertas
│   │   │   │   ├── UserForm.js         # Formulário de usuários
│   │   │   │   └── AccessLogForm.js    # Formulário de logs
│   │   │   │
│   │   │   ├── Charts/
│   │   │   │   ├── StatCard.js         # Card de estatísticas
│   │   │   │   ├── LineChart.js        # Gráfico de linha
│   │   │   │   ├── BarChart.js         # Gráfico de barras
│   │   │   │   └── PieChart.js         # Gráfico de pizza
│   │   │   │
│   │   │   └── ProtectedRoute.js       # Rota protegida
│   │   │
│   │   ├── pages/                      # Páginas da aplicação
│   │   │   ├── LoginPage.js            # Página de login
│   │   │   ├── DashboardPage.js        # Dashboard principal
│   │   │   ├── AccessControlPage.js    # Controle de acesso
│   │   │   ├── ResourcesPage.js        # Gestão de recursos
│   │   │   ├── AlertsPage.js           # Alertas de segurança
│   │   │   ├── UsersPage.js            # Gerenciar usuários
│   │   │   ├── ProfilePage.js          # Perfil do usuário
│   │   │   └── NotFoundPage.js         # Página 404
│   │   │
│   │   ├── contexts/                   # Context providers
│   │   │   ├── AuthContext.js          # Context de autenticação
│   │   │   ├── AlertContext.js         # Context de alertas
│   │   │   └── ThemeContext.js         # Context de tema
│   │   │
│   │   ├── services/                   # Serviços/API
│   │   │   ├── apiService.js           # Serviço principal da API
│   │   │   ├── authService.js          # Serviços de autenticação
│   │   │   ├── storageService.js       # Gerenciar localStorage
│   │   │   └── utilsService.js         # Utilitários gerais
│   │   │
│   │   ├── hooks/                      # Custom hooks
│   │   │   ├── useAuth.js              # Hook de autenticação
│   │   │   ├── useApi.js               # Hook para API calls
│   │   │   ├── useLocalStorage.js      # Hook para localStorage
│   │   │   └── useDebounce.js          # Hook de debounce
│   │   │
│   │   ├── utils/                      # Utilitários
│   │   │   ├── constants.js            # Constantes da aplicação
│   │   │   ├── validators.js           # Validadores de formulário
│   │   │   ├── formatters.js           # Formatadores de dados
│   │   │   └── permissions.js          # Verificação de permissões
│   │   │
│   │   ├── styles/                     # Estilos
│   │   │   ├── globals.css             # Estilos globais
│   │   │   ├── components.css          # Estilos de componentes
│   │   │   └── tailwind.css            # Configuração Tailwind
│   │   │
│   │   └── assets/                     # Assets estáticos
│   │       ├── images/                 # Imagens
│   │       ├── icons/                  # Ícones
│   │       └── fonts/                  # Fontes customizadas
│   │
│   ├── package.json                    # Dependências Node.js
│   └── tailwind.config.js              # Configuração Tailwind CSS
│
├── docs/                               # Documentação
│   ├── api.md                          # Documentação da API
│   ├── setup.md                        # Guia de instalação
│   ├── architecture.md                 # Arquitetura do sistema
│   └── deployment.md                   # Guia de deploy
│
├── scripts/                            # Scripts auxiliares
│   ├── setup.sh                        # Script de configuração
│   ├── backup.py                       # Script de backup
│   └── seed_data.py                    # Popular banco com dados
│
├── docker-compose.yml                  # Configuração Docker
├── .gitignore                          # Arquivos ignorados pelo Git
├── .env.example                        # Exemplo de variáveis de ambiente
└── README.md                           # Este arquivo
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- Python 3.8+
- Node.js 14+
- SQLite (ou PostgreSQL/MySQL para produção)

### Backend (Flask)

1. **Clone o repositório**
```bash
git clone https://github.com/your-username/wayne-security-system.git
cd wayne-security-system/backend
```

2. **Criar ambiente virtual**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

3. **Instalar dependências**
```bash
pip install -r requirements.txt
```

4. **Configurar variáveis de ambiente**
```bash
cp .env.example .env
# Editar .env com suas configurações
```

5. **Executar migrações (se necessário)**
```bash
flask db upgrade
```

6. **Executar servidor**
```bash
python app.py
# ou
flask run
```

### Frontend (React)

1. **Navegar para o diretório frontend**
```bash
cd ../frontend
```

2. **Instalar dependências**
```bash
npm install
# ou
yarn install
```

3. **Configurar variáveis de ambiente**
```bash
cp .env.example .env
# Definir REACT_APP_API_URL=http://localhost:5000/api
```

4. **Executar aplicação**
```bash
npm start
# ou
yarn start
```

## 📦 requirements.txt (Backend)

```
Flask==2.3.3
Flask-CORS==4.0.0
Flask-SQLAlchemy==3.0.5
Flask-JWT-Extended==4.5.2
Flask-Migrate==4.0.5
Werkzeug==2.3.7
python-dotenv==1.0.0
marshmallow==3.20.1
marshmallow-sqlalchemy==0.29.0
bcrypt==4.0.1
email-validator==2.0.0
redis==4.6.0
celery==5.3.1
gunicorn==21.2.0
psycopg2-binary==2.9.7
```

## 📦 package.json (Frontend)

```json
{
  "name": "wayne-security-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.4",
    "@testing-library/react": "^13.3.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "lucide-react": "^0.263.1",
    "recharts": "^2.8.0",
    "axios": "^1.4.0",
    "date-fns": "^2.30.0",
    "lodash": "^4.17.21",
    "react-hook-form": "^7.45.4",
    "react-hot-toast": "^2.4.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24"
  }
}
```

## 🔧 Configuração do Tailwind CSS

### tailwind.config.js
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wayne-gold': '#FFD700',
        'wayne-dark': '#1a1a1a',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

## 🌟 Funcionalidades Principais

### ✅ Sistema de Autenticação
- Login/logout com JWT
- Refresh tokens automático
- Controle de permissões por role
- Sessões persistentes

### ✅ Dashboard Inteligente
- Estatísticas em tempo real
- Gráficos interativos
- Métricas de performance
- Atividades recentes

### ✅ Controle de Acesso
- Logs detalhados de entrada/saída
- Filtros avançados
- Autorização por área
- Histórico completo

### ✅ Gestão de Recursos
- CRUD completo de equipamentos
- Sistema de manutenção
- Atribuição de recursos
- Relatórios de utilização

### ✅ Sistema de Alertas
- Criação e gerenciamento
- Níveis de severidade
- Escalação automática
- Sistema de respostas

### ✅ Gerenciamento de Usuários
- Diferentes níveis de acesso
- Perfis personalizáveis
- Auditoria de ações
- Sistema de departamentos

## 🔐 Níveis de Permissão

### Funcionário
- Visualizar próprio perfil
- Ver recursos disponíveis
- Criar logs de acesso pessoais

### Gerente
- Todas as permissões de funcionário
- Gerenciar recursos da equipe
- Criar e visualizar alertas
- Gerenciar usuários do departamento
- Acessar relatórios básicos

### Administrador
- Todas as permissões do sistema
- Gerenciar todos os usuários
- Configurações do sistema
- Relatórios completos
- Acesso ao dashboard avançado

## 🚀 Deploy em Produção

### Usando Docker
```bash
# Build das imagens
docker-compose build

# Subir os serviços
docker-compose up -d

# Executar migrações
docker-compose exec backend flask db upgrade
```

### Deploy Manual

#### Backend
```bash
# Instalar dependências de produção
pip install gunicorn

# Executar com Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

#### Frontend
```bash
# Build para produção
npm run build

# Servir com nginx ou Apache
# Copiar arquivos de build/ para servidor web
```

## 📊 Monitoramento e Logs

### Logs da Aplicação
- Logs estruturados em JSON
- Rotação automática de arquivos
- Diferentes níveis (DEBUG, INFO, WARNING, ERROR)
- Integração com ferramentas de monitoramento

### Métricas do Sistema
- Performance da API
- Uso de recursos
- Estatísticas de usuários
- Alertas de sistema

## 🔒 Segurança

### Medidas Implementadas
- Autenticação JWT com refresh tokens
- Hash de senhas com bcrypt
- Validação rigorosa de entrada
- Rate limiting nas APIs
- CORS configurado adequadamente
- Sanitização de dados
- Logs de auditoria

### Configurações Recomendadas
- HTTPS em produção
- Firewall configurado
- Backup automático do banco
- Monitoramento de intrusão
- Atualizações regulares

## 📚 API Documentation

A documentação completa da API está disponível em:
- Swagger UI: `http://localhost:5000/api/docs`
- ReDoc: `http://localhost:5000/api/redoc`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## 📞 Suporte

Para dúvidas e suporte:
- Email: support@wayneindustries.com
- Issues: GitHub Issues
- Documentation: Wiki do projeto

## 🎯 Roadmap

### Versão 2.0
- [ ] Integração com câmeras IP
- [ ] Sistema de notificações push
- [ ] App mobile
- [ ] Inteligência artificial para detecção de anomalias
- [ ] Integração com sistemas externos
- [ ] Relatórios avançados com BI