<template>
  <div class="content" :style="{ paddingTop: showHeader ? '100px' : '0px' }">
    <!-- Header -->
    <div class="mb-2">
      <h1 class="h4 fw-bold">Down Equipment Dashboard</h1>
    </div>

    <!-- Filter dan Tabs -->
    <div class="mb-4">
      <div class="d-flex flex-wrap align-items-center gap-3 mb-3">
        <label>Select Range:</label>
        <input type="date" v-model="startDate" class="form-control form-control-sm w-auto" />
        <span>to</span>
        <input type="date" v-model="endDate" class="form-control form-control-sm w-auto" />
        <button @click="applyFilter" class="btn btn-sm btn-danger">Apply</button>
      </div>

      <!-- Tab Navigasi -->
      <ul class="nav nav-tabs">
        <li class="nav-item" v-for="tab in tabs" :key="tab.value">
          <button
            class="nav-link"
            :class="{ active: currentTab === tab.value }"
            @click="currentTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Site Summary -->
    <div v-if="currentTab === '' || currentTab === 'site-summary'" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title text-danger">Site Summary</h5>
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

    <!-- Charts Section -->
    <div v-if="currentTab === '' || ['um', 'status'].includes(currentTab)" class="row g-4 mb-4">
      <!-- UM Down by Site -->
      <div v-if="currentTab === '' || currentTab === 'um'" class="col-md-6">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title text-danger">Unit Break Down by Site</h5>
            <canvas ref="umChartRef" class="w-100" style="height: 300px;"></canvas>
          </div>
        </div>
      </div>

      <!-- Status Summary -->
      <div v-if="currentTab === '' || currentTab === 'status'" class="col-md-6">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title text-danger">Status Summary</h5>
            <canvas ref="statusChartRef" class="w-100" style="height: 300px;"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Daily Trend -->
    <div v-if="currentTab === '' || currentTab === 'trend'" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title text-danger">Daily Trend</h5>
        <canvas ref="trendChartRef" class="w-100" style="height: 300px;"></canvas>
      </div>
    </div>

    <!-- Back Button -->
    <div>
      <router-link to="/de/down-equipment" class="btn btn-danger mt-3">Back to Down Equipment</router-link>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(...registerables, ChartDataLabels);

export default {
  setup() {
    const startDate = ref("2025-04-01");
    const endDate = ref("2025-04-10");
    const currentTab = ref(""); // '' = all

    const tabs = [
      { label: "All", value: "" },
      { label: "Site Summary", value: "site-summary" },
      { label: "Unit Break Down by Site", value: "um" },
      { label: "Status Summary", value: "status" },
      { label: "Daily Trend", value: "trend" },
    ];

    // Refs untuk chart instances
    const statusChart = ref(null);
    const umChart = ref(null);
    const trendChart = ref(null);
    
    // Refs untuk canvas elements
    const statusChartRef = ref(null);
    const umChartRef = ref(null);
    const trendChartRef = ref(null);

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

    const renderCharts = async () => {
      await nextTick(); // Tunggu hingga DOM diperbarui
      
      // UM Down by Site Chart
      if (currentTab.value === '' || currentTab.value === 'um') {
        if (umChart.value) umChart.value.destroy();
        if (umChartRef.value) {
          umChart.value = new Chart(umChartRef.value.getContext('2d'), {
            type: "bar",
            data: {
              labels: ["Site A", "Site B", "Site C", "Site D"],
              datasets: [{
                label: "Unit Down",
                data: [5, 10, 3, 3],
                backgroundColor: "#bb01018e",
              }],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
            },
          });
        }
      }

      // Status Summary Chart
      if (currentTab.value === '' || currentTab.value === 'status') {
        if (statusChart.value) statusChart.value.destroy();
        if (statusChartRef.value) {
          statusChart.value = new Chart(statusChartRef.value.getContext('2d'), {
            type: "pie",
            data: {
              labels: ["Running", "Breakdown", "Standby"],
              datasets: [{
                data: [12, 8, 5],
                backgroundColor: ["#22c55e", "#ef4444", "#facc15"],
              }],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                datalabels: {
                  color: "#fff",
                  font: { weight: "bold", size: 14 },
                  formatter: (value) => value,
                },
              },
            },
            plugins: [ChartDataLabels],
          });
        }
      }

      // Daily Trend Chart
      if (currentTab.value === '' || currentTab.value === 'trend') {
        if (trendChart.value) trendChart.value.destroy();
        if (trendChartRef.value) {
          trendChart.value = new Chart(trendChartRef.value.getContext('2d'), {
            type: "line",
            data: {
              labels: ["Apr 1", "Apr 2", "Apr 3", "Apr 4", "Apr 5", "Apr 6", "Apr 7", "Apr 8", "Apr 9", "Apr 10"],
              datasets: [{
                label: "Units Down",
                data: [3, 5, 2, 4, 6, 5, 3, 4, 2, 1],
                fill: false,
                borderColor: "#10b981",
                tension: 0.4,
              }],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
            },
          });
        }
      }
    };

    // Watch untuk perubahan tab
    watch(currentTab, () => {
      renderCharts();
    });

    // Inisialisasi pertama kali
    onMounted(() => {
      renderCharts();
    });

    // Cleanup sebelum komponen di-unmount
    onBeforeUnmount(() => {
      if (umChart.value) umChart.value.destroy();
      if (statusChart.value) statusChart.value.destroy();
      if (trendChart.value) trendChart.value.destroy();
    });

    return {
      startDate,
      endDate,
      currentTab,
      tabs,
      filteredSites,
      applyFilter,
      statusChartRef,
      umChartRef,
      trendChartRef,
    };
  },
};
</script>

<style scoped>
canvas {
  width: 100% !important;
  max-height: 300px;
}
.nav-tabs .nav-link.active {
  background-color: #dc3545;
  color: #fff;
}
</style>