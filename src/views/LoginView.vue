<template>
  <div class="flex justify-center items-center h-screen">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-96">
      <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700">Username</label>
          <input
            v-model="username"
            type="text"
            class="w-full p-2 border rounded"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <p v-if="error" class="text-red-500 text-center mt-2">{{ error }}</p>
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
        this.$router.push("/"); // Redirect after login
      } catch (err) {
        this.error = err.response?.data?.error || "Login failed";
      }
    },
  },
};
</script>

<style>
body {
  background-color: #f3f4f6;
}
</style>
