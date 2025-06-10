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
          <h2 class="text-3xl font-semibold text-gray-900">Create Account</h2>
          <p class="mt-2 text-gray-600">
            Enter your email and password to create an account.
          </p>

          <form class="mt-8" @submit.prevent="handleRegister">
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700"
                >Email</label
              >
              <input
                type="email"
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
              <label for="name" class="block text-sm font-medium text-gray-700"
                >Name</label
              >
              <input
                id="name"
                v-model="name"
                class="w-full p-3 mt-1 text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="aminah"
                required
              />
              <p v-if="nameEror" class="mt-2 text-sm text-red-500">
                {{ nameEror }}
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

            <div class="mb-6">
              <label
                for="confirmPassword"
                class="block text-sm font-medium text-gray-700"
                >Confirm Password</label
              >
              <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                class="w-full p-3 mt-1 text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                required
              />
              <p v-if="confirmPasswordError" class="mt-2 text-sm text-red-500">
                {{ confirmPasswordError }}
              </p>
            </div>

            <button
              type="submit"
              class="w-full py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Register
            </button>
          </form>

          <div class="mt-8 text-sm text-center text-gray-600">
            Already have an account?
            <NuxtLink
              to="/login"
              class="font-medium text-blue-600 cursor-pointer hover:underline"
              >Log In</NuxtLink
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
            <p class="mt-4">Create an account to get started.</p>
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
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  layout: "login",
});

const router = useRouter();

const email = ref("");
const password = ref("");
const name = ref("");
const confirmPassword = ref("");
const emailError = ref("");
const passwordError = ref("");
const nameEror = ref("");
const confirmPasswordError = ref("");

// Validating email format
const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const handleRegister = async () => {
  emailError.value = "";
  passwordError.value = "";
  confirmPasswordError.value = "";
  nameEror.value = "";
  let isValid = true;

  if (!validateEmail(email.value)) {
    emailError.value = "Please enter a valid email address.";
    isValid = false;
  }
  if (name.value.length < 4) {
    nameEror.value = "name must be at least 4 characters long";
    isValid = false;
  }

  if (password.value.length < 8) {
    passwordError.value = "Password must be at least 8 characters long.";
    isValid = false;
  }

  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = "Passwords do not match.";
    isValid = false;
  }

  if (!isValid) return;

  try {
    // Send request to the register API
    const response = await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        email: email.value,
        name: name.value,
        password: password.value,
      },
    });

    if (response.success) {
      alert("Registration successful! Please log in.");
      router.push("/login");
    } else {
      passwordError.value = "Registration failed.";
    }
  } catch (error) {
    console.error("Registration failed:", error);
    passwordError.value = "An error occurred while registering.";
  }
};
</script>
