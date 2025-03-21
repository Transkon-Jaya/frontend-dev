<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import { VueGoodTable } from "vue-good-table-next";
import "vue-good-table-next/dist/vue-good-table-next.css";
import * as XLSX from "xlsx";

const apiUrl = "https://www.transkon-rent.com/api/marketing";
const customerUrl = "https://www-transkon-rent.com/api/customer";
const marketingData = ref([]);
const marketingDataInsert = ref([]);
const customers = ref([]);
const filteredData = ref([]); // Store filtered data
const columns = ref([]);
const loading = ref(true);
const error = ref(null);
const firstColumnWidth = ref("150px");
const secondColumnWidth = ref("100px");
const changedRows = ref(new Map()); // Store changed rows
const changedRowsInsert = ref(new Map());
const checkboxFields = [
  "front_bumper",
  "rear_bumper",
  "roll_bar",
  "rops",
  "buggy_whip_cw_flag",
  "body_strip_3m",
  "foglamp_led_16_mata",
  "rotary_lamp_led",
  "rotary_lamp_flash_tube",
  "lamp_comb_led",
  "safety_cone",
  "wheel_chock",
  "fire_exting",
  "radio_motorolla",
  "gps",
  "wheel_nut_indic",
  "tyre_gt_265_65_r17_mt",
  "radio_icom",
];
const fieldsToRemove = ["isEditing", "filterable", "vgt_id", "originalIndex"];
const dateFields = [
  "inquiry",
  "date_rfq",
  "date_deadline_tender",
  "approval_presdir",
  "date_Quotation_trja",
  "date_send_quot",
  "date_approved_quot",
  "date_spk_po_customer",
  "date_master_contract",
  "date_po_dealer",
  "date_send_po",
  "date_delvery_to_customer",
  "received_date_by_customer",
  "date_commisioning_finish",
];

const fetchMarketingData = async () => {
  try {
    loading.value = true;
    const response = await axios.get(apiUrl);
    if (response.data.length > 0) {
      columns.value = [
        {
          label: "ID",
          field: "id",
          width: secondColumnWidth.value,
          width: "50px", // Kurangi ukuran kolom ID
          minWidth: "100px",
          sortable: true,
          filterable: false,
          editable: false,
          frozen: true,
        },
        ...Object.keys(response.data[0])
          .filter((key) => key !== "id")
          .map((key) => ({
            label: key.replace(/_/g, " ").toUpperCase(),
            field: key,
            sortable: true,
            filterable: true,
            filterOptions: { enabled: true, placeholder: `${key}` },
            editable: true,
            type: checkboxFields.includes(key) ? "checkbox" : "text",
            width:
              Math.max(
                ...response.data.map((item) => String(item[key]).length),
                key.length
              ) *
                10 +
              20 +
              "px",
            minWidth: "80px",
          })),
      ];
    }

    marketingData.value = response.data.map((item) => ({
      ...item,
      filterable: true,
    }));

    filteredData.value = [...marketingData.value]; // Initialize filtered data

    setTimeout(updateColumnWidths, 500);
  } catch (err) {
    error.value = "Failed to fetch data";
    console.error(err);
  } finally {
    loading.value = false;
    addNewRow();
  }
};

const addNewRow = () => {
  const newRow = {};
  columns.value.forEach((col) => {
    newRow[col.field] = checkboxFields.includes(col.field) ? 0 : "";
  });
  newRow.id = marketingDataInsert.value.length + 1;
  marketingDataInsert.value.push(newRow);
};

// Track changes
const trackUpload = (row, field) => {
  if (!changedRowsInsert.value.has(row.id)) {
    changedRowsInsert.value.set(row.id, { ...row });
  } else {
    changedRowsInsert.value.get(row.id)[field] = row[field];
  }
};

const upload = async () => {
  try {
    console.log("button upload");
    const uploads = Array.from(changedRowsInsert.value.values());
    console.log(uploads);
    for (const item of uploads) {
      const uploadItem = { ...item };
      for (const prop of fieldsToRemove) {
        delete uploadItem[prop];
      }
      delete uploadItem["id"];
      console.log(uploadItem);
      dateFields.forEach((key) => {
        if (
          uploadItem[key] !== null &&
          uploadItem[key] !== undefined &&
          !isNaN(Date.parse(uploadItem[key]))
        ) {
          uploadItem[key] = new Date(uploadItem[key])
            .toISOString()
            .split("T")[0]; // Format: YYYY-MM-DD
        }
      });
      Object.keys(uploadItem).forEach((key) => {
        if (uploadItem[key] === "") {
          uploadItem[key] = null;
        }
      });
      await axios.post(`${apiUrl}`, uploadItem);
      await fetchMarketingData();
      alert("Data uploaded Successfully");
      marketingDataInsert.value = [];
      changedRowsInsert.value.clear();
    }
  } catch (err) {
    console.error("Failed to upload: ", err);
    alert("Failed to upload");
  }
};

