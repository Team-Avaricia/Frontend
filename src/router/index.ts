import { createRouter, createWebHistory } from 'vue-router'
import LandingView from "@/views/LandingView.vue";
import RegisterView from "@/views/RegisterView.vue";
import LoginView from "@/views/LoginView.vue"
import DashboardView from "@/views/DashboardView.vue";
import IncomingView from "@/views/IncomingView.vue";
import OutcomingView from "@/views/OutcomingView.vue";
import AuthDemoView from "@/views/AuthDemoView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
      meta: {title: 'Inicio'}
    },
    {
      path: '/auth-demo',
      name: 'authDemo',
      component: AuthDemoView,
      meta: {title: 'Demo de Autenticación'}
    },
    /*{
      path: '/register',
      name: 'Register',
      component: () => import('../views/RegisterView.vue'),
    },*/
    {
      path: '/registrarse',
      name: 'register',
      component: RegisterView,
      meta: {title: 'Registro'}
    },
    {
      path: '/iniciar-sesion',
      name: 'login',
      component: LoginView,
      meta: {title: 'Iniciar sesión' }
    },
    {
      path: '/panel-control',
      name: 'dashboard',
      component: DashboardView,
      meta: {title: 'Panel de control'}
    },
    {
      path: '/ingresos',
      name: 'incoming',
      component: IncomingView,
      meta: {title: 'Ingresos'}
    },
    {
      path: '/egresos',
      name: 'outcoming',
      component: OutcomingView,
      meta: {title: 'Egresos'}
    }
  ],
})

export default router
