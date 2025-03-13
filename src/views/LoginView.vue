<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card p-4 shadow-lg" style="width: 350px">
      <h2 class="text-center mb-4">Login</h2>
      <form @submit.prevent="login">
        <div class="mb-3">
          <label class="form-label">Username</label>
          <input v-model="username" type="text" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary w-100">Login</button>
        <p v-if="error" class="text-danger text-center mt-2">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(
          "https://www.transkon-rent.com/api/login",
          {
            username: this.username,
            password: this.password,
          }
        );
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_level", response.data.user_level);

        // Redirect ke dashboard setelah login sukses
        this.$router.push("/dashboard");
      } catch (err) {
        this.error = err.response?.data?.error || "Login failed";
      }
    },
  },
};
</script>

<style>
body {
  background-color: #f8f9fa;
}
</style>
