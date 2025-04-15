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
            <router-link class="nav-link" to="/absensi">Absensi Testing</router-link>
          </li>
        </ul>

        <!-- User Dropdown -->
        <ul class="navbar-nav">
          <li class="nav-item dropdown" v-if="isLoggedIn">
            <a
              href="javascript:;"
              class="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              <img
                :src="userData.photo || userPhoto"
                akt="10.png"
                class="rounded-circle"
                width="45"
                height="45"
                alt="User"
              />
            </a>
            <div class="dropdown-menu dropdown-menu-end shadow">
              <div class="text-center p-3">
                <img
                  :src="userPhoto"
                  class="rounded-circle p-1 shadow mb-3"
                  width="90"
                  height="90"
                  alt="User"
                />
                <h5 class="user-name mb-0 fw-bold">Hello, {{ userData.username }}</h5>
              </div>
              <hr class="dropdown-divider" />
              <router-link
                class="dropdown-item d-flex align-items-center gap-2 py-2"
                to="/profile"
              >
                <i class="material-icons-outlined"></i>Profile
              </router-link>
              <router-link
                class="dropdown-item d-flex align-items-center gap-2 py-2"
                to="/dashboard"
              >
                <i class="material-icons-outlined"></i>Dashboard
              </router-link>
              <hr class="dropdown-divider" />
              <a
                href="javascript:;"
                @click="logout"
                class="dropdown-item d-flex align-items-center gap-2 py-2"
              >
                <i class="material-icons-outlined"></i>Logout
              </a>
            </div>
          </li>
        </ul>

        <!-- Login Button (Jika Belum Login) -->
        <router-link v-if="!isLoggedIn" class="btn btn-primary me-2" to="/login"
          >Login</router-link
        >
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import userPhoto from "@/assets/images/avatars/10.png";

import { useUserStore } from "@/stores/user";
const userData = useUserStore();

const router = useRouter();
const isLoggedIn = ref(false);
const userName = ref("User");
//const userPhoto = ref("src/assets/images/avatars/10.png");

const checkLoginStatus = () => {
  const token = localStorage.getItem("token");
  if (token) {
    isLoggedIn.value = true;
    userName.value = localStorage.getItem("user_name") || "User";
    //userPhoto.value = localStorage.getItem("user_photo") || "src/assets/images/avatars/10.png";
  }
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user_name");
  localStorage.removeItem("user_photo");
  isLoggedIn.value = false;
  router.push("/login");
};

onMounted(checkLoginStatus);
</script>

<style scoped>
.user-photo {
  border-radius: 50%;
  object-fit: cover;
}

.dropdown-toggle::after {
  display: none;
}

.dropdown-menu {
  width: 220px;
}

.dropdown-item i {
  font-size: 20px;
}

.dropdown-menu {
  background: white !important;
  box-shadow: none !important;
}
.nav-item.dropdown {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
  border: none !important;
}

.nav-item.dropdown .dropdown-toggle {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
  border: none !important;
  outline: none !important;
}

.nav-item.dropdown .dropdown-toggle img {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}
</style>
