<template>
  <div class="container-fluid pt-4 px-4">
    <div class="row g-4">
      <div
        v-for="(item, index) in dashboardItems"
        :key="item.name"
        class="col-custom position-relative">
       <!-- class="col-sm-6 col-xl-3 position-relative"> -->

        <div class="dashboard-card" @click="toggleDropdown(index)">
          <i :class="item.icon + ' fa-4x text-danger'" class="mb-2"></i>
          <div class="text-center mt-2">
            <p class="mb-0">{{ item.name }}</p>
          </div>
        </div>
        <!-- Dropdown menu -->
        <ul v-if="openDropdown === index" class="dropdown-menu show">
          <li v-for="submenu in item.submenus" :key="submenu.name">
            <a :href="submenu.link">{{ submenu.name }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
const baseUrl = import.meta.env.BASE_URL;
const _dashboardItems = ref([
  {
    name: "Fleet",
    icon: "fas fa-car-side",
    submenus: [
      { name: "List Unit", link: "/list-unit" },
      { name: "Movement", link: "/movement" },
      { name: "Out Run and Return", link: "/out-run" },
      { name: "Disposal", link: "/disposal" },
      { name: "Mining Preparation", link: "/mining-preparation" },
    ],
  },
  {
    name: "Marketing",
    icon: "fa-solid fa-chart-simple",
    submenus: [
      { name: "Master Marketing", link: "/marketing" },
      { name: "Master Contract", link: "/contract" },
      { name: "PO Unit", link: "/po-unit" },
    ],
  },
  {
    name: "Workshop",
    icon: "fas fa-screwdriver-wrench",
    submenus: [
      { name: "Body Repairs", link: "/marketing" },
      { name: "General Repairs", link: "/marketing-e" },
    ],
  },
  {
    name: "Supply Chain",
    icon: "fas fa-link",
    submenus: [
      { name: "Logistics", link: "/about" },
      { name: "Procurement", link: "/supply-chain-procurement" },
    ],
  },
  {
    name: "HR",
    icon: "fas fa-file-signature",
    submenus: [
      { name: "Employee Data", link: "/test" },
      { name: "Payroll", link: "/about" },
    ],
  },
]);

const dashboardItems = computed(() => {
  return _dashboardItems.value.map((category) => ({
    ...category,
    submenus: category.submenus.map((submenu) => ({
      ...submenu,
      link: submenu.link.startsWith("/office")
        ? submenu.link
        : `${baseUrl}${submenu.link}`,
    })),
  }));
});
console.log(dashboardItems);

const openDropdown = ref(null);

const toggleDropdown = (index) => {
  openDropdown.value = openDropdown.value === index ? null : index;
};
</script>

<style scoped>
.dashboard-card {
  background: #ffffff;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  cursor: pointer;
  position: relative;
}
.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
.dashboard-card i {
  color: #007bff;
  transition: color 0.3s ease-in-out, transform 0.3s ease-in-out;
}
.dashboard-card:hover i {
  color: #0056b3;
  transform: scale(1.1);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 5px;
  padding: 10px;
  list-style: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  width: 150px;
  z-index: 10;
  display: block;
}
.dropdown-menu li {
  padding: 8px 0;
  text-align: center;
}
.dropdown-menu a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
  display: block;
}
.dropdown-menu a:hover {
  text-decoration: underline;
  background: #e2e6ea;
  border-radius: 4px;
  padding: 5px;
}

.row {
  display: flex;
  justify-content: space-between; /* Memberi jarak rata antar item */
  flex-wrap: wrap; /* Agar responsif */
}

.col-custom {
  width: calc(100% / 5 - 10px); /* 5 item dalam satu baris */
  max-width: 300px; /* Bisa disesuaikan */
}

</style>
