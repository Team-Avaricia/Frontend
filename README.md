<div align="center">

# 💰 Riwi Wallet - Frontend

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**Your Smart Financial Assistant** | **Tu Asistente Financiero Inteligente**

[English](#-english) • [Español](#-español)

</div>

---

# 🇺🇸 English

## 📖 About The Project

Riwi Wallet is a modern personal finance management application built with Vue.js 3. It provides an intuitive interface for tracking income, expenses, generating financial reports, and setting up smart financial rules to help users achieve their financial goals.

<!-- 
📸 SCREENSHOT PLACEHOLDER - Dashboard Overview
Add a screenshot of the main dashboard here showing:
- Balance summary cards
- Recent transactions list
- Income/Expense charts
- Quick action buttons

Recommended size: 1200x800px
Path suggestion: ./docs/screenshots/dashboard-overview.png

Example:
![Dashboard Overview](./docs/screenshots/dashboard-overview.png)
-->

### ✨ Key Features

- 📊 **Interactive Dashboard** - Real-time overview of your financial status with charts and statistics
- 💵 **Income Management** - Track and categorize all your income sources
- 💸 **Expense Tracking** - Monitor spending with detailed categorization
- 📈 **Financial Reports** - Generate comprehensive reports by date range and category
- 🎯 **Financial Rules** - Set spending limits, savings goals, and category budgets
- 🤖 **Telegram Integration** - Receive notifications and manage finances via Telegram bot
- 🔐 **Secure Authentication** - JWT-based auth with OAuth2 support (Google & Microsoft)
- 🌓 **Dark/Light Mode** - Automatic theme detection with manual toggle option
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              RIWI WALLET SYSTEM                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         FRONTEND (This Repo)                        │    │
│  │                                                                     │    │
│  │   Vue.js 3 + TypeScript + Vite + Tailwind CSS                       │    │
│  │   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │    │
│  │   │Dashboard │ │ Income   │ │ Expenses │ │ Reports  │               │    │
│  │   └──────────┘ └──────────┘ └──────────┘ └──────────┘               │    │
│  │   ┌──────────┐ ┌──────────┐ ┌──────────┐                            │    │
│  │   │Financial │ │ Settings │ │  Auth    │                            │    │
│  │   │  Rules   │ │          │ │(Login/   │                            │    │
│  │   │          │ │          │ │Register) │                            │    │
│  │   └──────────┘ └──────────┘ └──────────┘                            │    │
│  │                         Port: 5173 (dev)                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│                    ┌───────────────┴───────────────┐                        │
│                    │         HTTP/HTTPS            │                        │
│                    │         (Axios)               │                        │
│                    ▼                               ▼                        │
│  ┌─────────────────────────────┐   ┌─────────────────────────────┐          │
│  │      AUTH API (Backend)     │   │     MAIN API (Backend)      │          │
│  │                             │   │                             │          │
│  │   Spring Boot (Java)        │   │   .NET Core (C#)            │          │
│  │   ┌───────────────────┐     │   │   ┌───────────────────┐     │          │
│  │   │ Authentication    │     │   │   │ Users             │     │          │
│  │   │ - JWT Tokens      │     │   │   │ Transactions      │     │          │
│  │   │ - OAuth2 (Google, │     │   │   │ Financial Rules   │     │          │
│  │   │   Microsoft)      │     │   │   │ Spending Valid.   │     │          │
│  │   │ - User Register   │     │   │   │ Telegram Link     │     │          │
│  │   └───────────────────┘     │   │   └───────────────────┘     │          │
│  │       Port: 8080            │   │       Port: 5203            │          │
│  └─────────────────────────────┘   └─────────────────────────────┘          │
│                                                   │                         │
│                                                   ▼                         │
│                                    ┌─────────────────────────────┐          │
│                                    │     TELEGRAM BOT            │          │
│                                    │                             │          │
│                                    │   - Notifications           │          │
│                                    │   - Quick transactions      │          │
│                                    │   - Balance queries         │          │
│                                    └─────────────────────────────┘          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Frontend Architecture

```
src/
├── assets/              # Static assets (CSS, images, SVG logos)
├── components/          # Reusable Vue components
│   ├── NavBar.vue       # Main navigation bar with auth state
│   ├── Sidebar.vue      # Sidebar with user info and navigation
│   └── icons/           # Icon components
├── composables/         # Vue 3 Composition API hooks
│   ├── useApi.ts        # API operations (users, transactions, rules)
│   ├── useTheme.ts      # Dark/Light mode management
│   └── useTransactionEvents.ts  # Event bus for real-time updates
├── router/              # Vue Router configuration
│   └── index.ts         # Route definitions with guards
├── services/            # External service integrations
│   ├── api.ts           # Axios clients for Auth & Main APIs
│   └── auth.ts          # Authentication token management
├── types/               # TypeScript type definitions
│   └── api.ts           # API request/response interfaces
└── views/               # Page components
    ├── DashboardView.vue      # Main dashboard
    ├── IncomeView.vue         # Income management
    ├── ExpensesView.vue       # Expense tracking
    ├── ReportsView.vue        # Financial reports
    ├── FinancialRulesView.vue # Budget rules
    ├── SettingsView.vue       # User settings & Telegram
    ├── LoginView.vue          # Login page
    ├── RegisterView.vue       # Registration page
    ├── LandingView.vue        # Landing page
    └── OAuth2CallbackView.vue # OAuth2 redirect handler
```

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Vue.js | 3.5.22 |
| **Build Tool** | Vite | 7.1.11 |
| **Language** | TypeScript | 5.9.0 |
| **Styling** | Tailwind CSS | 4.1.17 |
| **State Management** | Pinia | 3.0.3 |
| **Routing** | Vue Router | 4.6.3 |
| **HTTP Client** | Axios | 1.13.2 |
| **Notifications** | Vue Toastification | 2.0.0-rc.5 |
| **Unit Testing** | Vitest | 3.2.4 |
| **E2E Testing** | Cypress | 15.5.0 |
| **Linting** | ESLint | 9.37.0 |
| **Formatting** | Prettier | 3.6.2 |

## 📋 Prerequisites

- **Node.js**: `^20.19.0` or `>=22.12.0`
- **npm**: Latest version recommended
- **Backend Services**:
  - Auth API (Spring Boot) running on port `8080`
  - Main API (.NET) running on port `5203`

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/riwi-wallet.git
cd riwi-wallet/Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Authentication API (Spring Boot)
VITE_AUTH_API_URL=http://localhost:8080/api

# Main API (.NET)
VITE_MAIN_API_URL=http://localhost:5203/api
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

<!-- 
📸 SCREENSHOT PLACEHOLDER - Login Page
Add a screenshot of the login page showing:
- Login form with email/password fields
- Social login buttons (Google, Microsoft)
- Link to registration
- Dark/Light mode toggle

Recommended size: 800x600px
Path suggestion: ./docs/screenshots/login-page.png

Example:
![Login Page](./docs/screenshots/login-page.png)
-->

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run test:unit` | Run unit tests with Vitest |
| `npm run test:e2e` | Run E2E tests against production build |
| `npm run test:e2e:dev` | Run E2E tests against dev server |
| `npm run lint` | Lint and fix code with ESLint |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Run TypeScript type checking |

## 🧪 Testing

### Unit Tests

```bash
# Run tests in watch mode
npm run test:unit

# Run tests with coverage
npm run test:unit -- --coverage
```

### End-to-End Tests

```bash
# Development mode (opens Cypress UI)
npm run test:e2e:dev

# CI mode (headless)
npm run build
npm run test:e2e
```

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build \
  --build-arg VITE_AUTH_API_URL=https://auth.your-domain.com/api \
  --build-arg VITE_MAIN_API_URL=https://api.your-domain.com/api \
  -t riwi-wallet-frontend .
```

### Run Container

```bash
docker run -d -p 80:80 --name riwi-wallet-frontend riwi-wallet-frontend
```

### Docker Compose (Recommended)

```yaml
version: '3.8'
services:
  frontend:
    build:
      context: ./Frontend
      args:
        - VITE_AUTH_API_URL=http://auth-api:8080/api
        - VITE_MAIN_API_URL=http://main-api:5203/api
    ports:
      - "80:80"
    depends_on:
      - auth-api
      - main-api
```

## 📁 Project Structure Details

### Composables

| Composable | Purpose |
|------------|---------|
| `useApi.ts` | Provides reactive wrappers for API calls with loading/error states |
| `useTheme.ts` | Manages dark/light theme with system preference detection |
| `useTransactionEvents.ts` | Event bus for synchronizing transaction updates across components |

### API Services

The application connects to two backend services:

| Service | Base URL | Purpose |
|---------|----------|---------|
| **Auth API** | `VITE_AUTH_API_URL` | Authentication, registration, OAuth2 |
| **Main API** | `VITE_MAIN_API_URL` | Users, transactions, financial rules |

### Route Guards

Routes are protected based on authentication status:

- **Public Routes**: Landing, Login, Register
- **Protected Routes**: Dashboard, Income, Expenses, Reports, Financial Rules, Settings
- **Guest Only Routes**: Login, Register (redirects authenticated users)

## 🎨 Screenshots

<!-- 
📸 SCREENSHOT PLACEHOLDER - Income View
Add a screenshot showing:
- Income list with categories
- Add income modal/form
- Filtering and sorting options
- Category statistics

Recommended size: 1200x800px
Path suggestion: ./docs/screenshots/income-view.png

Example:
![Income Management](./docs/screenshots/income-view.png)
-->

<!-- 
📸 SCREENSHOT PLACEHOLDER - Expenses View
Add a screenshot showing:
- Expense list with categories
- Add expense form
- Spending validation warnings
- Category breakdown

Recommended size: 1200x800px
Path suggestion: ./docs/screenshots/expenses-view.png

Example:
![Expense Tracking](./docs/screenshots/expenses-view.png)
-->

<!-- 
📸 SCREENSHOT PLACEHOLDER - Financial Rules
Add a screenshot showing:
- Active rules list
- Rule progress indicators
- Add new rule form
- Period and category options

Recommended size: 1200x800px
Path suggestion: ./docs/screenshots/financial-rules.png

Example:
![Financial Rules](./docs/screenshots/financial-rules.png)
-->

<!-- 
📸 SCREENSHOT PLACEHOLDER - Settings & Telegram
Add a screenshot showing:
- User profile settings
- Telegram integration section
- Theme toggle
- Account options

Recommended size: 1200x800px
Path suggestion: ./docs/screenshots/settings-telegram.png

Example:
![Settings](./docs/screenshots/settings-telegram.png)
-->

<!-- 
📸 SCREENSHOT PLACEHOLDER - Dark Mode
Add a screenshot showing the application in dark mode:
- Dashboard or any main view
- Demonstrate the dark theme colors

Recommended size: 1200x800px
Path suggestion: ./docs/screenshots/dark-mode.png

Example:
![Dark Mode](./docs/screenshots/dark-mode.png)
-->

## 🔧 IDE Setup

### Recommended

- [VS Code](https://code.visualstudio.com/)
- [Vue - Official Extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur if installed)

### Browser DevTools

**Chromium-based browsers (Chrome, Edge, Brave):**
- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Enable Custom Object Formatters in DevTools settings

**Firefox:**
- [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

# 🇪🇸 Español

## 📖 Acerca del Proyecto

Riwi Wallet es una aplicación moderna de gestión de finanzas personales construida con Vue.js 3. Proporciona una interfaz intuitiva para el seguimiento de ingresos, gastos, generación de reportes financieros y configuración de reglas financieras inteligentes para ayudar a los usuarios a alcanzar sus metas financieras.

<!-- 
📸 PLACEHOLDER DE CAPTURA - Vista General del Dashboard
Agregar una captura de pantalla del dashboard principal mostrando:
- Tarjetas de resumen de balance
- Lista de transacciones recientes
- Gráficos de Ingresos/Egresos
- Botones de acción rápida

Tamaño recomendado: 1200x800px
Ruta sugerida: ./docs/screenshots/dashboard-overview.png

Ejemplo:
![Vista General del Dashboard](./docs/screenshots/dashboard-overview.png)
-->

### ✨ Características Principales

- 📊 **Dashboard Interactivo** - Vista en tiempo real de tu estado financiero con gráficos y estadísticas
- 💵 **Gestión de Ingresos** - Rastrea y categoriza todas tus fuentes de ingreso
- 💸 **Seguimiento de Gastos** - Monitorea tus gastos con categorización detallada
- 📈 **Reportes Financieros** - Genera reportes completos por rango de fechas y categoría
- 🎯 **Reglas Financieras** - Establece límites de gasto, metas de ahorro y presupuestos por categoría
- 🤖 **Integración con Telegram** - Recibe notificaciones y gestiona tus finanzas vía bot de Telegram
- 🔐 **Autenticación Segura** - Autenticación basada en JWT con soporte OAuth2 (Google y Microsoft)
- 🌓 **Modo Oscuro/Claro** - Detección automática del tema con opción de cambio manual
- 📱 **Diseño Responsivo** - Optimizado para escritorio, tablet y dispositivos móviles

## 🏗️ Arquitectura

### Vista General del Sistema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SISTEMA RIWI WALLET                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                       FRONTEND (Este Repositorio)                   │    │
│  │                                                                     │    │
│  │   Vue.js 3 + TypeScript + Vite + Tailwind CSS                       │    │
│  │   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │    │
│  │   │Dashboard │ │ Ingresos │ │ Egresos  │ │ Reportes │               │    │
│  │   └──────────┘ └──────────┘ └──────────┘ └──────────┘               │    │
│  │   ┌──────────┐ ┌──────────┐ ┌──────────┐                            │    │
│  │   │ Reglas   │ │ Config.  │ │  Auth    │                            │    │
│  │   │Financ.   │ │          │ │(Login/   │                            │    │
│  │   │          │ │          │ │Registro) │                            │    │
│  │   └──────────┘ └──────────┘ └──────────┘                            │    │
│  │                         Puerto: 5173 (dev)                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│                    ┌───────────────┴───────────────┐                        │
│                    │         HTTP/HTTPS            │                        │
│                    │         (Axios)               │                        │
│                    ▼                               ▼                        │
│  ┌─────────────────────────────────┐   ┌─────────────────────────────┐      │
│  │      API AUTH (Backend)         │   │     API PRINCIPAL (Backend) │      │
│  │                                 │   │                             │      │
│  │   Spring Boot (Java)            │   │   .NET Core (C#)            │      │
│  │   ┌───────────────────┐         │   │   ┌───────────────────┐     │      │
│  │   │ Autenticación     │         │   │   │ Usuarios          │     │      │
│  │   │ - Tokens JWT      │         │   │   │ Transacciones     │     │      │
│  │   │ - OAuth2 (Google, │         │   │   │ Reglas Financ.    │     │      │
│  │   │   Microsoft)      │         │   │   │ Valid. Gastos     │     │      │
│  │   │ - Registro        │         │   │   │ Vinc. Telegram    │     │      │
│  │   └───────────────────┘         │   │   └───────────────────┘     │      │
│  │       Puerto: 8080              │   │       Puerto: 5203          │      │
│  └─────────────────────────────────┘   └─────────────────────────────┘      │
│                                                   │                         │
│                                                   ▼                         │
│                                    ┌─────────────────────────────┐          │
│                                    │       BOT DE TELEGRAM       │          │
│                                    │                             │          │
│                                    │   - Notificaciones          │          │
│                                    │   - Transacciones rápidas   │          │
│                                    │   - Consultas de balance    │          │
│                                    └─────────────────────────────┘          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Arquitectura del Frontend

```
src/
├── assets/              # Recursos estáticos (CSS, imágenes, logos SVG)
├── components/          # Componentes Vue reutilizables
│   ├── NavBar.vue       # Barra de navegación principal con estado de auth
│   ├── Sidebar.vue      # Barra lateral con info de usuario y navegación
│   └── icons/           # Componentes de iconos
├── composables/         # Hooks de Vue 3 Composition API
│   ├── useApi.ts        # Operaciones API (usuarios, transacciones, reglas)
│   ├── useTheme.ts      # Gestión de modo oscuro/claro
│   └── useTransactionEvents.ts  # Bus de eventos para actualizaciones
├── router/              # Configuración de Vue Router
│   └── index.ts         # Definiciones de rutas con guards
├── services/            # Integraciones con servicios externos
│   ├── api.ts           # Clientes Axios para APIs de Auth y Principal
│   └── auth.ts          # Gestión de tokens de autenticación
├── types/               # Definiciones de tipos TypeScript
│   └── api.ts           # Interfaces de request/response de API
└── views/               # Componentes de página
    ├── DashboardView.vue      # Dashboard principal
    ├── IncomeView.vue         # Gestión de ingresos
    ├── ExpensesView.vue       # Seguimiento de egresos
    ├── ReportsView.vue        # Reportes financieros
    ├── FinancialRulesView.vue # Reglas de presupuesto
    ├── SettingsView.vue       # Configuración y Telegram
    ├── LoginView.vue          # Página de inicio de sesión
    ├── RegisterView.vue       # Página de registro
    ├── LandingView.vue        # Página de inicio
    └── OAuth2CallbackView.vue # Manejador de redirección OAuth2
```

## 🛠️ Stack Tecnológico

| Categoría | Tecnología | Versión |
|-----------|------------|---------|
| **Framework** | Vue.js | 3.5.22 |
| **Herramienta de Build** | Vite | 7.1.11 |
| **Lenguaje** | TypeScript | 5.9.0 |
| **Estilos** | Tailwind CSS | 4.1.17 |
| **Gestión de Estado** | Pinia | 3.0.3 |
| **Enrutamiento** | Vue Router | 4.6.3 |
| **Cliente HTTP** | Axios | 1.13.2 |
| **Notificaciones** | Vue Toastification | 2.0.0-rc.5 |
| **Pruebas Unitarias** | Vitest | 3.2.4 |
| **Pruebas E2E** | Cypress | 15.5.0 |
| **Linting** | ESLint | 9.37.0 |
| **Formateo** | Prettier | 3.6.2 |

## 📋 Prerrequisitos

- **Node.js**: `^20.19.0` o `>=22.12.0`
- **npm**: Se recomienda la última versión
- **Servicios Backend**:
  - API de Auth (Spring Boot) ejecutándose en el puerto `8080`
  - API Principal (.NET) ejecutándose en el puerto `5203`

## 🚀 Comenzando

### 1. Clonar el Repositorio

```bash
git clone https://github.com/your-org/riwi-wallet.git
cd riwi-wallet/Frontend
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crear un archivo `.env` en el directorio raíz:

```env
# API de Autenticación (Spring Boot)
VITE_AUTH_API_URL=http://localhost:8080/api

# API Principal (.NET)
VITE_MAIN_API_URL=http://localhost:5203/api
```

### 4. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

<!-- 
📸 PLACEHOLDER DE CAPTURA - Página de Login
Agregar una captura de la página de login mostrando:
- Formulario de login con campos email/contraseña
- Botones de login social (Google, Microsoft)
- Enlace a registro
- Toggle de modo oscuro/claro

Tamaño recomendado: 800x600px
Ruta sugerida: ./docs/screenshots/login-page.png

Ejemplo:
![Página de Login](./docs/screenshots/login-page.png)
-->

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo con hot reload |
| `npm run build` | Verificar tipos y compilar para producción |
| `npm run preview` | Previsualizar build de producción localmente |
| `npm run test:unit` | Ejecutar pruebas unitarias con Vitest |
| `npm run test:e2e` | Ejecutar pruebas E2E contra build de producción |
| `npm run test:e2e:dev` | Ejecutar pruebas E2E contra servidor de desarrollo |
| `npm run lint` | Analizar y corregir código con ESLint |
| `npm run format` | Formatear código con Prettier |
| `npm run type-check` | Ejecutar verificación de tipos de TypeScript |

## 🧪 Pruebas

### Pruebas Unitarias

```bash
# Ejecutar pruebas en modo watch
npm run test:unit

# Ejecutar pruebas con cobertura
npm run test:unit -- --coverage
```

### Pruebas End-to-End

```bash
# Modo desarrollo (abre UI de Cypress)
npm run test:e2e:dev

# Modo CI (headless)
npm run build
npm run test:e2e
```

## 🐳 Despliegue con Docker

### Construir Imagen Docker

```bash
docker build \
  --build-arg VITE_AUTH_API_URL=https://auth.tu-dominio.com/api \
  --build-arg VITE_MAIN_API_URL=https://api.tu-dominio.com/api \
  -t riwi-wallet-frontend .
```

### Ejecutar Contenedor

```bash
docker run -d -p 80:80 --name riwi-wallet-frontend riwi-wallet-frontend
```

### Docker Compose (Recomendado)

```yaml
version: '3.8'
services:
  frontend:
    build:
      context: ./Frontend
      args:
        - VITE_AUTH_API_URL=http://auth-api:8080/api
        - VITE_MAIN_API_URL=http://main-api:5203/api
    ports:
      - "80:80"
    depends_on:
      - auth-api
      - main-api
```

## 📁 Detalles de Estructura del Proyecto

### Composables

| Composable | Propósito |
|------------|-----------|
| `useApi.ts` | Proporciona wrappers reactivos para llamadas API con estados de carga/error |
| `useTheme.ts` | Gestiona tema oscuro/claro con detección de preferencia del sistema |
| `useTransactionEvents.ts` | Bus de eventos para sincronizar actualizaciones de transacciones entre componentes |

### Servicios de API

La aplicación se conecta a dos servicios backend:

| Servicio | URL Base | Propósito |
|----------|----------|-----------|
| **API Auth** | `VITE_AUTH_API_URL` | Autenticación, registro, OAuth2 |
| **API Principal** | `VITE_MAIN_API_URL` | Usuarios, transacciones, reglas financieras |

### Guards de Rutas

Las rutas están protegidas según el estado de autenticación:

- **Rutas Públicas**: Landing, Login, Registro
- **Rutas Protegidas**: Dashboard, Ingresos, Egresos, Reportes, Reglas Financieras, Configuración
- **Solo Invitados**: Login, Registro (redirige a usuarios autenticados)

## 🎨 Capturas de Pantalla

<!-- 
📸 PLACEHOLDER DE CAPTURA - Vista de Ingresos
Agregar una captura mostrando:
- Lista de ingresos con categorías
- Modal/formulario para agregar ingreso
- Opciones de filtrado y ordenamiento
- Estadísticas por categoría

Tamaño recomendado: 1200x800px
Ruta sugerida: ./docs/screenshots/income-view.png

Ejemplo:
![Gestión de Ingresos](./docs/screenshots/income-view.png)
-->

<!-- 
📸 PLACEHOLDER DE CAPTURA - Vista de Egresos
Agregar una captura mostrando:
- Lista de egresos con categorías
- Formulario para agregar egreso
- Advertencias de validación de gastos
- Desglose por categoría

Tamaño recomendado: 1200x800px
Ruta sugerida: ./docs/screenshots/expenses-view.png

Ejemplo:
![Seguimiento de Egresos](./docs/screenshots/expenses-view.png)
-->

<!-- 
📸 PLACEHOLDER DE CAPTURA - Reglas Financieras
Agregar una captura mostrando:
- Lista de reglas activas
- Indicadores de progreso de reglas
- Formulario para agregar nueva regla
- Opciones de período y categoría

Tamaño recomendado: 1200x800px
Ruta sugerida: ./docs/screenshots/financial-rules.png

Ejemplo:
![Reglas Financieras](./docs/screenshots/financial-rules.png)
-->

<!-- 
📸 PLACEHOLDER DE CAPTURA - Configuración y Telegram
Agregar una captura mostrando:
- Configuración del perfil de usuario
- Sección de integración con Telegram
- Toggle de tema
- Opciones de cuenta

Tamaño recomendado: 1200x800px
Ruta sugerida: ./docs/screenshots/settings-telegram.png

Ejemplo:
![Configuración](./docs/screenshots/settings-telegram.png)
-->

<!-- 
📸 PLACEHOLDER DE CAPTURA - Modo Oscuro
Agregar una captura mostrando la aplicación en modo oscuro:
- Dashboard o cualquier vista principal
- Demostrar los colores del tema oscuro

Tamaño recomendado: 1200x800px
Ruta sugerida: ./docs/screenshots/dark-mode.png

Ejemplo:
![Modo Oscuro](./docs/screenshots/dark-mode.png)
-->

## 🔧 Configuración del IDE

### Recomendado

- [VS Code](https://code.visualstudio.com/)
- [Extensión Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (deshabilitar Vetur si está instalado)

### DevTools del Navegador

**Navegadores basados en Chromium (Chrome, Edge, Brave):**
- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Habilitar Custom Object Formatters en la configuración de DevTools

**Firefox:**
- [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

## 🤝 Contribuir

1. Hacer fork del repositorio
2. Crear tu rama de feature (`git checkout -b feature/CaracteristicaIncreible`)
3. Hacer commit de tus cambios (`git commit -m 'Agregar CaracteristicaIncreible'`)
4. Hacer push a la rama (`git push origin feature/CaracteristicaIncreible`)
5. Abrir un Pull Request

---

<div align="center">

**Made with ❤️ by the Riwi Team**

[⬆ Back to top](#-riwi-wallet---frontend)

</div>
