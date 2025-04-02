<template>
  <div>
    <!-- Overlay saat sidebar aktif -->
    <div v-if="showDashboard" class="overlay" @click="hideDashboard"></div>

    <!-- Sidebar -->
    <transition name="sidebar-fade">
      <div v-if="showDashboard" class="dashboard" @mouseleave="hideDashboard">
        <h2 class="sidebar-title">Transkon Jaya</h2>
        <ul>
          <li v-for="(menu, index) in menus" :key="index">
            <div @click="toggleDropdown(index)" class="menu-title">
              {{ menu.title }}
              <i
                :class="
                  menu.open ? 'fas fa-chevron-down' : 'fas fa-chevron-right'
                "
              ></i>
            </div>
            <ul v-if="menu.open" class="submenu">
              <li v-for="(submenu, subIndex) in menu.submenus" :key="subIndex">
                <router-link :to="submenu.link">{{ submenu.name }}</router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const showDashboard = ref(false);

// Daftar menu utama dan submenunya
const menus = ref([
  {
    title: "Fleet",
    open: false,
    submenus: [
      { name: "List Unit", link: "/list-unit" },
      { name: "Movement", link: "/movement" },
      { name: "Out Run and Return", link: "/out-run" },
      { name: "Disposal", link: "/disposal" },
      { name: "Mining Preparation", link: "/mining-preparation" },
    ],
  },
  {
    title: "Marketing",
    open: false,
    submenus: [
      { name: "Master Marketing", link: "/marketing" },
      { name: "Master Contract", link: "/contract" },
    ],
  },
  {
    title: "Operation",
    open: false,
    submenus: [
      { name: "Body Repairs", link: "/workshop-repairs" },
      { name: "General Repairs", link: "/workshop-inventory" },
    ],
  },
  {
    title: "Supply Chain",
    open: false,
    submenus: [
      { name: "Logistics", link: "/supply-chain-logistics" },
      { name: "Procurement", link: "/supply-chain-procurement" },
    ],
  },
  {
    title: "HR",
    open: false,
    submenus: [
      { name: "Employee Data", link: "/hr-employee" },
      { name: "Payroll", link: "/hr-payroll" },
    ],
  },
]);

// Fungsi untuk menampilkan sidebar jika mouse ke sisi kiri layar
const handleMouseMove = (event) => {
  if (event.clientX < 20 && !showDashboard.value) {
    showDashboard.value = true;
    //document.body.classList.add("sidebar-active");
  }
};

// Fungsi untuk menyembunyikan sidebar saat mouse keluar
const hideDashboard = () => {
  showDashboard.value = false;
  //document.body.classList.remove("sidebar-active");
};

// Fungsi untuk menampilkan atau menyembunyikan submenu
const toggleDropdown = (index) => {
  menus.value[index].open = !menus.value[index].open;
};

// Tambahkan event listener saat komponen dimuat
onMounted(() => {
  window.addEventListener("mousemove", handleMouseMove);
});

// Hapus event listener saat komponen dihancurkan
onUnmounted(() => {
  window.removeEventListener("mousemove", handleMouseMove);
  //document.body.classList.remove("sidebar-active");
});
</script>

<style scoped>
/* Sidebar sebagai overlay */
.dashboard {
  overflow-y: auto;
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
  max-height: 100vh;
}

/* Memberi jarak antara judul sidebar dan menu */
.sidebar-title {
  text-align: center;
  font-size: 24px; /* Perbesar tulisan */
  font-weight: bold;
  margin-bottom: 30px;
  padding: 10px 0;
}

/* Overlay transparan saat sidebar aktif */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9;
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

/* Styling menu utama */
.dashboard ul {
  list-style: none;
  padding: 0;
}

.dashboard ul li {
  margin: 10px 0;
}

/* Gaya untuk tombol dropdown */
.menu-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 12px;
  font-weight: bold;
  background: #dcdcdc;
  border-radius: 8px;
  transition: background 0.3s;
}

.menu-title:hover {
  background: #c0c0c0;
}

/* Styling submenu */
.submenu {
  list-style: none;
  padding-left: 20px;
  margin-top: 5px;
}

.submenu li {
  padding: 8px 0;
}

.submenu li a {
  color: rgb(0, 0, 0);
  text-decoration: none;
  display: block;
  padding: 8px;
  border-radius: 5px;
  transition: background 0.3s;
}

.submenu li a:hover {
  background: #b0b0b0;
}

/* Saat sidebar aktif, nonaktifkan scroll */
/* body.sidebar-active {
  overflow: hidden;
} */
</style>
