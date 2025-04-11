<template>
    <div class="dashboard-container">
      <div class="header">
        <h2>Hallo, <span class="username">{{ user.name }}</span></h2>
        <!-- <button class="logout-btn">Logout 🚪</button>-->
      </div>
      <div class="portal-grid">
        <div v-for="portal in portals" :key="portal.title" class="portal-card">
          <div class="portal-icon">{{ portal.icon }}</div>
          <h3>{{ portal.title }}</h3>
          <p class="portal-description">{{ portal.description }}</p>
          <a :href="portal.link" class="portal-link">Lihat Halaman ➝</a>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  
  export default {
    setup() {
      const user = ref({
        name: "User",
      });
  
      const portals = ref([
        { title: "Absensi", description: "Database untuk mengambil data absensi seluruh data karyawan Transkon.", icon: "", link: "/office/hr/absensi" },
        { title: "Izin", description: "Database untuk melihat karyawan yang izin.", icon: "", link: "#" },
      ]);
  
      return { user, portals };
    },
  };
  </script>
  
  <style scoped>
  /* Kontainer utama */
  .dashboard-container {
    max-width: 1600px;
    margin: 60px auto;
    padding: 40px;
    background: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
  
  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }
  
  .username {
    color: red;
    font-weight: bold;
  }
  
  .logout-btn {
    background: red;
    color: white;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 5px;
  }
  
  /* Grid responsif */
  .portal-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Responsif */
    gap: 20px;
    justify-content: center;
  }
  
  /* Kartu */
  .portal-card {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
    text-align: left;
    width: 100%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    
    /* Menggunakan Flexbox */
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  /* Deskripsi */
  .portal-description {
    flex-grow: 1; /* Membuat teks mendorong link ke bawah */
  }
  
  /* Link selalu di bawah */
  .portal-link {
    display: block;
    margin-top: auto; /* Mendorong ke bawah */
    color: red;
    text-decoration: none;
    font-weight: bold;
  }
  
  /* Mobile-friendly */
  @media (max-width: 768px) {
    .dashboard-container {
      padding: 20px;
    }
  
    .portal-grid {
      grid-template-columns: 1fr; /* Hanya 1 kolom di HP */
    }
  
    .header {
      flex-direction: column;
      text-align: center;
    }
  
    .logout-btn {
      margin-top: 10px;
    }
  }
  </style>
  