// For updates
const trackChanges = (row, field) => {
  if (!changedRows.value.has(row.id)) {
    changedRows.value.set(row.id, { ...row });
  } else {
    changedRows.value.get(row.id)[field] = row[field];
  }
};
// Save all changes (updates)
const saveChanges = async () => {
  try {
    const updates = Array.from(changedRows.value.values());
    for (const item of updates) {
      const updatedItem = { ...item };
      for (const prop of fieldsToRemove) {
        delete updatedItem[prop];
      }
      dateFields.forEach((key) => {
        if (
          updatedItem[key] !== null &&
          updatedItem[key] !== undefined &&
          !isNaN(Date.parse(updatedItem[key]))
        ) {
          updatedItem[key] = new Date(updatedItem[key])
            .toISOString()
            .split("T")[0]; // Format: YYYY-MM-DD
        }
      });
      await axios.put(`${apiUrl}`, updatedItem);
    }
    alert("Changes saved successfully!");
    changedRows.value.clear();
  } catch (err) {
    console.error("Failed to save changes:", err);
    alert("Failed to save changes");
  }
};

// Export to Excel (filtered data only)
const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(filteredData.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Marketing Data");
  XLSX.writeFile(workbook, "Filtered_Marketing_Data.xlsx");
};

// Update filtered data when table is filtered
const onTableFiltered = (filteredRows) => {
  filteredData.value = filteredRows;
};

// Dynamic Column Width Calculation
const updateColumnWidths = () => {
  const secondCol = document.querySelector(".vue-good-table th:nth-child(1)");
  if (secondCol) secondColumnWidth.value = secondCol.offsetWidth + "px";
  document.documentElement.style.setProperty(
    "--second-column-width",
    secondColumnWidth.value
  );
};

onMounted(() => {
  fetchMarketingData();
  window.addEventListener("resize", updateColumnWidths);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateColumnWidths);
});
</script>

<template>
  <div>
    <h2>Marketing</h2>
    <button @click="upload">Upload</button>
    <button @click="addNewRow">Add New Row</button>
    <p v-if="loading">Loading...</p>
    <p v-if="error" class="error">{{ error }}</p>
    <div class="table-container">
      <vue-good-table
        v-if="!loading && !error"
        :columns="columns"
        :rows="marketingDataInsert"
        :pagination-options="{ enabled: false }"
        style="overflow-x: auto"
      >
        <template v-slot:table-row="props">
          <template v-if="checkboxFields.includes(props.column.field)">
            <div class="checkbox-container">
              <input
                type="checkbox"
                :checked="props.row[props.column.field] == 1"
                @change="
                  (event) => {
                    props.row[props.column.field] = event.target.checked
                      ? 1
                      : 0;
                    trackUpload(props.row, props.column.field);
                  }
                "
              />
            </div>
          </template>
          <template v-else-if="props.column.editable !== false">
            <input
              v-model="props.row[props.column.field]"
              @input="trackUpload(props.row, props.column.field)"
            />
          </template>
          <template v-else>
            <span>{{ props.row[props.column.field] }}</span>
          </template>
        </template>
      </vue-good-table>
    </div>

    <button @click="exportToExcel">Export to Excel</button>
    <button @click="saveChanges">Save Updates</button>
    <div class="table-container">
      <vue-good-table
        v-if="!loading && !error"
        :columns="columns"
        :rows="marketingData"
        :pagination-options="{ enabled: true, mode: 'pages', perPage: 10 }"
        :search-options="{ enabled: true }"
        :sort-options="{ enabled: true }"
        style="overflow-x: auto"
        @on-filtered="onTableFiltered"
      >
        <template v-slot:table-row="props">
          <template v-if="checkboxFields.includes(props.column.field)">
            <div class="checkbox-container">
              <input
                type="checkbox"
                :checked="props.row[props.column.field] == 1"
                @change="
                  props.row[props.column.field] = $event.target.checked ? 1 : 0
                "
              />
            </div>
          </template>

          <template v-else-if="props.column.editable !== false">
            <input
              v-model="props.row[props.column.field]"
              @input="trackChanges(props.row, props.column.field)"
            />
          </template>
          <template v-else>
            <span>{{ props.row[props.column.field] }}</span>
          </template>
        </template>
      </vue-good-table>
    </div>
  </div>
</template>

<style>
.table-container {
  width: 100%;
  overflow-x: auto;
  max-width: 100%;
  position: relative;
  margin-top: "200px";
}
.vue-good-table th,
.vue-good-table td {
  padding: 4px 8px; /* Sebelumnya mungkin lebih besar */
  font-size: 12px; /* Kurangi ukuran font */
  white-space: nowrap;
}
.vue-good-table thead th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 5;
  font-size: 12px; /* Ubah dari default (biasanya 14px atau lebih) */
  padding: 4px 6px; /* Kurangi padding agar tidak terlalu tinggi */
}
.vue-good-table th:nth-child(1),
.vue-good-table td:nth-child(1) {
  position: sticky;
  left: 0;
  background: white;
  z-index: 4;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}
.vue-good-table th:nth-child(2),
.vue-good-table td:nth-child(2) {
  position: sticky;
  left: 100px;
  background: white;
  z-index: 4;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}
.vue-good-table table {
  min-width: 1200px;
}

.checkbox-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.error {
  color: red;
}
input {
  padding: 3px;
  font-size: 12px; /* font size */
  width: 95%;
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
</style>
