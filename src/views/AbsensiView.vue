<template>
  <div class="app-container">
    <!-- Main Content -->
    <main class="main-content">
      <h1 class="app-title">Absensi Karyawan</h1>
      <p class="app-subtitle"></p>
      <!-- Attendance Form -->
      <div class="attendance-card">
        <div class="form-group">
          <!-- <label for="location" class="form-label">Lokasi Absensi</label>
          <select v-model="selectedLocation" id="location" class="form-select">
            <option value="" disabled selected>Loading...</option>
            <option v-for="(location, index) in locations" :key="index" :value="location">
              {{ location.nama }}
            </option>
          </select> -->
          <p v-if="locations.length > 0" id="location" class="form-control-plaintext">
            {{ locations[0].nama }}
            <!-- {{ userData.baseUrl + absensiStatusArray[0].foto_in }} -->
          </p>
          <p v-else class="form-control-plaintext text-muted">Loading location...</p>
        </div>
        <div v-if="absensiStatus === 'OUT' || absensiStatus === 'DONE'">
          <button @click="openModal(absensiStatusArray[0].foto_in)" class="btn btn-primary">Lihat Foto IN</button>

          <ImageModal
            :imageSrc="imageSrc"
            :showModal="showModal"
            @close="closeModal"
          />
        </div>

        <div v-if="absensiStatus === 'DONE'">
          <button @click="openModal(absensiStatusArray[0].foto_out)" class="btn btn-primary">Lihat Foto OUT</button>
          <ImageModal
            :imageSrc="imageSrc"
            :showModal="showModal"
            @close="closeModal"
          />
        </div>
        <!-- Attendance Button -->
        <div class="action-group">
          <input type="file" accept="image/*" capture="environment" @change="handlePhoto" id="cameraInput" style="display: none;" />
            <button 
              @click="openCamera"
              class="primary-btn" 
              :disabled="!selectedLocation || absensiStatus === 'DONE' || isLoadingAbsensiStatus || !dataLoaded"
            >
              <i class="fa-solid fa-camera"></i>
              <span v-if="isLoadingAbsensiStatus">Loading...</span>
              <span v-else>{{ absensiStatus === 'DONE' ? 'Sudah Absen' : absensiStatus === 'OUT' ? 'Absen OUT' : 'Absen IN' }}</span>          
            </button>
        </div>

        <!-- Attendance Confirmation -->
        <div v-if="attendanceRecorded" class="confirmation-message">
          <i class="fa-solid fa-check-circle success-icon"></i>
          <span>Absensi berhasil direkam!</span>
        </div>
      </div>

      <!-- Announcement Section -->
      <div class="announcement-card">
        <div class="announcement-header">
          <i class="fa-solid fa-bullhorn announcement-icon"></i>
          <h3>TRJA Memo</h3>
        </div>
        <div class="announcement-content">
          <img src="/src/assets/images/avatars/eid.jpg" 
               alt="Gambar Lebaran" 
               class="announcement-image" />
          <p class="announcement-text">Selamat Hari Raya Idul Fitri 1445 H</p>
        </div>
      </div>

      <!-- Location Information -->
      <div class="info-section-edit">
        <!-- GPS Info -->
        <div class="info-card">
          <div class="info-header">
            <i class="fa-solid fa-map-marker-alt"></i>
            <h4>Lokasi GPS Anda</h4>
          </div>
          <div class="info-content">
            <div class="info-row">
              <span class="info-label">Latitude:</span>
              <span class="info-value">{{ gpsLocation.lat }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Longitude:</span>
              <span class="info-value">{{ gpsLocation.lon }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Jarak:</span>
              <span v-if="locations.length > 0" class="info-value">
                {{ locations[0].distance + " KM" }}
              </span>
              <span v-else class="info-value text-muted">
                Loading distance...
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">IPv4:</span>
              <span class="info-value">{{ ipData.ipv4 }}</span>
            </div>
            <!-- <div class="info-row">
              <span class="info-label">IPv6:</span>
              <span class="info-value">{{ ipData.ipv6 }}</span>
            </div> -->
            <img :src="gpsMapUrl" alt="GPS Map" v-if="gpsMapUrl" class="map-image" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import ImageModal from '@/components/ImageModal.vue';
import axios from "axios";

import { useUserStore } from "@/stores/user";
const userData = useUserStore();

export default {
  components: {
    ImageModal
  },
  setup() {
    const fileInput = ref(null);
    const default_str = "Mengambil data...";
    const ipData = ref({ ipv4: default_str, ipv6: default_str });
    const gpsLocation = ref({ lat: default_str, lon: default_str });
    const ipLocation = ref({ city: default_str, country: default_str, lat: "", lon: "" });
    const gpsMapUrl = ref("");
    const ipMapUrl = ref("");
    const attendanceRecorded = ref(false);
    const selectedLocation = ref("");
    const locations = ref([]);
    const ZOOM_LEVEL = 12;

    const dataLoaded = computed(() => {
      return (
        gpsLocation.value.lat !== default_str &&
        gpsLocation.value.lon !== default_str &&
        ipData.value.ipv4 !== default_str
        // ipData.value.ipv6 !== default_str
      );
    });

    const absensiStatusArray = ref([]);
    const isLoadingAbsensiStatus = ref(true);
    const absensiStatus = computed(() => {
      const latest = absensiStatusArray.value[0];
      if (!latest) {
        return "IN";
      }
      const hourIn = latest.hour_in ? new Date(latest.hour_in) : null;
      const now = new Date();
      const timeDiffHours = hourIn ? (now - hourIn) / (1000 * 60 * 60) : null;
      //latest.tanggal !== new Date().toISOString().slice(0, 10)
      if (latest.hour_out && timeDiffHours >= 16 || timeDiffHours >= 16) {
        return "IN";
      }
      if (!latest.hour_out || latest.hour_out === "00:00:00") {
        return "OUT";
      }
      return "DONE";
    });
    const fetchAbsensiStatus = async () => {
      const responseStatus = await fetch(userData.apiBaseUrl+"/absensi-status?username="+userData.username);
      absensiStatusArray.value = await responseStatus.json();
      if(absensiStatusArray.value.length > 0){
        absensiStatusArray.value[0].foto_in = userData.baseUrl + "/uploads/absensi/" + absensiStatusArray.value[0].foto_in
        absensiStatusArray.value[0].foto_out = userData.baseUrl + "/uploads/absensi/" + absensiStatusArray.value[0].foto_out
      }
      isLoadingAbsensiStatus.value = false;
    }

    const fetchGPSLocation = () => {
      return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              gpsLocation.value.lat = position.coords.latitude.toFixed(6);
              gpsLocation.value.lon = position.coords.longitude.toFixed(6);
              gpsMapUrl.value = `https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${gpsLocation.value.lon},${gpsLocation.value.lat}&size=450,300&z=${ZOOM_LEVEL}&l=map&pt=${gpsLocation.value.lon},${gpsLocation.value.lat},pm2rdm`;
              resolve();
            },
            (error) => {
              console.error("GPS Geolocation Error:", error);
              gpsLocation.value.lat = "Izin ditolak";
              gpsLocation.value.lon = "Izin ditolak";
              reject(error);
            }
          );
        } else {
          gpsLocation.value.lat = "Tidak didukung";
          gpsLocation.value.lon = "Tidak didukung";
          reject(new Error("Geolocation tidak didukung"));
        }
      });
    };

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return (R * c).toFixed(3);
    }

    const fetchLokasi = async () => {
      const responseLokasi = await axios.get(userData.apiBaseUrl + "/hr-lokasi");

      // Map and calculate distance
      locations.value = responseLokasi.data.map((item) => {
        const lat = item.latitude ?? null;
        const lon = item.longitude ?? null;
        const distance = (lat !== null && lon !== null && gpsLocation.value.lat && gpsLocation.value.lon)
          ? getDistanceFromLatLonInKm(gpsLocation.value.lat, gpsLocation.value.lon, lat, lon)
          : Infinity;

        return {
          nama: item.nama ?? "",
          lat,
          lon,
          distance,
        };
      });

      // Sort by nearest
      locations.value.sort((a, b) => a.distance - b.distance);

      // Optionally set the closest one as selected
      if (locations.value.length > 0) {
        selectedLocation.value = locations.value[0];
      }
    };

    const fetchIp = async () => {
      try {
        const responseIPv4 = await fetch("https://api.ipify.org?format=json");
        const dataIPv4 = await responseIPv4.json();
        ipData.value.ipv4 = dataIPv4.ip;

        // const responseIPv6 = await fetch("https://api64.ipify.org?format=json");
        // const dataIPv6 = await responseIPv6.json();
        // ipData.value.ipv6 = dataIPv6.ip;
      } catch (error) {
        console.error("Error fetching IP:", error);
        ipData.value.ipv4 = "Gagal memuat";
        // ipData.value.ipv6 = "Gagal memuat";
      }
    };

    const fetchIPLocation = async () => {
      try {
        const response = await fetch("http://ip-api.com/json/");
        const data = await response.json();
        ipLocation.value = {
          city: data.city || "Tidak diketahui",
          country: data.country || "Tidak diketahui",
          lat: data.lat ? data.lat.toFixed(6) : "",
          lon: data.lon ? data.lon.toFixed(6) : "",
        };
        if (data.lon && data.lat) {
          ipMapUrl.value = `https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${data.lon},${data.lat}&size=450,300&z=${ZOOM_LEVEL}&l=map&pt=${data.lon},${data.lat},pm2rdm`;
        }
      } catch (error) {
        console.error("Error fetching IP geolocation:", error);
        ipLocation.value.city = "Gagal memuat";
        ipLocation.value.country = "Gagal memuat";
      }
    };

    onMounted( async () => {
      await fetchGPSLocation();
      await fetchLokasi();
      await fetchIp();
      await fetchAbsensiStatus();
      // fetchIPLocation();
    });

    return { fileInput, ipData, gpsLocation, ipLocation, gpsMapUrl, ipMapUrl, attendanceRecorded, selectedLocation, locations, absensiStatusArray, absensiStatus, isLoadingAbsensiStatus, dataLoaded };
  },
  data() {
    return {
      showModal: false,
      imageSrc: ''
    };
  },
  methods: {
    openModal(imageSrc) {
      this.imageSrc = imageSrc; // Set the image source
      this.showModal = true; // Open the modal
    },
    closeModal() {
      this.showModal = false; // Close the modal
    },
    openCamera() {
      // return;
      if (!this.selectedLocation) {
        alert("Silakan pilih lokasi absen terlebih dahulu!");
        return;
      }
      // this.fileInput.value?.click();
      document.getElementById("cameraInput").click();
    },
    async handlePhoto(event) {
      // return;
      const file = event.target.files[0];
      if (!file) return;
      try {
        const formData = new FormData();
        formData.append("foto", file);
        formData.append("id", this.absensiStatus == "IN" ? null : this.absensiStatusArray[0].id);
        formData.append("status", this.absensiStatus);
        formData.append("username", userData.username);
        formData.append("lokasi", this.selectedLocation.nama);
        formData.append("jarak", this.selectedLocation.distance);
        formData.append("long", this.gpsLocation.lon);
        formData.append("lang", this.gpsLocation.lat);
        formData.append("ip", this.ipData.ipv4);

        const response = await axios.post("https://www.transkon-rent.com/api/absensi", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });

        const result = response.data;
        // console.log(result);

        if (result.status === "success") {
          this.attendanceRecorded = true;
          // console.log("Attendance uploaded:", result);
          window.location.reload();
        } else {
          console.error("Attendance failed:", result.message);
        }

      } catch (err) {
        console.error("Upload error:", err);
      }
    }
  },
};
</script>

