<template>
  <div class="row">
    <div class="col-xl-6 mx-auto">
      <div class="card">
        <div class="card-header px-4 py-3">
          <h5 class="mb-0">User Settings</h5>
        </div>
        <div class="card-body p-4">
          <form
            @submit.prevent="submitForm"
            class="row g-3 needs-validation"
            novalidate
          >
            <div class="col-md-12">
              <label for="Name" class="form-label">Name</label>
              <input
                v-model="user.firstName"
                type="text"
                class="form-control"
                id="firstName"
                required
              />
            </div>
            
            <div class="col-md-12">
              <label for="phone" class="form-label">E-mail</label>
              <input
                v-model="user.phone"
                type="text"
                class="form-control"
                id="email"
                required
              />
            </div>
            <div class="col-md-12">
              <label for="phone" class="form-label">Phone</label>
              <input
                v-model="user.phone"
                type="text"
                class="form-control"
                id="phone"
                required
              />
            </div>
            <div class="col-md-12">
              <label for="department" class="form-label">Department</label>
              <input
                v-model="user.phone"
                type="text"
                class="form-control"
                id="department"
                required
              />
            </div>
            <div class="col-md-12">
              <label for="position" class="form-label">Position</label>
              <input
                v-model="user.phone"
                type="text"
                class="form-control"
                id="position"
                required
              />
            </div>
            <div class="col-md-12">
              <label for="userName" class="form-label">User Name</label>
              <input
                v-model="user.userName"
                type="userName"
                class="form-control"
                id="userName"
                required
              />
            </div>
            <div class="col-md-12">
              <label for="password" class="form-label">Password</label>
              <input
                v-model="user.password"
                type="password"
                class="form-control"
                id="password"
                required
              />
            </div>
            
            <!-- Upload Foto -->
            <div class="col-md-12">
              <label for="photo" class="form-label">Upload Photo</label>
              <input type="file" class="form-control" id="photo" @change="handleFileUpload" accept="image/*" />
              <div v-if="previewImage" class="mt-3">
                <img :src="previewImage" alt="Preview" class="img-thumbnail" style="max-width: 200px;" />
              </div>
            </div>

             <div class="col-md-12 mt-4 mb-3 d-flex gap-3">
              <button type="submit" class="btn btn-primary">Submit</button>
              <button type="reset" class="btn btn-secondary" @click="resetForm">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const user = ref({
  Name: "",
  //lastName: "",
  email: "",
  phone: "",
  department: "",
  position: "",
  userName: "",
  password: "",
 department: "",
});

const submitForm = () => {
  console.log("User Data Submitted:", user.value);
};

const resetForm = () => {
  user.value = {
    Name: "",
    //lastName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    userName: "",
    password: "",
    department: "",
  
  };
};
</script>
