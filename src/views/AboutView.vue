<template>
  <div class="container row-4">
    <h1>Absensi Test</h1>
    <p>Ayo Absen</p>

    <!-- Dropdown Lokasi Absen -->
    <div class="form-group">
      <label for="location">Pilih Lokasi Absen:</label>
      <select v-model="selectedLocation" id="location">
        <option v-for="(location, index) in locations" :key="index" :value="location">
          {{ location }}
        </option>
      </select>
    </div>

    <!-- Tombol Absen -->
    <button @click="startAttendance" class="absen-btn">Absen Sekarang</button>

    <!-- Notifikasi Absen -->
    <p v-if="attendanceRecorded" class="confirmation-text">✅ Absen Anda sudah terekam!</p>
    <br>
    <button @click="goHome">Kembali ke dashboard</button>


     <!-- papan pengumuman -->
    <div class="container">
    <div class="bg-light p-5 rounded-lg m-3">
        <h1 class="display-4">Transkon jaya</h1>
        <p class="lead">Selamat Hari Raya Idul Fitri</p>
        <hr class="my-4">
        <p>
          <img src="/src/assets/images/avatars/eid.jpeg" 
           alt="Gambar Lebaran" 
        class="img-fluid rounded" 
        style="max-width: 100%; height: auto; max-height: 400px;">
        </p>
    </div>
</div>

  <!-- gps info box -->

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
    startAttendance() {
      if (!this.selectedLocation) {
        alert("Pilih lokasi absen terlebih dahulu!");
        return;
      }

      // Buka kamera perangkat untuk mengambil foto
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          this.attendanceRecorded = true;
          stream.getTracks().forEach((track) => track.stop()); // Matikan kamera setelah digunakan
        })
        .catch((error) => {
          console.error("Tidak dapat mengakses kamera:", error);
          alert("Gagal mengakses kamera. Pastikan izin diberikan.");
        });
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

.info-box {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
}

.map-img {
  width: 100%;
  max-width: 450px;
  height: auto;
  margin-top: 10px;
  border-radius: 8px;
}
</style>