<style>
/* Import Font Awesome CSS */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');



body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: Arial, sans-serif;
        }
        
        .main-content {
            text-align: center;
        }
        
        .app-title {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            color: #333;
        }
        
        .app-subtitle {
            font-size: 1.5rem;
            color: #666;
            margin-top: 0;
        }
/* Base Styles */
:root {
  --primary-color: #3498db;
  --secondary-color: #2980b9;
  --success-color: #2ecc71;
  --danger-color: #e74c3c;
  --warning-color: #f39c12;
  --light-color: #ecf0f1;
  --dark-color: #2c3e50;
  --text-color: #333;
  --text-light: #7f8c8d;
  --border-radius: 8px;
  --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: #f5f7fa;
}

.hidden-input {
  display: none;
}

/* Layout */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 100%;
  overflow-x: hidden;
}

.main-content {
  flex: 1;
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

/* Header */
.app-header {
  background-color: var(--primary-color);
  color: white;
  padding: 1.5rem 1rem;
  text-align: center;
  box-shadow: var(--box-shadow);
}

.app-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.app-subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Cards */
.attendance-card,
.announcement-card,
.info-card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Form Elements */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--dark-color);
  text-align: left;
}

.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  background-color: white;
}

.form-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

/* Buttons */
.primary-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.primary-btn:hover {
  background-color: var(--secondary-color);
}

