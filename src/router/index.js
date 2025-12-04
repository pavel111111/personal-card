import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import SoldierForm from '../components/PibForm.vue';
import { jwtDecode } from "jwt-decode";

const routes = [
  { path: '/', redirect: '/form' },
  { path: '/login', component: Login },
  { path: '/form', component: SoldierForm, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Навігаційний гвард
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  let isExpired = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        isExpired = true;
        localStorage.removeItem("token");
      }
    } catch (e) {
      // токен зламаний
      isExpired = true;
      localStorage.removeItem("token");
    }
  }

  if (to.meta.requiresAuth && (!token || isExpired)) {
    return next('/login');
  }

  if (to.path === '/login' && token && !isExpired) {
    return next('/form');
  }

  next();
});

export default router;