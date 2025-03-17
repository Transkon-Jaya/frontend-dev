<template>
    <div class="error-container">
      <h1>404 - Not Found</h1>
      <p>Halaman tidak ditemukan</p>
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
  