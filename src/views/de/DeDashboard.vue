<template>
    <div class="content" :style="{ paddingTop: showHeader ? '100px' : '0px' }">
      <!-- Header -->
      <div class="mb-2">
        <h1 class="h4 fw-bold">Down Equipment Dashboard</h1>
      </div>
  
      <!-- Filter di bawah judul -->
      <div class="mb-4">
        <div class="d-flex flex-wrap gap-2 align-items-center">
          <label for="date-range" class="form-label mb-0">Select Range:</label>
          
          <input type="date" v-model="startDate" class="form-control form-control-sm w-auto" />
          <span class="mx-1">to</span>
          <input type="date" v-model="endDate" class="form-control form-control-sm w-auto" />
          <button @click="applyFilter" class="btn btn-sm btn-danger">Apply</button>
        </div>
      </div>
  
      <!-- Table -->
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Site Summary</h5>
          <div class="table-responsive">
            <table class="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>Site Name</th>
                  <th>Customer</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="site in filteredSites" :key="site.name">
                  <td>{{ site.name }}</td>
                  <td>{{ site.customer }}</td>
                  <td>{{ site.location }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- Charts -->
      <div class="row g-4 mb-4">
        <!-- UM Down by Site -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">UM Down by Site</h5>
              <canvas ref="umChart" class="w-100" style="height: 300px;"></canvas>
            </div>
          </div>
        </div>

        <!-- Status Summary -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">Status Summary</h5>
              <canvas ref="statusChart" class="w-100" style="height: 300px;"></canvas>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Daily Trend -->
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Daily Trend</h5>
          <canvas ref="trendChart" class="w-100" style="height: 300px;"></canvas>
        </div>
      </div>
  
      
    <div>
        <router-link to="/de/down-equipment" class="btn btn-danger mt-3">Back to Down Equipment</router-link>
      </div>
    </div>
  </template>
  
  
  
  
  <script>
  import { onMounted, ref } from "vue";
  import { Chart, registerables } from 'chart.js';
  Chart.register(...registerables);
  
  export default {
    setup() {
      const startDate = ref("2025-04-01");
      const endDate = ref("2025-04-10");
      const filterType = ref("daily");
      const statusChart = ref(null);
      const umChart = ref(null);
      const trendChart = ref(null);
  
      const sites = ref([
        { name: "Site A", customer: "Customer 1", location: "Location A" },
        { name: "Site B", customer: "Customer 2", location: "Location B" },
        { name: "Site C", customer: "Customer 3", location: "Location C" },
        { name: "Site D", customer: "Customer 4", location: "Location D" },
      ]);
  
      const filteredSites = ref([...sites.value]);
  
      const applyFilter = () => {
        renderCharts();
      };
  
      const renderCharts = () => {
        if (statusChart.value) statusChart.value.destroy();
        if (umChart.value) umChart.value.destroy();
        if (trendChart.value) trendChart.value.destroy();
  
        const ctx1 = document.querySelector("canvas[ref='statusChart']") || document.querySelectorAll("canvas")[1];
        statusChart.value = new Chart(ctx1, {
          type: "pie",
          data: {
            labels: ["Running", "Breakdown", "Standby"],
            datasets: [{
              data: [12, 8, 5],
              backgroundColor: ["#22c55e", "#ef4444", "#facc15"]
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
  
        const ctx2 = document.querySelector("canvas[ref='umChart']") || document.querySelectorAll("canvas")[0];
        umChart.value = new Chart(ctx2, {
          type: "bar",
          data: {
            labels: ["Site A", "Site B", "Site C", "Site D"],
            datasets: [{
              label: "UM Down",
              data: [5, 10, 3, 3],
              backgroundColor: "#3b82f6"
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
  
        const ctx3 = document.querySelector("canvas[ref='trendChart']") || document.querySelectorAll("canvas")[2];
        trendChart.value = new Chart(ctx3, {
          type: "line",
          data: {
            labels: ["Apr 1", "Apr 2", "Apr 3", "Apr 4", "Apr 5", "Apr 6", "Apr 7", "Apr 8", "Apr 9", "Apr 10"],
            datasets: [{
              label: "Units Down",
              data: [3, 5, 2, 4, 6, 5, 3, 4, 2, 1],
              fill: false,
              borderColor: "#10b981",
              tension: 0.4
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      };
  
      onMounted(() => {
        renderCharts();
      });
  
      return {
        startDate,
        endDate,
        filterType,
        filteredSites,
        applyFilter,
      };
    }
  };
  </script>
  
  <style scoped>
  canvas {
    width: 100% !important;
    max-height: 300px;
  }
  </style>