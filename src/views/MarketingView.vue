<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { utils, writeFile } from "xlsx";
import { VueGoodTable } from "vue-good-table-next";
import "vue-good-table-next/dist/vue-good-table-next.css";

const marketingData = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref("");

// **Pagination & Table Config**
const perPage = ref(20);
const currentPage = ref(1);
const totalRows = computed(() => marketingData.value.length);

// **Fetch API Data**
const fetchMarketingData = async () => {
  try {
    const response = await axios.get(
      "https://www.transkon-rent.com/api/marketing"
    );
    marketingData.value = response.data;
  } catch (err) {
    error.value = "Failed to load data";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// **Filtered Data for Search**
const filteredData = computed(() => {
  if (!searchQuery.value) return marketingData.value;
  return marketingData.value.filter((item) =>
    item.name_customer.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// **Export Data to Excel**
const exportToExcel = () => {
  const worksheet = utils.json_to_sheet(marketingData.value);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Marketing Data");
  writeFile(workbook, "MarketingData.xlsx");
};

onMounted(fetchMarketingData);
</script>

<template>
  <div>
    <h2>Marketing Data</h2>

    <div class="actions">
      <input v-model="searchQuery" placeholder="Search Customer Name..." />
      <button @click="exportToExcel">Export to Excel</button>
    </div>

    <vue-good-table
      :columns="[
        { label: 'ID', field: 'id', sortable: true },
        { label: 'Customer Name', field: 'name_customer', sortable: true },
        { label: 'Location', field: 'location', sortable: true },
      ]"
      :rows="filteredData"
      :pagination-options="{ enabled: true, mode: 'pages', perPage: perPage }"
      :search-options="{ enabled: true, placeholder: 'Search table' }"
      :sort-options="{ enabled: true }"
    />

    <p v-if="loading">Loading...</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<style>
.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
input {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 6px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
.error {
  color: red;
}
</style>
