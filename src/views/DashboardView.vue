<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <div class="sidebar bg-dark text-white p-3 vh-100">
      <h4 class="text-center mb-4">Dashboard</h4>
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link class="nav-link text-white" to="/dashboard"
            >🏠 Home</router-link
          >
        </li>
        <li class="nav-item">
          <router-link class="nav-link text-white" to="/profile"
            >👤 Profile</router-link
          >
        </li>
        <li class="nav-item">
          <router-link class="nav-link text-white" to="/settings"
            >⚙ Settings</router-link
          >
        </li>
        <li class="nav-item">
          <button @click="logout" class="btn btn-danger w-100 mt-3">
            🚪 Logout
          </button>
        </li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="content p-4 flex-grow-1">
      <h2>Welcome to Dashboard</h2>
      <p>This is your main dashboard page.</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>

<style scoped>
.sidebar {
  width: 250px;
}
.nav-link {
  padding: 10px;
  font-size: 18px;
}
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
