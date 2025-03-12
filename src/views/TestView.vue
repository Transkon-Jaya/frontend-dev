<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const marketingData = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchMarketingData = async () => {
  try {
    console.log("Fetching marketing data...");
    const response = await axios.get(
      "https://www.transkon-rent.com/api/marketing",
      {
        maxRedirects: 0,
        headers: { "Custom-Header": "CustomValue" },
      }
    );

    // Assign response data to marketingData
    marketingData.value = response.data;
  } catch (err) {
    console.error("Error fetching data:", err);
    error.value = "Failed to fetch marketing data.";
  } finally {
    loading.value = false;
  }
};

const updateMarketingData = async (item) => {
  try {
    await axios.put(`https://www.transkon-rent.com/api/marketing`, {
      id: item.id,
      name_customer: item.name_customer,
      location: item.location,
    });
    alert("Updated successfully!");
  } catch (err) {
    console.error("Update failed:", err);
    alert("Failed to update");
  }
};

onMounted(fetchMarketingData);
</script>

<template>
  <div>
    <h2>Marketing Data (Editable)</h2>
    <p v-if="loading">Loading...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <table v-if="!loading && !error" border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer Name</th>
          <th>Location</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in marketingData" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name_customer }}</td>
          <td><input v-model="item.location" /></td>
          <td>
            <button @click="updateMarketingData(item)">Update</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
.error {
  color: red;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
}
input {
  width: 100%;
  padding: 4px;
}
button {
  padding: 5px 10px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #218838;
}
</style>
