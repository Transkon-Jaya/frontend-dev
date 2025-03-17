<template>
  <div class="error-container">
    <h1>403 - Forbidden</h1>
    <p>Anda tidak mempunyai akses untuk halaman ini. Hubungi admin jika membutuhkan akses</p>
    <button @click="goHome">Kembali ke dashboard</button>
  </div>
</template>

<script>
export default {
  methods: {
    goHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.error-container {
  text-align: center;
  margin-top: 50px;
}

h1 {
  color: #ff4d4d;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #0056b3;
}
</style>
