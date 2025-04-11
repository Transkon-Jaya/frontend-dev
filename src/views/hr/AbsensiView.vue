<template>
    <div class="container mt-4">
      <div class="card p-4 shadow-sm">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="fw-bold">Employee Attendance</h2>
          <input 
            type="text" 
            class="form-control w-25" 
            placeholder="Search employee..." 
            v-model="searchQuery" 
          />
        </div>
        <div><button @click="exportToExcel">Download data</button></div>
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr class="filter-row">
                <th>
                  <input 
                    type="text" 
                    class="form-control form-control-sm" 
                    placeholder="Filter name" 
                    v-model="columnFilters.name" 
                  />
                </th>
                <th>
                  <select 
                    class="form-select form-select-sm" 
                    v-model="columnFilters.dept"
                  >
                    <option value="">All Departments</option>
                    <option 
                      v-for="dept in uniqueDepts" 
                      :value="dept"
                    >
                      {{ dept }}
                    </option>
                  </select>
                </th>
                <th>
                  <select 
                    class="form-select form-select-sm" 
                    v-model="columnFilters.position"
                  >
                    <option value="">All Positions</option>
                    <option 
                      v-for="position in uniquePositions" 
                      :value="position"
                    >
                      {{ position }}
                    </option>
                  </select>
                </th>
                <th></th>
                <th></th>
                <th>
                  <select 
                    class="form-select form-select-sm" 
                    v-model="columnFilters.status"
                  >
                    <option value="">All Status</option>
                    <option value="Done">Present</option>
                    <option value="Izin">Permission</option>
                    <option value="Belum Absen">Absent</option>
                  </select>
                </th>
              </tr>
              <tr>
                <th>Employee Name</th>
                <th class="text-center">Department</th>
                <th class="text-center">Position</th>
                <th class="text-center">In</th>
                <th class="text-center">Out</th>
                <th class="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="employee in filteredEmployees" 
                :key="employee.id" 
                @click="goToDetail(employee.id)" 
                class="clickable-row"
              >
                <td>{{ employee.name }}</td>
                <td class="text-center">{{ employee.dept }}</td>
                <td class="text-center">{{ employee.position }}</td>
                <td class="text-center">{{ employee.in }}</td>
                <td class="text-center">{{ employee.out }}</td>
                <td class="text-center">
                  <span :class="getStatusClass(employee.status)">
                    {{ getStatusText(employee.status) }}
                  </span>
                </td>
              </tr>
              <tr v-if="filteredEmployees.length === 0">
                <td colspan="6" class="text-center text-muted py-4">
                  No employees found matching your criteria
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-3 text-end">
          Showing {{ filteredEmployees.length }} of {{ employees.length }} employees
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import { RouterLink } from 'vue-router';
  
  export default {
    data() {
      return {
        searchQuery: "",
        columnFilters: { 
          name: "", 
          dept: "", 
          position: "",
          in: "", 
          out: "",
          status: "" 
        },
        attendanceFilter: { operator: ">", value: null },
        employees: [
          { id: 1, name: "Budi Setyawan", dept: "HR", position: "Head Dept", in: "7:54", out: "17:01", status: "Done" },
          { id: 2, name: "Muhammad Furqon", dept: "SP", position: "Manager", in: "7:54", out: "17:01", status: "Done" },
          { id: 3, name: "Rita Sugiarto", dept: "GA", position: "Admin Staff", in: "", out: "", status: "Belum Absen" },
          { id: 4, name: "Bambang Utomo", dept: "CRM", position: "Office Staff", in: "7:54", out: "17:01", status: "Done" },
          { id: 5, name: "Joko Widodo", dept: "HR", position: "Staff", in: "7:54", out: "17:01", status: "Done" }
        ]
      };
    },
    computed: {
      uniqueDepts() {
        return [...new Set(this.employees.map(item => item.dept))];
      },
      uniquePositions() {
        return [...new Set(this.employees.map(item => item.position))];
      },
      uniqueCategories() {
        return [...new Set(this.employees.map(item => item.in))];
      },
      uniqueCategories() {
        return [...new Set(this.employees.map(item => item.out))];
      },
      filteredEmployees() {
        return this.employees.filter(employee => {
          // Search query filter
          if (this.searchQuery && 
              !employee.name.toLowerCase().includes(this.searchQuery.toLowerCase())) {
            return false;
          }
          
          // Column filters
          if (this.columnFilters.name && 
              !employee.name.toLowerCase().includes(this.columnFilters.name.toLowerCase())) {
            return false;
          }
          
          if (this.columnFilters.dept && 
              employee.dept !== this.columnFilters.dept) {
            return false;
          }
          
          if (this.columnFilters.position && 
              employee.position !== this.columnFilters.position) {
            return false;
          }
          
          if (this.columnFilters.category && 
              employee.category !== this.columnFilters.category) {
            return false;
          }
          
          if (this.columnFilters.status && 
              employee.status !== this.columnFilters.status) {
            return false;
          }
          
          // Attendance (In) filter
          if (this.attendanceFilter.value !== null && this.attendanceFilter.value !== "") {
            const inCount = employee.in;
            const value = Number(this.attendanceFilter.value);
            
            switch(this.attendanceFilter.operator) {
              case ">": if (inCount <= value) return false; break;
              case "<": if (inCount >= value) return false; break;
              case "=": if (inCount !== value) return false; break;
              case ">=": if (inCount < value) return false; break;
              case "<=": if (inCount > value) return false; break;
            }
          }
          
          return true;
        });
      }
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
      },
      goToDetail(id) {
        this.$router.push({ name: "EmployeeDetail", params: { id } });
      }
    }
  };
  </script>
  
  <style scoped>
  .clickable-row {
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .clickable-row:hover {
    background-color: rgba(0, 123, 255, 0.05);
  }
  
  .badge {
    font-size: 0.8rem;
    padding: 0.35em 0.65em;
    font-weight: 500;
    border-radius: 0.25rem;
    display: inline-block;
    min-width: 70px;
  }
  
  .filter-row th {
    padding-bottom: 0.5rem;
    background-color: #f8f9fa;
  }
  
  .form-control-sm, 
  .form-select-sm {
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
  }
  
  .text-center {
    text-align: center;
  }
  
  .table th {
    vertical-align: middle;
    font-weight: 600;
    white-space: nowrap;
  }
  
  .table-responsive {
    overflow-x: auto;
  }
  
  .w-25 {
    min-width: 200px;
  }
  
  @media (max-width: 768px) {
    .w-25 {
      width: 100% !important;
      margin-top: 10px;
    }
    
    .d-flex {
      flex-direction: column;
    }
  }
  button {
  padding: 3px 8px;
  margin: 5px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 0.25rem;
}
button:hover {
  background-color: #218838;
}
  </style>