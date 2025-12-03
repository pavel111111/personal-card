import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import SoldierForm from '../components/PibForm.vue';

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
  const token = localStorage.getItem('token');
  console.log("Tokenццц:", token);

  if (to.meta.requiresAuth && !token) {
    next('/login'); // редирект на логін, якщо токена немає
  } else if (to.path === '/login' && token) {
    next('/form'); // якщо вже логінений, не даємо зайти на логін
  } else {
    next(); // все ок
  }
});

export default router;