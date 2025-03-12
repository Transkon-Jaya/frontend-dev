<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/test">Testtt</router-link> |
    <router-link to="/marketing">Marketing</router-link> |
    <router-link to="/marketing-e">Marketing-E</router-link> |
    <button @click="logout" class="logout-btn">Logout</button>
  </nav>
  <router-view />
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem("token"); // Remove token
      this.$router.push("/login"); // Redirect to login page
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.logout-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 12px;
  font-weight: bold;
  cursor: pointer;
  margin-left: 10px;
}

.logout-btn:hover {
  background: #c0392b;
}
</style>
