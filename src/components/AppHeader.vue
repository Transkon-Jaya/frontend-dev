<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <div class="container">
      <router-link class="navbar-brand" to="/dashboard">
        <img
          src="@images/logo.png"
          alt="Logo"
          class="logo"
          style="width: 120px; height: auto"
        />
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/test">Test</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/marketing">Marketing</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/marketing-e">Marketing-E</router-link>
          </li>
        </ul>

        <div class="d-flex">
          <router-link v-if="!isLoggedIn" class="btn btn-primary me-2" to="/login">
            Login
          </router-link>
          <button v-if="isLoggedIn" @click="logout" class="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Collapse } from "bootstrap";

const router = useRouter();
const route = useRoute();
const isLoggedIn = ref(false);

const checkLoginStatus = () => {
  isLoggedIn.value = !!localStorage.getItem("token");
};

const closeNavbar = () => {
  const navbar = document.getElementById("navbarNav");
  if (navbar) {
    new Collapse(navbar).hide();
  }
};

watch(route, checkLoginStatus);

const logout = () => {
  localStorage.removeItem("token");
  isLoggedIn.value = false;
  router.push("/login");
};

onMounted(checkLoginStatus);
</script>

<style scoped>
/* Fix content being overlapped by navbar */
.page-content {
  padding-top: 80px; /* Adjust based on navbar height */
}

.navbar-nav .nav-link {
  font-weight: bold;
  margin-right: 10px;
}

.btn-primary,
.btn-danger {
  font-weight: bold;
}
</style>
