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
                v-model="user.name"
                type="text"
                class="form-control"
                id="firstName"
                disabled
              />
            </div>
            
            <div class="col-md-12">
              <label for="phone" class="form-label">E-mail</label>
              <input
                v-model="user.email"
                type="text"
                class="form-control"
                id="email"
              />
            </div>
            <div class="col-md-12">
              <label for="phone" class="form-label">Phone</label>
              <input
                v-model="user.phone"
                type="text"
                class="form-control"
                id="phone"
              />
            </div>
            <div class="col-md-12">
              <label for="department" class="form-label">Department</label>
              <input
                v-model="user.department"
                type="text"
                class="form-control"
                id="department"
                disabled
              />
            </div>
            <div class="col-md-12">
              <label for="position" class="form-label">Position</label>
              <input
                v-model="user.position"
                type="text"
                class="form-control"
                id="position"
                disabled
              />
            </div>
            <div class="col-md-12">
              <label for="userName" class="form-label">User Name</label>
              <input
                v-model="user.username"
                type="userName"
                class="form-control"
                id="userName"
                disabled
              />
            </div>
            <div class="col-md-12">
              <label for="password" class="form-label">Password</label>
              <input
                v-model="user.password"
                type="password"
                class="form-control"
                id="password"
              />
            </div>
            <div class="col-md-12">
              <label for="confirmationPassword" class="form-label">Confirm Password</label>
              <input
                v-model="user.confirmPassword"
                type="password"
                class="form-control"
                id="confirmationPassword"
              />
            </div>
            <small v-if="passwordMismatch" class="text-danger">
              Passwords do not match!
            </small>
            
            <!-- Upload Foto -->
            <div class="col-md-12">
              <label for="photo" class="form-label">Upload Photo</label>
              <input type="file" class="form-control" id="photo" @change="handleFileUpload" accept="image/*" />
              <div v-if="previewImage" class="mt-3">
                <img :src="previewImage" alt="Preview" class="img-thumbnail" style="max-width: 200px;" />
              </div>
            </div>

             <div class="col-md-12 mt-4 mb-3 d-flex gap-3">
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="passwordMismatch"
                >Submit
              </button>
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
import { ref, onMounted, computed } from "vue";
import axios from "axios";

//global variables
import { useUserStore } from "@/stores/user";
const userData = useUserStore();

// api
const urlProfile = userData.apiBaseUrl + "/profile";

const loadingString = "Loading...";

const user = ref({
  name: loadingString,
  email: loadingString,
  phone: loadingString,
  department: loadingString,
  position: loadingString,
  username: loadingString,
  password: "",
  confirmPassword: "",
});

const formData = new FormData();
const data = ref();
const selectedFile = ref(null);
const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];  // Get the selected file
};
const passwordMismatch = computed(() => user.value.password !== user.value.confirmPassword);
// Fetch data when component is mounted
onMounted(async () => {
  try {
    const response = await axios.get(urlProfile, {
      params: {
        username: userData.username ,
      },
    });
    data.value = response.data[0];
    AssignForm();
  } catch (error) {
    console.error("Fetch error:", error);
  }
});

const AssignForm = () => {
  user.value.name = data.value.name;
  user.value.email = data.value.email;
  user.value.phone = data.value.phone;
  user.value.department = data.value.department;
  user.value.position = data.value.jabatan;
  user.value.username = userData.username;
}

const resetForm = () => {
  AssignForm();
};

const submitForm = async () => {
  if (passwordMismatch.value) {
    return;
  }
  try {
    formData.append("name", user.value.name);
    formData.append("email", user.value.email);
    formData.append("phone", user.value.phone);
    formData.append("department", user.value.department);
    formData.append("position", user.value.position);
    formData.append("username", user.value.username);
    if (user.value.password) {
      formData.append("password", user.value.password);
    }
    if (selectedFile.value) {
      formData.append("profilePicture", selectedFile.value);
    }

    const response = await axios.post(urlProfile, formData);

    userData.setProfile(user.value.name, response.data.foto);
    console.log(userData);
    console.log("Success:", response.data);
    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Submit error:", error);
    alert("Error updating profile.");
  }
};

</script>
