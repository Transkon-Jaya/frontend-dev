<template>
  <div class="container-fluid pt-4 px-4">
    <div class="row g-4">
      <div
        v-for="item in dashboardItems"
        :key="item.name"
        class="col-sm-6 col-xl-3"
      >
        <div class="dashboard-card">
          <a :href="item.link">
            <i :class="item.icon + ' fa-3x text-primary'"></i>
          </a>
          <div class="text-center mt-2">
            <p class="mb-0">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const dashboardItems = ref([
  { name: "Fleet", link: "/marketing", icon: "fas fa-car-side" },
  { name: "HR", link: "/hr", icon: "fas fa-file-signature" },
  { name: "Workshop", link: "/workshop", icon: "fas fa-screwdriver-wrench" },
  { name: "Supply Chain", link: "/supply-chain", icon: "fas fa-link" },
]);
</script>

<style scoped>
/* Styling untuk kotak menu */
.dashboard-card {
  background: #ffffff;
  border-radius: 15px; /* Sudut membulat */
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Efek bayangan */
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

/* Hover Effect */
.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Ikon styling */
.dashboard-card i {
  color: #007bff;
  transition: color 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.dashboard-card:hover i {
  color: #0056b3;
  transform: scale(1.1);
}

/* Teks styling */
.dashboard-card p {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
</style>
