<template>
    <div class="container mt-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="fw-bold">TRANSKON - Down Equipment</h4>
        <div class="text-end">
          <h5 class="fw-bold text-primary"></h5>
          <div>{{ currentTime }}</div>
        </div>
      </div>
  
      <!-- Work Group 
      <div class="mb-3">
        <label class="form-label fw-bold">Work Group</label>
        <select class="form-select w-auto">
          <option>all</option>
          <option>Pama</option>
          <option>THies</option>
          <option>Customer</option>
        </select>
      </div> -->
  
      <!-- Status Cards -->
      <div class="row text-center mb-4">
        <div class="col">
          <div class="card border-success">
            <div class="card-body">
              <h3 class="text-success">{{ workingCount }}</h3>
              <p class="fw-bold mb-0">Working</p>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card border-danger">
            <div class="card-body">
              <h3 class="text-danger">{{ smDownCount }}</h3>
              <p class="fw-bold mb-0">SM Down</p>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card border-warning">
            <div class="card-body">
              <h3 class="text-warning">{{ umDownCount }}</h3>
              <p class="fw-bold mb-0">UM Down</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Equipment Table -->
      <div class="table-responsive">
        <table class="table table-bordered align-middle text-center">
          <thead class="table-primary">
            <tr>
              <th>TK Number</th>
              <th>Vehicle Type</th>
              <th>Comment</th>
              <th>Down Since</th>
              <th>Estimated Return</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in downEquipments" :key="index">
              <td>{{ item.equipment }}</td>
              <td>{{ item.fleet }}</td>
              <td>{{ item.comment }}</td>
              <td>{{ item.downSince }}</td>
              <td>{{ item.estimatedReturn }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <router-link to="/de/dashboard" class="btn btn-danger mt-3">Back to Dashboard</router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        workingCount: 319,
        smDownCount: 0,
        umDownCount: 8,
        currentTime: '',
        downEquipments: [
          {
            equipment: "TK0012",
            fleet: "Mitsubishi Triton DC 4x4",
            comment: "Repair engine overheating, Spare NV12009",
            downSince: "14 Apr 2025 06:45:56",
            estimatedReturn: ""
          },
          {
            equipment: "TK1234",
            fleet: "Mitsubishi Triton DC 4x4",
            comment: "Repair engine overheating, Spare NV12045",
            downSince: "10 Apr 2025 08:34:10",
            estimatedReturn: ""
          },
          {
            equipment: "TK2345",
            fleet: "Mitsubishi Triton DC 4x4",
            comment: "Repair AC problem spare NV9802",
            downSince: "09 Apr 2025 11:47:49",
            estimatedReturn: ""
          },
          {
            equipment: "TK2343",
            fleet: "Mitsubishi Triton DC 4x4",
            comment: "Repair engine overheating",
            downSince: "18 Mar 2025 11:30:33",
            estimatedReturn: "29 Apr 2025 17:30:32"
          },
          {
            equipment: "TK1243",
            fleet: "Mitsubishi Triton DC 4x4",
            comment: "Repair turbo problem, unit spare NV12104",
            downSince: "13 Mar 2025 17:00:00",
            estimatedReturn: "30 Apr 2025 17:55:20"
          },
          {
            equipment: "TK3425",
            fleet: "Mitsubishi Triton DC 4x4",
            comment: "Repair engine low power unit spare NV12017",
            downSince: "23 Feb 2025",
            estimatedReturn: "24 Apr 2025"
          },
          {
            equipment: "TK2132",
            fleet: "Mitsubishi Triton DC 4x4",
            comment: "Repair engine blow -by spare NV12039",
            downSince: "16 Jan 2025",
            estimatedReturn: "25 Apr 2025 17:55:25"
          },
          {
            equipment: "TK2325",
            fleet: "Mitsubishi Triton DC 4x4",
            comment: "Repair engine overheat, Spare NV12056",
            downSince: "13 Sep 2024 07:14:34",
            estimatedReturn: "18 Apr 2025 17:35:23"
          },
        ]
      };
    },
    mounted() {
      this.updateClock();
      setInterval(this.updateClock, 1000);
    },
    methods: {
      updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0");
        this.currentTime = `${hours}:${minutes}:${seconds}`;
      }
    }
  };
  </script>
  
  <style scoped>
  .card h3 {
    font-size: 28px;
  }
  </style>
  