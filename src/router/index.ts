import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/LandingView.vue'),
      meta: { title: 'Inicio' }
    },
    {
      path: '/registrarse',
      name: 'Register',
      component: () => import('../views/RegisterView.vue'),
      meta: { title: 'Registrarse' }
    },
    {
      path: '/iniciar-sesion',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: 'Iniciar Sesión' }
    },
    {
      path: '/panel-control',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { title: 'Panel de Control' }
    },
    {
      path: '/ingresos',
      name: 'incoming',
      component: () => import('../views/IncomingView.vue'),
      meta: { title: 'Ingresos' }
    },
    {
      path: '/egresos',
      name: 'outcoming',
      component: () => import('../views/OutcomingView.vue'),
      meta: { title: 'Egresos' }
    },
  ],
})

// Navigation guard para actualizar el título de la página
router.beforeEach((to, from, next) => {
  const baseTitle = 'Riwi Wallet';
  document.title = to.meta.title ? `${baseTitle} | ${to.meta.title}` : baseTitle;
  next();
})

export default router