.primary-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

/* Confirmation Message */
.confirmation-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--success-color);
  font-weight: 500;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: rgba(46, 204, 113, 0.1);
  border-radius: var(--border-radius);
}

.success-icon {
  font-size: 1.2rem;
}

/* Announcement Section */
.announcement-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.announcement-header h3 {
  font-size: 1.2rem;
  color: var(--dark-color);
}

.announcement-icon {
  color: var(--warning-color);
  font-size: 1.2rem;
}

.announcement-image {
  width: 100%;      /* Responsif, mengisi lebar container */
  max-width: 800px; /* Batas maksimal lebar */
  height: auto;     /* Menjaga rasio aspek */
  border-radius: 8px; /* Sudut melengkung */
  margin-bottom: 1rem;
}

.announcement-text {
  text-align: center;
  font-weight: 500;
  color: var(--text-color);
}

/* Info Sections */
.info-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.info-header h4 {
  font-size: 1.1rem;
  color: var(--dark-color);
}

.info-header i {
  color: var(--primary-color);
  font-size: 1.1rem;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
}

.info-label {
  font-weight: 500;
  color: var(--text-light);
}

.info-value {
  font-weight: 500;
  color: var(--dark-color);
  text-align: right;
}

.map-image {
  width: 100%;
  border-radius: var(--border-radius);
  margin-top: 1rem;
  border: 1px solid #eee;
}

/* Footer */
.app-footer {
  background-color: var(--dark-color);
  color: white;
  text-align: center;
  padding: 1.5rem 1rem;
  margin-top: 2rem;
  
}

.app-footer p {
  margin-bottom: 0.5rem;
}

.footer-copyright {
  font-size: 0.8rem;
  opacity: 0.8;
}

/* Responsive Adjustments */
@media (min-width: 768px) {
  .app-title {
    font-size: 2rem;
  }
  
  .app-subtitle {
    font-size: 1rem;
  }
  
  .info-section {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .primary-btn {
    width: auto;
    padding: 0.75rem 2rem;
  }
}

@media (max-width: 480px) {
  .attendance-card,
  .announcement-card,
  .info-card {
    padding: 1rem;
  }
  
  .app-header {
    padding: 1rem;
  }
  
  .app-title {
    font-size: 1.3rem;
  }
}
</style>