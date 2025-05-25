<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto flex justify-between items-center p-4">
      <div class="text-2xl font-bold text-gray-900 leading-none">
        <span class="text-blue-600">MINA</span>
        <span class="text-xs text-gray-500 tracking-wider font-medium">
          REMINDER & MONEY EXPEND</span
        >
      </div>
      <div class="flex items-center space-x-6">
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
  </header>
  <slot></slot>
</template>
