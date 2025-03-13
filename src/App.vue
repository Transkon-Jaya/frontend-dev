<template>
  <div class="app-container">
    <!-- Sidebar hanya muncul jika bukan di halaman login -->
    <Sidebar v-if="showSidebar" />

    <div class="content">
      <!-- Header hanya muncul jika bukan di halaman login -->
      <AppHeader v-if="showHeader" />

      <!-- Konten utama -->
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";
import AppHeader from "./components/AppHeader.vue";
import Sidebar from "./components/Sidebar.vue";

// Dapatkan informasi rute saat ini
const route = useRoute();

// Sembunyikan Header & Sidebar jika berada di halaman login
const showHeader = computed(() => route.path !== "/login");
const showSidebar = computed(() => route.path !== "/login");
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

.content {
  flex: 1;
  position: relative;
  z-index: 1; /* Pastikan konten tetap bisa diklik saat sidebar ditutup */
  width: 100%; /* Pastikan mengambil seluruh lebar */
  padding: 20px; /* Beri padding agar konten tidak menempel */
  box-sizing: border-box;
  margin: 0;
}
</style>
