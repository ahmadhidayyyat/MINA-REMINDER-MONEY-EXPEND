// middleware/auth.ts

export default defineNuxtRouteMiddleware((to, from) => {
  // Abaikan semua rute API
  if (to.path.startsWith("/api/")) {
    return;
  }

  const authStore = useMyAuthStore();

  // Redirect ke login jika token expired dan user tidak sedang di halaman login
  if (authStore.isTokenExpired) {
    if (to.path !== "/login") {
      return navigateTo("/login");
    }
  }
});
