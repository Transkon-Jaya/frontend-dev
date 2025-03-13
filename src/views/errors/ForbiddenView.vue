<template>
    <div class="error-container">
      <h1>403 - Forbidden</h1>
      <p>You do not have permission to access this resource.</p>
      <button @click="goHome">Go to Home</button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      goHome() {
        this.$router.push("/office/");
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
  