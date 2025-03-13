<template>
  <!-- Header hanya muncul jika bukan di halaman login -->
  <AppHeader v-if="showHeader" />

  <router-view />
</template>

<script setup>
import { useRoute } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
import { computed } from "vue";

// Dapatkan informasi rute saat ini
const route = useRoute();

// Sembunyikan header jika berada di halaman login
const showHeader = computed(() => route.path !== "/login");
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
