<template>
  <div class="container row-4">
    <h1>Absensi Test</h1>
    <p></p>

    <div class="form-group">
  <label for="location">Pilih Lokasi:</label>
  <br>
  <select v-model="selectedLocation" id="location" 
          style="padding: 0.25rem 0.5rem;
                 font-size: 0.875rem;
                 line-height: 1.5;
                 border-radius: 0.2rem;
                 width: 350px;
                 height: 30px;">
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
     <!-- button dashboard 
    <button @click="goHome">Kembali ke dashboard</button>
-->
    <!-- papan pengumuman -->
    <div class="container">
    <div class="bg-light p-5 rounded-lg m-3">
        <h1 class="display-4"></h1>
        <p class="lead">Transkon Info</p>
        <hr class="my-4">
        <p>
          <!-- Gambar dengan pengaturan ukuran responsif -->
          <div class="d-flex justify-content-center">
            <img src="/src/assets/images/avatars/eid.jpg" 
                 alt="Gambar Lebaran" 
                 class="img-fluid rounded"
                 style="max-width: 100%; height: auto;">
          </div>
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