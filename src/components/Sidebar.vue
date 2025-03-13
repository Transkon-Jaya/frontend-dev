<template>
  <div>
    <!-- Overlay saat sidebar aktif -->
    <div v-if="showDashboard" class="overlay" @click="hideDashboard"></div>

    <!-- Sidebar -->
    <transition name="sidebar-fade">
      <div v-if="showDashboard" class="dashboard" @mouseleave="hideDashboard">
        <h2 class="text-center">Dashboard Menu</h2>
        <ul>
          <li><router-link to="/marketing">Marketing</router-link></li>
          <li><router-link to="/marketing-e">Marketing-E</router-link></li>
          <li><router-link to="/test">Test</router-link></li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const showDashboard = ref(false);

// Fungsi untuk menampilkan sidebar jika mouse ke sisi kiri layar
const handleMouseMove = (event) => {
  if (event.clientX < 50 && !showDashboard.value) {
    showDashboard.value = true;
    document.body.classList.add("sidebar-active"); // Nonaktifkan scroll saat sidebar terbuka
  }
};

// Fungsi untuk menyembunyikan sidebar saat mouse keluar
const hideDashboard = () => {
  showDashboard.value = false;
  document.body.classList.remove("sidebar-active"); // Aktifkan scroll kembali
};

// Tambahkan event listener saat komponen dimuat
onMounted(() => {
  window.addEventListener("mousemove", handleMouseMove);
});

// Hapus event listener saat komponen dihancurkan
onUnmounted(() => {
  window.removeEventListener("mousemove", handleMouseMove);
  document.body.classList.remove("sidebar-active");
});
</script>

<style scoped>
/* Sidebar sebagai overlay */
.dashboard {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background: #ededed;
  color: rgb(0, 0, 0);
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-in-out;
  z-index: 10;
  pointer-events: auto; /* Pastikan sidebar hanya menangkap klik saat terbuka */
}

/* Overlay transparan saat sidebar aktif */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5); /* Transparan hitam */
  z-index: 9; /* Pastikan berada di bawah sidebar */
  pointer-events: auto; /* Pastikan overlay bisa menangkap klik */
}

/* Sidebar transisi */
.sidebar-fade-enter-active,
.sidebar-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.sidebar-fade-enter-from,
.sidebar-fade-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

/* Menu styling */
.dashboard ul {
  list-style: none;
  padding: 0;
}

.dashboard ul li {
  margin: 15px 0;
}

.dashboard ul li a {
  color: rgb(0, 0, 0);
  text-decoration: none;
  font-weight: bold;
}

.dashboard ul li a:hover {
  text-decoration: underline;
}

/* Saat sidebar aktif, nonaktifkan scroll */
body.sidebar-active {
  overflow: hidden;
}
</style>
