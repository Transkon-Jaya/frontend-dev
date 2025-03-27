<template>
  <div class="container">
    <h1>Absensi Test</h1>
    <p>Ayo Absen</p>

    <button @click="goHome">Kembali ke dashboard</button>

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

    const ZOOM_LEVEL = 12; // 🔍 Increase to zoom in (Default: 10)

    // Fetch IPv4 & IPv6
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

    // Get Geolocation from Browser (GPS)
    const fetchGPSLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            gpsLocation.value.lat = position.coords.latitude;
            gpsLocation.value.lon = position.coords.longitude;
            gpsMapUrl.value = `https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${gpsLocation.value.lon},${gpsLocation.value.lat}&size=450,300&z=${ZOOM_LEVEL}&l=map&pt=${gpsLocation.value.lon},${gpsLocation.value.lat},pm2rdm`; // 🔴 Red marker added
          },
          (error) => {
            console.error("GPS Geolocation Error:", error);
          }
        );
      }
    };

    // Get Geolocation from IP
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
        ipMapUrl.value = `https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${data.lon},${data.lat}&size=450,300&z=${ZOOM_LEVEL}&l=map&pt=${data.lon},${data.lat},pm2rdm`; // 🔴 Red marker added
      } catch (error) {
        console.error("Error fetching IP geolocation:", error);
      }
    };

    onMounted(() => {
      fetchIp();
      fetchGPSLocation();
      fetchIPLocation();
    });

    return { ipData, gpsLocation, ipLocation, gpsMapUrl, ipMapUrl };
  },
  methods: {
    goHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.container {
  text-align: center;
  margin-top: 20px;
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
