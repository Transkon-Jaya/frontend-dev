<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { VueGoodTable } from "vue-good-table-next";
import "vue-good-table-next/dist/vue-good-table-next.css";
import * as XLSX from "xlsx";

const apiUrl = "https://www.transkon-rent.com/api/marketing";
const marketingData = ref([]);
const loading = ref(true);
const error = ref(null);

// Form Data for New Entry
const newEntry = ref({
  name_customer: "",
  location: "",
  plan_hub: "",
  number_quot: "",
  no_spk_po_customer: "",
});

// Fetch Data from API
const fetchMarketingData = async () => {
  try {
    loading.value = true;
    const response = await axios.get(apiUrl);
    marketingData.value = response.data.map((item) => ({
      ...item,
      id: parseInt(item.id, 10),
      isEditing: false,
    }));
  } catch (err) {
    error.value = "Failed to fetch data";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Update Data via API
const updateMarketingData = async (item) => {
  try {
    await axios.put(`${apiUrl}`, {
      id: item.id,
      name_customer: item.name_customer,
      location: item.location,
      plan_hub: item.plan_hub,
      number_quot: item.number_quot,
      no_spk_po_customer: item.no_spk_po_customer,
    });

    item.isEditing = false;
    alert("Updated successfully!");
  } catch (err) {
    console.error("Update failed:", err);
    alert("Failed to update");
  }
};

// Insert New Data via API
const insertMarketingData = async () => {
  try {
    const response = await axios.post(apiUrl, {
      name_customer: newEntry.value.name_customer,
      location: newEntry.value.location,
      plan_hub: newEntry.value.plan_hub,
      number_quot: newEntry.value.number_quot,
      no_spk_po_customer: newEntry.value.no_spk_po_customer,
    });

    // Add the new row to the table dynamically
    marketingData.value.push({
      ...response.data,
      id: parseInt(response.data.id, 10),
      isEditing: false,
    });

    // Reset form fields
    newEntry.value = {
      name_customer: "",
      location: "",
      plan_hub: "",
      number_quot: "",
      no_spk_po_customer: "",
    };

    alert("Inserted successfully!");
  } catch (err) {
    console.error("Insertion failed:", err);
    alert("Failed to insert");
  }
};

// Export to Excel
const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(marketingData.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Marketing Data");
  XLSX.writeFile(workbook, "Marketing_Data.xlsx");
};

// Define Table Columns
const columns = ref([
  { label: "Actions", field: "actions" },
  { label: "ID", field: "id", sortable: true, filterable: true },
  {
    label: "Customer Name",
    field: "name_customer",
    sortable: true,
    filterable: true,
  },
  { label: "Location", field: "location", sortable: true, filterable: true },
  { label: "Plan Hub", field: "plan_hub", sortable: true, filterable: true },
  {
    label: "Number Quot",
    field: "number_quot",
    sortable: true,
    filterable: true,
  },
  {
    label: "No SPK PO Customer",
    field: "no_spk_po_customer",
    sortable: true,
    filterable: true,
  },
]);

// Computed Property for Table Data
const formattedData = computed(() => {
  return marketingData.value.map((item) => ({
    ...item,
    actions: item.isEditing ? "Save" : "Edit",
  }));
});

// Fetch data on mount
onMounted(fetchMarketingData);
</script>

<template>
  <div>
    <h2>Marketing Data (Editable, Exportable, & Insertable)</h2>

    <!-- Add New Data Form -->
    <div class="form-container">
      <h3>Add New Entry</h3>
      <input v-model="newEntry.name_customer" placeholder="Customer Name" />
      <input v-model="newEntry.location" placeholder="Location" />
      <input v-model="newEntry.plan_hub" placeholder="Plan Hub" />
      <input v-model="newEntry.number_quot" placeholder="Number Quot" />
      <input
        v-model="newEntry.no_spk_po_customer"
        placeholder="No SPK PO Customer"
      />
      <button @click="insertMarketingData">Add New Entry</button>
    </div>

    <button @click="exportToExcel">Export to Excel</button>

    <p v-if="loading">Loading...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <vue-good-table
      v-if="!loading && !error"
      :columns="columns"
      :rows="formattedData"
      :pagination-options="{ enabled: true, mode: 'pages', perPage: 10 }"
      :search-options="{ enabled: true }"
      :sort-options="{ enabled: true }"
    >
      <template v-slot:table-row="props">
        <span v-if="props.column.field === 'id'">
          {{ props.row.id }}
        </span>

        <span v-else-if="props.column.field === 'name_customer'">
          <input v-if="props.row.isEditing" v-model="props.row.name_customer" />
          <span v-else>{{ props.row.name_customer }}</span>
        </span>

        <span v-else-if="props.column.field === 'location'">
          <input v-if="props.row.isEditing" v-model="props.row.location" />
          <span v-else>{{ props.row.location }}</span>
        </span>

        <span v-else-if="props.column.field === 'plan_hub'">
          <input v-if="props.row.isEditing" v-model="props.row.plan_hub" />
          <span v-else>{{ props.row.plan_hub }}</span>
        </span>

        <span v-else-if="props.column.field === 'number_quot'">
          <input v-if="props.row.isEditing" v-model="props.row.number_quot" />
          <span v-else>{{ props.row.number_quot }}</span>
        </span>

        <span v-else-if="props.column.field === 'no_spk_po_customer'">
          <input
            v-if="props.row.isEditing"
            v-model="props.row.no_spk_po_customer"
          />
          <span v-else>{{ props.row.no_spk_po_customer }}</span>
        </span>

        <span v-else-if="props.column.field === 'actions'">
          <button
            @click="
              props.row.isEditing
                ? updateMarketingData(props.row)
                : (props.row.isEditing = true)
            "
          >
            {{ props.row.isEditing ? "Save" : "Edit" }}
          </button>
        </span>
      </template>
    </vue-good-table>
  </div>
</template>

<style>
.error {
  color: red;
}
input {
  padding: 5px;
  width: 100%;
  margin: 5px 0;
}
button {
  padding: 6px 10px;
  margin: 5px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #218838;
}
.form-container {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  padding: 10px;
}
</style>
