<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto flex justify-between items-center p-4">
      <NuxtLink to="/" class="flex flex-col cursor-pointer">
        <span class="text-2xl font-bold text-blue-600 leading-none">MINA</span>
        <span class="text-xs text-gray-500 tracking-wider font-medium">
          REMINDER & MONEY EXPEND
        </span>
      </NuxtLink>

      <div class="md:hidden">
        <button
          @click="toggleMobileMenu"
          class="text-gray-700 hover:text-blue-600 focus:outline-none"
        >
          <svg
            v-if="!isMobileMenuOpen"
            class="h-6 w-6"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
          <svg
            v-else
            class="h-6 w-6"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="hidden md:flex md:items-center md:space-x-6">
        <NuxtLink
          to="/"
          class="font-semibold text-gray-600 hover:text-blue-600 transition-colors"
          >HOME</NuxtLink
        >
        <NuxtLink
          to="/reminder"
          class="font-semibold text-gray-600 hover:text-blue-600 transition-colors"
          >REMINDER</NuxtLink
        >
        <NuxtLink
          to="/money"
          class="font-semibold text-gray-600 hover:text-blue-600 transition-colors"
          >MONEY EXPEND</NuxtLink
        >
      </div>
    </nav>

    <div
      v-if="isMobileMenuOpen"
      class="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-40"
    >
      <div class="flex flex-col space-y-1 px-4 pt-2 pb-3">
        <NuxtLink
          to="/"
          @click="closeMobileMenu"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >HOME</NuxtLink
        >
        <NuxtLink
          to="/reminder"
          @click="closeMobileMenu"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >REMINDER</NuxtLink
        >
        <NuxtLink
          to="/money"
          @click="closeMobileMenu"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >MONEY EXPEND</NuxtLink
        >
      </div>
    </div>
  </header>
  <slot></slot>
</template>

<script setup>
import { ref } from "vue";

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>

<style scoped>
.absolute.top-full {
  top: 100%;
}
</style>
