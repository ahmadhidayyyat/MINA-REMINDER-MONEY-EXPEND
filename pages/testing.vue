<template>
  <h1>Testing database</h1>
  <div v-if="pending">
    <h1>loading . . .</h1>
  </div>
  <div v-else>
    {{ users }}
  </div>
</template>

<script setup>
definePageMeta({
  layout: "login",
});

const { data: users, pending } = await useLazyFetch("/api/users", {
  method: "get",
});
</script>
