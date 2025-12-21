import { boot } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import { useAuthStore } from 'src/features/auth/store';

export default boot(({ app }) => {
  const pinia = createPinia();
  app.use(pinia);

  // Load auth from storage on app start
  const authStore = useAuthStore();
  authStore.loadUserFromStorage();
});
