<template>
    <footer class="footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Transkon Jaya. All Rights Reserved.</p>
      </div>
    </footer>
  </template>
  
  <script setup>
  // Tidak memerlukan script tambahan untuk footer ini
  </script>
  
  <style scoped>
  .footer {
    width: 100%;
    background: #f5f5f5; /* Warna gelap elegan */
    color: #161616;
    text-align: center;
    padding: 2px 0;
    position: fixed;
    bottom: 0;
    left: 0;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  </style>
  