<template>
    <div class="container mt-4">
      <div class="card p-4 shadow-sm">
        <h2 class="fw-bold">Employee Attendance Detail</h2>
        <div v-if="employee">
          <div class="d-flex align-items-center mb-3">
            <img :src="employee.image" alt="Employee Photo" class="detail-img me-3" />
            <div>
              <p class="mb-1"><strong>Name:</strong> {{ employee.name }}</p>
              <p class="mb-1"><strong>Department:</strong> {{ employee.dept }}</p>
              <p class="mb-1"><strong>Position:</strong> {{ employee.position }}</p>
              <p class="mb-1"><strong>In:</strong> {{ employee.in }}</p>
              <p class="mb-1"><strong>Out:</strong> {{ employee.out }}</p>
              <p class="mb-1"><strong>Status:</strong> 
                <span :class="getStatusClass(employee.status)">
                  {{ getStatusText(employee.status) }}
                </span>
              </p>
            </div>
          </div>
  
          <!-- Attendance History -->
            <h4 class="fw-bold mt-4">Attendance History</h4>
            <table class="table table-bordered mt-3">
            <thead class="table-light">
            <tr>
                <th>Date</th>
                <th>In</th>
                <th>Out</th>
                <th>Status</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(entry, index) in employee.attendanceHistory" :key="index">
                <td>{{ entry.date }}</td>
                <td>{{ entry.in }}</td>
                <td>{{ entry.out }}</td>
                <td>
                <span :class="getStatusClass(entry.status)">
                    {{ getStatusText(entry.status) }}
                </span>
                </td>
            </tr>
            </tbody>
            </table>

        </div>
        <router-link to="/hr/absensi" class="btn btn-danger mt-3">Back to Attendance List</router-link>
      </div>
    </div>
  </template>
  
  <script>
  import userPhoto from "@/assets/images/avatars/10.png";
  
  export default {
    data() {
      return {
        employee: {
          id: 1,
          name: "Sarah Azahra",
          dept: "HR",
          position: "Head Dept",
          image: userPhoto,
          in: "07:54",
          out: "17:01",
          status: "Done",
          attendanceHistory: [
            { date: "2025-04-01", in: "07:54", out: "17:01", status: "Done" },
            { date: "2025-04-02", in: "07:58", out: "17:05", status: "Done" },
            { date: "2025-04-03", in: "-", out: "-", status: "Izin" },
            { date: "2025-04-04", in: "-", out: "-", status: "Belum Absen" },
            ]
        }
      };
    },
    methods: {
      getStatusClass(status) {
        return {
          'Done': 'badge bg-success',
          'Izin': 'badge bg-warning text-dark',
          'Belum Absen': 'badge bg-danger'
        }[status] || 'badge bg-secondary';
      },
      getStatusText(status) {
        return {
          'Done': 'Present',
          'Izin': 'Permission',
          'Belum Absen': 'Absent'
        }[status] || status;
      }
    }
  };
  </script>
  
  <style scoped>
  .detail-img {
    width: 200px;
    height: 200px;
    border-radius: 5px;
    object-fit: cover;
  }
  .badge {
    font-size: 14px;
    padding: 5px 10px;
    width: 100px;
  }
  .table th, .table td {
    vertical-align: middle;
    text-align: center;
  }
  </style>
  