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
const error = ref('');
const router = useRouter();

const doLogin = async () => {
  error.value = '';

  if (!login.value || !password.value) {
    error.value = 'Введіть логін і пароль';
    return;
  }

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: login.value, password: password.value })
    });

    // Перевірка, чи прийшов валідний JSON
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonErr) {
      console.error('Invalid JSON response:', text);
      error.value = 'Сервер повернув некоректні дані';
      return;
    }

    if (!data.success) {
      error.value = data.error || 'Помилка авторизації';
      return;
    }

    localStorage.setItem('token', data.token || '');
    router.push('/form'); // Перенаправлення після логіну

  } catch (err) {
    console.error(err);
    error.value = 'Серверна помилка';
  }
};
</script>

<style>
.login-container { width: 300px; margin: 50px auto; text-align: center; }
.login-container input { display: block; margin: 10px auto; width: 90%; padding: 5px; }
button { padding: 5px 10px; cursor: pointer; }
.error { color: red; margin-top: 10px; }
</style>
