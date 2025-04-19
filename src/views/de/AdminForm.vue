<template>
  <div class="container mt-4">
    <div class="card p-4 shadow-sm">
      <h3 class="fw-bold mb-4">Admin Panel - Down Equipment</h3>

      <!-- Form Input -->
      <form @submit.prevent="handleSubmit">
        <div class="row">
          <!-- Equipment -->
          <div class="col-md-4 mb-5">
            <label class="form-label">TK Number</label>
            <select v-model="form.equipment" class="form-select" required>
              <option disabled value="">Select TK Number</option>
              <option v-for="item in equipmentOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </div>

          <!-- Fleet / Vehicle Type -->
          <div class="col-md-4 mb-3">
            <label class="form-label">Vehicle Type</label>
            <input v-model="form.comment" type="text" class="form-control" required />
          </div>

          <!-- Comment -->
          <div class="col-md-4 mb-3">
            <label class="form-label">Comment</label>
            <input v-model="form.comment" type="text" class="form-control" required />
          </div>

          <!-- Down Since -->
          <div class="col-md-4 mb-3">
            <label class="form-label">Down Since</label>
            <input v-model="form.downSince" type="datetime-local" class="form-control" required />
          </div>

          <!-- Estimated Return -->
          <div class="col-md-4 mb-3">
            <label class="form-label">Estimated Return</label>
            <input v-model="form.estimatedReturn" type="datetime-local" class="form-control" />
          </div>
        </div>

        <!-- Tombol Submit -->
        <div class="mb-4">
          <button type="submit" class="btn btn-danger me-2">
            {{ editIndex !== null ? "Update Entry" : "Add Entry" }}
          </button>
          <button type="button" v-if="editIndex !== null" @click="resetForm" class="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>

      <!-- Table Data -->
      <div class="mt-4">
        <h5 class="fw-bold">Data Down Equipment</h5>
        <table class="table table-bordered text-center mt-3">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>TK Number</th>
              <th>Vehicle Type</th>
              <th>Comment</th>
              <th>Down Since</th>
              <th>Estimated Return</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in dataList" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ getEquipmentLabel(item.equipment) }}</td>
              <td>{{ getFleetLabel(item.fleet) }}</td>
              <td>{{ item.comment }}</td>
              <td>{{ item.downSince }}</td>
              <td>{{ item.estimatedReturn }}</td>
              <td>
                <button class="btn btn-sm btn-warning me-2" @click="editEntry(index)">Edit</button>
                <button class="btn btn-sm btn-danger" @click="deleteEntry(index)">Delete</button>
              </td>
            </tr>
            <tr v-if="dataList.length === 0">
              <td colspan="7">No data available.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        equipment: '',
        fleet: '',
        comment: '',
        downSince: '',
        estimatedReturn: ''
      },
      dataList: [],
      editIndex: null,
      equipmentOptions: [
        { value: 'TK-001', label: 'TK001' },
        { value: 'TK-002', label: 'TK002' },
        { value: 'TK-003', label: 'TK003' },
        { value: 'TK-004', label: 'TK004' },
        { value: 'TK-005', label: 'TK005' }
      ],
      fleetOptions: [
        { value: 'DT', label: 'Dump Truck' },
        { value: 'EXC', label: 'Excavator' },
        { value: 'GRD', label: 'Grader' },
        { value: 'BLC', label: 'Bulldozer' },
        { value: 'WTR', label: 'Water Truck' }
      ]
    };
  },
  methods: {
    handleSubmit() {
      if (this.editIndex !== null) {
        this.dataList[this.editIndex] = { ...this.form };
      } else {
        this.dataList.push({ ...this.form });
      }
      this.resetForm();
    },
    editEntry(index) {
      this.form = { ...this.dataList[index] };
      this.editIndex = index;
    },
    deleteEntry(index) {
      if (confirm("Are you sure to delete this entry?")) {
        this.dataList.splice(index, 1);
      }
    },
    resetForm() {
      this.form = {
        equipment: '',
        fleet: '',
        comment: '',
        downSince: '',
        estimatedReturn: ''
      };
      this.editIndex = null;
    },
    getEquipmentLabel(value) {
      const found = this.equipmentOptions.find(item => item.value === value);
      return found ? found.label : value;
    },
    getFleetLabel(value) {
      const found = this.fleetOptions.find(item => item.value === value);
      return found ? found.label : value;
    }
  }
};
</script>

<style scoped>
table td,
table th {
  vertical-align: middle;
}
.form-select, .form-control {
  height: 38px; /* Sesuaikan jika perlu */
}
</style>
