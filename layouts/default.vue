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
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
          <svg
            v-else
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
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
          to="/expense"
          class="font-semibold text-gray-600 hover:text-blue-600 transition-colors"
          >MONEY EXPEND</NuxtLink
        >

        <div class="relative" ref="profileMenuRef">
          <button @click="toggleProfileMenu" class="focus:outline-none">
            <IconsProfile />
          </button>

          <div
            v-if="isProfileMenuOpen"
            class="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden z-20 border"
          >
            <div class="px-4 py-3">
              <p class="text-sm font-semibold text-gray-800">
                {{ authStore.user.name }}
              </p>
              <p class="text-sm text-gray-600 truncate">
                {{ authStore.user.email }}
              </p>
            </div>
            <div class="border-t border-gray-100"></div>
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div v-if="isMobileMenuOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
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
          to="/expense"
          @click="closeMobileMenu"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >MONEY EXPEND</NuxtLink
        >

        <div class="border-t border-gray-200 pt-4 pb-3">
          <div class="flex items-center px-5">
            <IconsProfile />
            <div class="ml-3">
              <p class="text-base font-medium text-gray-800">
                {{ authStore.user.name }}
              </p>
              <p class="text-sm font-medium text-gray-500">
                {{ authStore.user.email }}
              </p>
            </div>
          </div>
          <div class="mt-3 px-2 space-y-1">
            <button
              @click="handleLogoutAndCloseMenu"
              class="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
  <slot></slot>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const authStore = useMyAuthStore();
const router = useRouter();

// State untuk menu mobile
const isMobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// State untuk menu profil
const isProfileMenuOpen = ref(false);
const profileMenuRef = ref(null); // Untuk referensi elemen DOM
const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

// Fungsi Logout
function handleLogout() {
  if (isProfileMenuOpen.value) isProfileMenuOpen.value = false; // Tutup menu jika terbuka
  authStore.token = "";
  authStore.user = null;
  router.push("/login");
}

const handleLogoutAndCloseMenu = () => {
  closeMobileMenu();
  handleLogout();
};

// Fungsi untuk menutup dropdown saat klik di luar area
const handleClickOutside = (event) => {
  if (profileMenuRef.value && !profileMenuRef.value.contains(event.target)) {
    isProfileMenuOpen.value = false;
  }
};

// Tambahkan event listener saat komponen di-mount
onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

// Hapus event listener saat komponen akan di-unmount untuk mencegah memory leak
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<style scoped>
/* Tidak perlu style tambahan, semua dihandle oleh Tailwind CSS */
</style>
