import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/home/Home.vue';
import Login from "@/views/auth/Login.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const isAuthenticated = localStorage.getItem('auth_token');

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
