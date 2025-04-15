<template>
  <div
    class="d-flex justify-content-center align-items-center vh-100 vw-100 bg-light position-absolute top-0 start-0"
  >
  <div class="card p-4 shadow-lg text-center" style="width: 350px">
  <img
    src="@images/logo.png"
    alt="Logo"
    class="img-fluid mx-auto d-block mb-3"
    style="max-width: 100px"
  />
  <h6 class="text-center mb-4">Enter your credentials to login your account</h6>
      <form @submit.prevent="login">
        <div class="mb-3">
          <label class="form-label text-start d-block">Username</label>
          <input v-model="username" type="text" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label text-start d-block">Password</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            required
          />
        </div>
        <button type="submit" class="btn btn-danger w-100">Login</button>
        <p v-if="error" class="text-danger text-center mt-2">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const userStore = useUserStore();

const username = ref("");
const password = ref("");
const error = ref("");

const urlProfile = userStore.apiBaseUrl + "/profile";

const login = async () => {
  try {
    const response = await axios.post(userStore.apiBaseUrl + "/login", {
      username: username.value,
      password: password.value,
    });
    const responseProfile = await axios.get(urlProfile, {
      params: {
        username: username.value,
      },
    });
    const profileData = responseProfile.data[0];
    userStore.setProfile(profileData.name, profileData.foto);
    // Save to localStorage
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user_level", response.data.user_level);

    // Set user data in Pinia store
    userStore.setUser({
      username: username.value,
      level: response.data.user_level,
      token: response.data.token,
    });

    console.log("Login successful:", userStore.username);

    // Redirect to dashboard
    router.push("/dashboard");
  } catch (err) {
    error.value = err.response?.data?.error || "Login failed";
  }
};
</script>

<style>
body {
  background-color: #f8f9fa !important;
  margin: 0;
  padding: 0;
}
</style>
