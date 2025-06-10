<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm text-center">
      <div class="mx-auto mb-4 w-16 h-16">
        <svg
          v-if="type === 'success'"
          class="w-full h-full text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <svg
          v-if="type === 'error'"
          class="w-full h-full text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </div>

      <h2
        class="text-2xl font-bold mb-2"
        :class="type === 'success' ? 'text-gray-800' : 'text-red-600'"
      >
        {{ type === "success" ? "Success!" : "Error!" }}
      </h2>

      <p class="text-gray-600 mb-6">{{ message }}</p>

      <button
        @click="$emit('close')"
        class="px-6 py-2 rounded-lg text-white font-semibold transition-colors"
        :class="
          type === 'success'
            ? 'bg-blue-500 hover:bg-blue-600'
            : 'bg-red-500 hover:bg-red-600'
        "
      >
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
// Komponen ini menerima 3 properti dari parent
defineProps({
  show: Boolean,
  message: String,
  type: {
    type: String,
    default: "success", // default tipe adalah 'success'
  },
});

// Komponen ini akan mengirimkan event 'close' saat tombol di-klik
defineEmits(["close"]);
</script>
