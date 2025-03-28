<template>
  <div class="container row-4">
    <h1>Absensi Test</h1>
    <p></p>

    <!-- Dropdown Lokasi Absen -->
    <div class="form-group">
      <label for="location">Pilih Lokasi:</label>
      <select v-model="selectedLocation" id="location">
        <option v-for="(location, index) in locations" :key="index" :value="location">
          {{ location }}
        </option>
      </select>
    </div>

    <!-- Tombol Absen -->
    <input type="file" accept="image/*" capture="environment" @change="handlePhoto" id="cameraInput" style="display: none" />
    <button @click="openCamera" class="absen-btn">Absen Sekarang</button>

    <!-- Notifikasi Absen -->
    <p v-if="attendanceRecorded" class="confirmation-text">✅ Absen Anda sudah terekam!</p>
    <br>
     <!-- papan pengumuman 
    <button @click="goHome">Kembali ke dashboard</button>
-->
    <!-- papan pengumuman -->
<div class="container">
    <div class="bg-light p-5 rounded-lg m-3">
        <h1 class="display-4">Transkon Info</h1>
        <p class="lead">Selamat Hari Raya Idul Fitri 1445 H</p>
        <hr class="my-4">
        <p>
          <!-- Gambar dengan pengaturan ukuran -->
          <img src="/src/assets/images/avatars/eid.jpg" 
               alt="Gambar Lebaran" 
               class="img-fluid rounded" 
               style="width: 100%; max-width: 600px; height: auto; display: block; margin: 0 auto;">
        </p>
        <!-- Tambahan teks di bawah gambar jika perlu -->
        <p class="mt-3"></p>
    </div>
</div>

    <!-- GPS & IP Info -->
    <div class="info-box">
      <h3>IP Addresses</h3>
      <p><strong>IPv4:</strong> {{ ipData.ipv4 }}</p>
      <p><strong>IPv6:</strong> {{ ipData.ipv6 }}</p>
    </div>

    <div class="info-box">
      <h3>GPS-Based Geolocation</h3>
      <p><strong>Latitude:</strong> {{ gpsLocation.lat }}</p>
      <p><strong>Longitude:</strong> {{ gpsLocation.lon }}</p>
      <img :src="gpsMapUrl" alt="GPS Map" v-if="gpsMapUrl" class="map-img" />
    </div>

    <div class="info-box">
      <h3>IP-Based Geolocation</h3>
      <p><strong>City:</strong> {{ ipLocation.city }}</p>
      <p><strong>Country:</strong> {{ ipLocation.country }}</p>
      <p><strong>Latitude:</strong> {{ ipLocation.lat }}</p>
      <p><strong>Longitude:</strong> {{ ipLocation.lon }}</p>
      <img :src="ipMapUrl" alt="IP Map" v-if="ipMapUrl" class="map-img" />
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";

export default {
  setup() {
    const ipData = ref({ ipv4: "Loading...", ipv6: "Loading..." });
    const gpsLocation = ref({ lat: "Loading...", lon: "Loading..." });
    const ipLocation = ref({ city: "Loading...", country: "Loading...", lat: "", lon: "" });
    const gpsMapUrl = ref("");
    const ipMapUrl = ref("");
    const attendanceRecorded = ref(false);
    const selectedLocation = ref("");
    const locations = ref(["HO Balikpapan", "HUB Sanga-sanga", "HUB Melak", "HUB Sangata", "HUB Berau"]);
    const ZOOM_LEVEL = 12;

    const fetchIp = async () => {
      try {
        const responseIPv4 = await fetch("https://api.ipify.org?format=json");
        const dataIPv4 = await responseIPv4.json();
        ipData.value.ipv4 = dataIPv4.ip;

        const responseIPv6 = await fetch("https://api64.ipify.org?format=json");
        const dataIPv6 = await responseIPv6.json();
        ipData.value.ipv6 = dataIPv6.ip;
      } catch (error) {
        console.error("Error fetching IP:", error);
      }
    };

    const fetchGPSLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            gpsLocation.value.lat = position.coords.latitude;
            gpsLocation.value.lon = position.coords.longitude;
            gpsMapUrl.value = `https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${gpsLocation.value.lon},${gpsLocation.value.lat}&size=450,300&z=${ZOOM_LEVEL}&l=map&pt=${gpsLocation.value.lon},${gpsLocation.value.lat},pm2rdm`;
          },
          (error) => {
            console.error("GPS Geolocation Error:", error);
          }
        );
      }
    };

    const fetchIPLocation = async () => {
      try {
        const response = await fetch("http://ip-api.com/json/");
        const data = await response.json();
        ipLocation.value = {
          city: data.city,
          country: data.country,
          lat: data.lat,
          lon: data.lon,
        };
        ipMapUrl.value = `https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${data.lon},${data.lat}&size=450,300&z=${ZOOM_LEVEL}&l=map&pt=${data.lon},${data.lat},pm2rdm`;
      } catch (error) {
        console.error("Error fetching IP geolocation:", error);
      }
    };

    onMounted(() => {
      fetchIp();
      fetchGPSLocation();
      fetchIPLocation();
    });

    return { ipData, gpsLocation, ipLocation, gpsMapUrl, ipMapUrl, attendanceRecorded, selectedLocation, locations };
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },
    openCamera() {
      if (!this.selectedLocation) {
        alert("Pilih lokasi absen terlebih dahulu!");
        return;
      }
      document.getElementById("cameraInput").click();
    },
    handlePhoto(event) {
      const file = event.target.files[0];
      if (file) {
        this.attendanceRecorded = true;
        alert("Foto berhasil diambil, absen Anda sudah terekam!");
      }
    },
  },
};
</script>

<style scoped>
.container {
  text-align: center;
  margin-top: 20px;
}

.form-group {
  margin-bottom: 15px;
}

select {
  padding: 10px;
  font-size: 16px;
}

.absen-btn {
  background-color: #ff2828;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 15px;
}

.absen-btn:hover {
  background-color: #bd3434;
}

.confirmation-text {
  font-size: 18px;
  font-weight: bold;
  color: green;
}
</style>