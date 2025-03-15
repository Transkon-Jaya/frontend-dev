<template>
  <div class="container-fluid pt-4 px-4">
    <div class="row g-4">
      <div
        v-for="(item, index) in dashboardItems"
        :key="item.name"
        class="col-sm-6 col-xl-3 position-relative"
      >
        <div class="dashboard-card" @click="toggleDropdown(index)">
          <i :class="item.icon + ' fa-3x text-primary'" class="mb-2"></i>
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
import { ref } from "vue";

const dashboardItems = ref([
  {
    name: "Fleet",
    icon: "fas fa-car-side",
    submenus: [
      { name: "Movement", link: "/movement" },
      { name: "Mining Preparation", link: "/mining-preparation" },
      { name: "Disposal", link: "/disposal" },
      { name: "Marketing", link: "/marketing" },
      { name: "PO List", link: "/po-list" },
    ],
  },
  {
    name: "HR",
    icon: "fas fa-file-signature",
    submenus: [
      { name: "Employee Data", link: "/hr-employee" },
      { name: "Payroll", link: "/hr-payroll" },
    ],
  },
  {
    name: "Operation",
    icon: "fas fa-screwdriver-wrench",
    submenus: [
      { name: "Repairs", link: "/workshop-repairs" },
      { name: "Inventory", link: "/workshop-inventory" },
    ],
  },
  {
    name: "Supply Chain",
    icon: "fas fa-link",
    submenus: [
      { name: "Logistics", link: "/supply-chain-logistics" },
      { name: "Procurement", link: "/supply-chain-procurement" },
    ],
  },
]);

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
</style>
