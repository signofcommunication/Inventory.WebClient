<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg" style="min-width: 300px">
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="email"
            label="Email"
            type="email"
            required
            :rules="[(val) => (val && val.includes('@')) || 'Please enter a valid email']"
          />

          <q-input
            v-model="password"
            label="Password"
            type="password"
            required
            :rules="[(val) => (val && val.length > 0) || 'Password is required']"
          />

          <q-btn
            type="submit"
            label="Login"
            color="primary"
            :loading="loading"
            :disable="loading"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/features/auth/store';
import { Notify } from 'quasar';

const email = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();
const authStore = useAuthStore();

const onSubmit = async () => {
  loading.value = true;
  try {
    await authStore.login(email.value, password.value);
    Notify.create({
      type: 'positive',
      message: 'Login successful',
    });

    await nextTick();

    console.log('User after login:', authStore.user);
    console.log('Is authenticated:', authStore.isAuthenticated);

    // Redirect based on role
    const role = authStore.user?.role;
    console.log('Role:', role);
    if (role === 'PEMINJAM') {
      console.log('Redirecting to /loan');
      void router.replace('/loan');
    } else if (role === 'PIMPINAN') {
      console.log('Redirecting to /report');
      void router.replace('/report');
    } else {
      console.log('Redirecting to /dashboard');
      void router.replace('/dashboard');
    }
  } catch (error: unknown) {
    console.error('Login error:', error);
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Login failed',
    });
  } finally {
    loading.value = false;
  }
};
</script>
