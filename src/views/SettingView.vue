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
            <div class="col-md-6">
              <label for="firstName" class="form-label">First Name</label>
              <input
                v-model="user.firstName"
                type="text"
                class="form-control"
                id="firstName"
                required
              />
            </div>
            <div class="col-md-6">
              <label for="lastName" class="form-label">Last Name</label>
              <input
                v-model="user.lastName"
                type="text"
                class="form-control"
                id="lastName"
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
            <div class="col-md-12">
              <label class="form-label">Gender</label>
              <div class="d-flex gap-3">
                <div class="form-check">
                  <input
                    v-model="user.gender"
                    type="radio"
                    class="form-check-input"
                    id="male"
                    value="Male"
                    required
                  />
                  <label class="form-check-label" for="male">Male</label>
                </div>
                <div class="form-check">
                  <input
                    v-model="user.gender"
                    type="radio"
                    class="form-check-input"
                    id="female"
                    value="Female"
                    required
                  />
                  <label class="form-check-label" for="female">Female</label>
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <label for="dob" class="form-label">Date of Birth</label>
              <input
                v-model="user.dob"
                type="date"
                class="form-control"
                id="dob"
                required
              />
            </div>
            <div class="col-md-12 mb-4">
                <label for="Department" class="form-label">Department</label>
                <select
                    v-model="user.Department"
                    class="form-select"
                    id="Department"
                    required
                >
                    <option value="">Select a department</option>
                    <option>Fleet</option>
                    <option>Marketing</option>
                    <option>Oprasional</option>
                    <option>Supplay Chain</option>
                    <option>HR</option>
                </select>
                </div>

           <!--
            <div class="col-md-12">
              <label for="address" class="form-label">Address</label>
              <textarea
                v-model="user.address"
                class="form-control"
                id="address"
                rows="3"
                required
              ></textarea>
            </div>
           
            <div class="col-md-12 mb-4">
              <div class="form-check">
                <input
                  v-model="user.agree"
                  type="checkbox"
                  class="form-check-input"
                  id="agree"
                  required/>
                <label class="form-check-label" for="agree">Agree to terms and conditions</label>
              </div>
            </div>
             -->
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
  firstName: "",
  lastName: "",
  phone: "",
  userName: "",
  password: "",
  gender: "",
  dob: "",
  department: "",
  //address: "",
  //agree: false,
});

const submitForm = () => {
  console.log("User Data Submitted:", user.value);
};

const resetForm = () => {
  user.value = {
    firstName: "",
    lastName: "",
    phone: "",
    userName: "",
    password: "",
    gender: "",
    dob: "",
    department: "",
    //address: "",
    //agree: false,
  };
};
</script>
