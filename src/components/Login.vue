<template>
  <div class="login-container">
    <h2>Авторизація</h2>
    <input v-model="login" placeholder="Логін" />
    <input v-model="password" type="password" placeholder="Пароль" />
    <button @click="doLogin">Увійти</button>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const login = ref('');
const password = ref('');
const API_URL = import.meta.env.VITE_API_URL || "";

const error = ref('');
const router = useRouter();

const doLogin = async () => {
  error.value = '';
  try {
    const res = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: login.value, password: password.value })
    });

    const data = await res.json();
    if (!data.success) {
      error.value = data.error || 'Помилка авторизації';
      return;
    }

    localStorage.setItem('token', data.token);
    router.push('/form');
  } catch (err) {
    console.error(err);
    error.value = 'Серверна помилка';
  }
};
</script>

<style>
.login-container { width: 300px; margin: 50px auto; text-align: center; }
.login-container input { display:block; margin: 10px auto; width: 90%; padding:5px; }
.error { color:red; margin-top:10px; }
</style>
