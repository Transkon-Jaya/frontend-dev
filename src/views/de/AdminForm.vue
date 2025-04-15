<template>
    <div class="container mt-4">
      <div class="card p-4 shadow-sm">
        <h3 class="fw-bold mb-3">Admin Panel - Down Equipment</h3>
  
        <!-- Form Tambah/Edit -->
        <form @submit.prevent="handleSubmit">
          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="form-label">Equipment</label>
              <input v-model="form.equipment" type="text" class="form-control" required />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Fleet</label>
              <input v-model="form.fleet" type="text" class="form-control" required />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Comment</label>
              <input v-model="form.comment" type="text" class="form-control" required />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Down Since</label>
              <input v-model="form.downSince" type="datetime-local" class="form-control" required />
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label">Estimated Return</label>
              <input v-model="form.estimatedReturn" type="datetime-local" class="form-control" />
            </div>
          </div>
  
          <button type="submit" class="btn btn-primary me-2">
            {{ editIndex !== null ? "Update Entry" : "Add Entry" }}
          </button>
          <button type="button" v-if="editIndex !== null" @click="resetForm" class="btn btn-secondary">
            Cancel
          </button>
        </form>
  
        <!-- Table Tampilkan Data -->
        <div class="mt-5">
          <h5 class="fw-bold">Data Down Equipment</h5>
          <table class="table table-bordered mt-3 text-center">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Equipment</th>
                <th>Fleet</th>
                <th>Comment</th>
                <th>Down Since</th>
                <th>Estimated Return</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in dataList" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.equipment }}</td>
                <td>{{ item.fleet }}</td>
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
        editIndex: null
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
      }
    }
  };
  </script>
  
  <style scoped>
  table td,
  table th {
    vertical-align: middle;
  }
  </style>
  