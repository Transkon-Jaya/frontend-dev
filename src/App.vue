<template>
  <div class="app-container">
    <!-- Sidebar hanya muncul jika bukan di halaman login -->
    <Sidebar v-if="showSidebar" />

    <div :class="['content', showHeader ? 'with-header' : 'no-header']">
      <!-- Header hanya muncul jika bukan di halaman login -->
      <AppHeader v-if="showHeader" />

      <!-- Konten utama -->
      <router-view />
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";
import AppHeader from "./components/AppHeader.vue";
import Sidebar from "./components/AppSidebar.vue";
import Footer from "@/components/AppFooter.vue";

// Dapatkan informasi rute saat ini
const route = useRoute();

// Sembunyikan Header & Sidebar jika berada di halaman login
const showHeader = computed(() => route.path !== "/login" && !route.meta.hideHeader);
const showSidebar = computed(() => route.path !== "/login" && !route.meta.hideSidebar);
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
  z-index: 1;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  margin: 0;
}

.with-header {
  padding-top: 100px;
}

.no-header {
  padding-top: 0px;
}
</style>