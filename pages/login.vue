<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <div class="flex-grow flex items-center justify-center">
      <div
        class="container flex w-full max-w-6xl m-4 bg-white shadow-2xl rounded-2xl overflow-hidden"
      >
        <div class="w-full lg:w-1/2 p-8 md:p-14">
          <div class="flex items-center mb-12">
            <img
              src="/image/Frame 1.png"
              alt="YourBrand Logo"
              class="w-60 h-auto"
            />
          </div>
          <h2 class="text-3xl font-semibold text-gray-900">
            Welcome Back, Ready to Manage Your Day?
          </h2>
          <p class="mt-2 text-gray-600">
            Enter your email and password to access your account.
          </p>

          <form class="mt-8" @submit.prevent="handleLogin">
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700"
                >Email</label
              >
              <input
                type="text"
                id="email"
                v-model="email"
                class="w-full p-3 mt-1 text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
                required
              />
              <p v-if="emailError" class="mt-2 text-sm text-red-500">
                {{ emailError }}
              </p>
            </div>

            <div class="mb-4">
              <label
                for="password"
                class="block text-sm font-medium text-gray-700"
                >Password</label
              >
              <input
                type="password"
                id="password"
                v-model="password"
                class="w-full p-3 mt-1 text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                required
              />
              <p v-if="passwordError" class="mt-2 text-sm text-red-500">
                {{ passwordError }}
              </p>
            </div>

            <button
              type="submit"
              class="w-full py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Log In
            </button>
          </form>

          <div class="mt-8 text-sm text-center text-gray-600">
            Don't Have An Account?
            <NuxtLink
              to="/register"
              class="font-medium text-blue-600 cursor-pointer hover:underline"
              >Register Now</NuxtLink
            >
          </div>
        </div>

        <div
          class="hidden lg:flex flex-col items-center justify-center w-1/2 p-8 text-white bg-blue-700 rounded-r-2xl"
        >
          <div class="text-center">
            <h2 class="text-4xl font-bold">
              Manage your finances and organize your daily activities.
            </h2>
            <p class="mt-4">Log in to access your dashboard.</p>
          </div>

          <div class="mt-10">
            <img
              src="/image/Group 4.png"
              alt="Dashboard Preview"
              class="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

// Definisikan interface untuk respons yang sukses
interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: number;
    name: string | null;
    email: string;
  };
  statusMessage: string;
}

definePageMeta({
  layout: "login",
});

const router = useRouter();

const email = ref("");
const password = ref("");
const emailError = ref("");
const passwordError = ref("");

const authStore = useMyAuthStore();

// Validating email format
const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const handleLogin = async () => {
  emailError.value = "";
  passwordError.value = "";
  let isValid = true;

  if (!validateEmail(email.value)) {
    emailError.value = "Please enter a valid email address.";
    isValid = false;
  }

  if (password.value.length < 8) {
    passwordError.value = "Password must be at least 8 characters long.";
    isValid = false;
  }

  if (!isValid) return;

  try {
    // Terapkan tipe LoginResponse ke $fetch di sini
    const response = await $fetch<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    // Sekarang TypeScript tahu bahwa 'response' memiliki properti 'success'
    if (response.success) {
      authStore.token = response.token;
      authStore.user = response.user;
      router.push("/");
    } else {
      // Baris ini mungkin tidak akan pernah tercapai jika API Anda
      // melempar error pada kegagalan, tapi aman untuk menjaganya.
      passwordError.value = response.statusMessage || "Invalid credentials";
    }
  } catch (error: any) {
    console.error("Login failed:", error);
    // Ambil pesan error dari data respons jika ada
    passwordError.value =
      error.data?.statusMessage || "An error occurred while logging in.";
  }
};

onMounted(() => {
  if (authStore.token && !authStore.isTokenExpired) {
    // Anda mungkin perlu menambahkan pengecekan token di sini
    router.push("/");
  }
});
</script>
