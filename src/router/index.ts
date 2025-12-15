import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/LandingView.vue'),
      meta: { title: 'Inicio', requiresAuth: false }
    },
    {
      path: '/registrarse',
      name: 'Register',
      component: () => import('../views/RegisterView.vue'),
      meta: { title: 'Registrarse', requiresAuth: false, guestOnly: true }
    },
    {
      path: '/iniciar-sesion',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: 'Iniciar Sesión', requiresAuth: false, guestOnly: true }
    },
    {
      path: '/panel-control',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { title: 'Panel de Control', requiresAuth: true }
    },
    {
      path: '/ingresos',
      name: 'income',
      component: () => import('../views/IncomeView.vue'),
      meta: { title: 'Ingresos', requiresAuth: true }
    },
    {
      path: '/egresos',
      name: 'expenses',
      component: () => import('../views/ExpensesView.vue'),
      meta: { title: 'Egresos', requiresAuth: true }
    },
    {
      path: '/reportes',
      name: 'reports',
      component: () => import('../views/ReportsView.vue'),
      meta: { title: 'Reportes', requiresAuth: true }
    },
    {
      path: '/reglas-financieras',
      name: 'financial-rules',
      component: () => import('../views/FinancialRulesView.vue'),
      meta: { title: 'Reglas Financieras', requiresAuth: true }
    },
    {
      path: '/configuracion',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { title: 'Configuración', requiresAuth: true }
    },
    {
      path: '/oauth2/callback',
      name: 'oauth2-callback',
      component: () => import('../views/OAuth2CallbackView.vue'),
      meta: { title: 'Autenticacion', requiresAuth: false }
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const baseTitle = 'Riwi Wallet';
  document.title = to.meta.title ? `${baseTitle} | ${to.meta.title}` : baseTitle;

  const isAuthenticated = !!authService.getToken();
  const requiresAuth = to.meta.requiresAuth;
  const guestOnly = to.meta.guestOnly;

  // Si la ruta requiere autenticación y el usuario no está autenticado
  if (requiresAuth && !isAuthenticated) {
    next('/iniciar-sesion');
    return;
  }

  // Si la ruta es solo para invitados (login/register) y el usuario está autenticado
  if (guestOnly && isAuthenticated) {
    next('/panel-control');
    return;
  }

  next();
})

export default router
