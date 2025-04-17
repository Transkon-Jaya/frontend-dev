<template>
  <div>
    <!-- Overlay saat sidebar aktif -->
    <div v-if="showDashboard" class="overlay" @click="hideDashboard"></div>

    <!-- Sidebar -->
    <transition name="sidebar-fade">
      <div v-if="showDashboard" class="dashboard" @mouseleave="hideDashboard">
        <h2 class="sidebar-title">
          <i class=""></i> Transkon Jaya
        </h2>

        <ul>
          <li v-for="(menu, index) in menus" :key="index">
            <div @click="toggleDropdown(index)" class="menu-title">
            <i :class="menu.icon + ' menu-icon'"></i>
            {{ menu.title }}
            <i
              :class="[
                'fas',
                'chevron-icon',
                menu.open ? 'fa-chevron-down rotate' : 'fa-chevron-right'
              ]"
            ></i>
          </div>


            <ul v-if="menu.open" class="submenu">
              <li
                v-for="(submenu, subIndex) in menu.submenus"
                :key="subIndex"
              >
                <router-link :to="submenu.link" active-class="active-link">
                  {{ submenu.name }}
                </router-link>
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

const menus = ref([
  {
    title: "Fleet",
    icon: "fas fa-truck",
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
    icon: "fas fa-bullhorn",
    open: false,
    submenus: [
      { name: "Master Marketing", link: "/marketing" },
      { name: "Master Contract", link: "/contract" },
    ],
  },
  {
    title: "Operation",
    icon: "fas fa-tools",
    open: false,
    submenus: [
      { name: "Body Repairs", link: "/workshop-repairs" },
      { name: "General Repairs", link: "/workshop-inventory" },
    ],
  },
  {
    title: "Supply Chain",
    icon: "fas fa-boxes",
    open: false,
    submenus: [
      { name: "Logistics", link: "/supply-chain-logistics" },
      { name: "Procurement", link: "/supply-chain-procurement" },
    ],
  },
  {
    title: "HR",
    icon: "fas fa-user-friends",
    open: false,
    submenus: [
      { name: "Employee Data", link: "/hr-employee" },
      { name: "Payroll", link: "/hr-payroll" },
    ],
  },
]);

const handleMouseMove = (event) => {
  if (event.clientX < 20 && !showDashboard.value) {
    showDashboard.value = true;
  }
};

const hideDashboard = () => {
  showDashboard.value = false;
};

const toggleDropdown = (index) => {
  menus.value[index].open = !menus.value[index].open;
};

onMounted(() => {
  window.addEventListener("mousemove", handleMouseMove);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", handleMouseMove);
});
</script>

<style scoped>
.dashboard {
  overflow-y: auto;
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  background: linear-gradient(180deg, #f9f9f9, #e6e6e6);
  color: #2c3e50;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease-in-out;
  z-index: 10;
}

.sidebar-title {
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 60px;
  color: #34495e;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9;
}

.sidebar-fade-enter-active,
.sidebar-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.sidebar-fade-enter-from,
.sidebar-fade-leave-to {
  opacity: 0;
  transform: translateX(-260px);
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 12px 16px;
  font-weight: 600;
  background: #dde1e7;
  border-radius: 8px;
  transition: background 0.3s;
  margin-bottom: 5px;
}

.menu-title:hover {
  background: #cfd4da;
}

.chevron-icon {
  transition: transform 0.3s;
}
.rotate {
  transform: rotate(90deg);
}

.submenu {
  padding-left: 15px;
  margin-top: 8px;
}

.submenu li {
  margin: 5px 0;
}

.submenu li a {
  display: block;
  padding: 8px 12px;
  color: #2c3e50;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.3s;
}

.submenu li a:hover {
  background: #bdc3c7;
}

.active-link {
  background: #95a5a6;
  color: white;
  font-weight: bold;
}
.menu-icon {
  margin-right: 10px;
  width: 20px;
}
/* Optional: Responsive */
@media (max-width: 768px) {
  .dashboard {
    width: 50%;
  }
}

</style>
