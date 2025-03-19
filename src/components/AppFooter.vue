<template>
    <div class="content">
      <slot></slot> <!-- Ini tempat kontennya -->
    </div>
    <footer class="footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Transkon Jaya. All Rights Reserved.</p>
      </div>
    </footer>
  </template>
  
  <style scoped>
  .content {
    padding-bottom: 10px; /* Memberi ruang agar tidak terlalu mepet */
  }
  
  .footer {
    width: 100%;
    background: #f5f5f5;
    color: #161616;
    text-align: right;
    padding: 10px 0; /* Tambah padding untuk estetika */
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .footer p {
  font-size: 11px; /* Bisa sesuaikan dengan kebutuhan */
}

  </style>
  