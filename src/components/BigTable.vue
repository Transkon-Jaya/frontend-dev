<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import { VueGoodTable } from "vue-good-table-next";
import "vue-good-table-next/dist/vue-good-table-next.css";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import * as XLSX from "xlsx";

import { useUserStore} from "@/stores/user.js";
const userData = useUserStore();

const props = defineProps({
  settings: {
    type: Object,
    required: true,
  },
  urls: {
    type: Object,
    required: true,
  },
  fields: {
    type: Object,
    required: true,
  },
  canInsert: {
    type: Boolean,
    default: true
  },
  canUpdate: {
    type: Boolean,
    default: true
  }
});

const settings = ref();
const urls = ref();
const fields = ref();
const canInsert = ref();
const canUpdate = ref();

settings.value = props.settings;
urls.value = props.urls;
fields.value = props.fields;
canInsert.value = props.canInsert;
canUpdate.value = props.canUpdate;

fields.value.toRemove = ["isEditing", "filterable", "vgt_id", "originalIndex"];

const datas = ref({data : [], dropdowns : []});
const columns = ref([]);
let insertColumns = ref([]);

const DataInsert = ref([]);
const filteredData = ref([]); // Store filtered data
const loading = ref(true);
const error = ref(null);
const firstColumnWidth = ref("150px");
const secondColumnWidth = ref("100px");
const changedRows = ref(new Map()); // Store changed rows
const changedRowsInsert = ref(new Map());


const fetchAllDropdowns = async () => {
  const dropdownKeys = Object.keys(urls.value.dropdowns);

  for (const key of dropdownKeys) {
    const url = urls.value.dropdowns[key].url;
    const valueField = urls.value.dropdowns[key].valueField;
    const labelField = urls.value.dropdowns[key].labelField;
    
    try {
      const response = await axios.get(url);

    //   datas.value.dropdowns[labelField] = response.data.map(item => ({
    //     value: item[valueField] ?? "",
    //   }));
      datas.value.dropdowns[labelField] = response.data.map((item) => item[valueField] ?? "");
    } catch (error) {
      console.error(`Failed to fetch ${key} data from ${url}:`, error);
    }
  }
//   console.log("Fetched dropdown data:", Object.keys(datas.value.dropdowns));
};

const fetchData = async () => {
  try {
    loading.value = true;
    const response = await axios.get(urls.value.data);
    if (response.data.length > 0) {
        columns.value = [
        {
            label: fields.value.firstCol.label,
            field: fields.value.firstCol.field,
            width: "80px",
            minWidth: "100px",
            sortable: true,
            filterable: false,
            editable: false,
            frozen: true,
            type: fields.value.firstCol.type,
            headerClass: "custom-header",
        },
        ...Object.keys(response.data[0])
            .filter((key) => key !== fields.value.firstCol.field)
            .map((key) => {
            const isCheckbox = fields.value.checkbox.includes(key);

            const isNumeric =
                !isCheckbox &&
                response.data.every((row) => {
                const value = row[key];
                return !isNaN(Number(value));
                });

            return {
                label: key.replace(/_/g, " ").toUpperCase(),
                field: key,
                sortable: true,
                filterable: true,
                filterOptions: { enabled: true, placeholder: `${key}` },
                editable: canUpdate.value && !fields.value.uneditable.includes(key),
                type: isCheckbox ? "checkbox" : isNumeric ? "number" : "text",
                width:
                Math.max(
                    ...response.data.map((item) => String(item?.[key] ?? "").length),
                    key.length
                ) *
                    10 +
                20 +
                "px",
                minWidth: "80px",
                headerClass: "custome-header",
            };
            }),
        ];
    }
    insertColumns = computed(() =>
        columns.value.map(col => ({
            ...col,
            filterOptions: { enabled: false },
            sortable: false,
        }))
    );
    datas.value.data = response.data.map((item) => ({
      ...item,
      filterable: true,
    }));
    datas.value.data = response.data.map((item) => {
        const formatted = {};

        for (const key in item) {
            const value = item[key];

            if (value === null || value === undefined) {
            formatted[key] = value;
            } else {
            const num = Number(value);
            formatted[key] = isNaN(num) ? String(value) : num;
            }
        }

        // Add your extra field like this
        formatted.filterable = true;

        return formatted;
    });


    filteredData.value = [...datas.value.data]; // Initialize filtered data

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
    newRow[col.field] = fields.value.checkbox.includes(col.field) ? 0 : "";
  });
  newRow.id = DataInsert.value.length + 1;
  DataInsert.value.push(newRow);
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
      for (const prop of fields.value.toRemove) {
        delete uploadItem[prop];
      }
      delete uploadItem["id"];
      console.log(uploadItem);
      fields.value.date.forEach((key) => {
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
      console.log(uploadItem);
      await axios.post(urls.value.data, uploadItem);
      await fetchData();
    //   alert("Data uploaded Successfully");
      DataInsert.value = [];
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
      for (const prop of fields.value.toRemove) {
        delete updatedItem[prop];
      }
      fields.value.date.forEach((key) => {
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
      console.log(updatedItem);
      await axios.put(urls.value.data, updatedItem);
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
  console.log("F Len : ", filteredData.value.length, " | M Len : ", datas.value.data.length);
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
    fetchAllDropdowns();
    fetchData();
    console.log(datas.value.dropdowns);

  window.addEventListener("resize", updateColumnWidths);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateColumnWidths);
});
</script>

<template>
  <div>
    <h2>{{ settings.title }}</h2>
    <button v-if="canInsert" @click="upload">Upload</button>
    <button v-if="canInsert" @click="addNewRow">Add New Row</button>
    <p v-if="loading">Loading...</p>
    <p v-if="error" class="error">{{ error }}</p>
    <!-- INSERT TABLE -->
    <div class="table-container">
      <vue-good-table
        v-if="!loading && !error && canInsert"
        :columns="insertColumns"
        :rows="DataInsert"
        :search-options="{ enabled: false }"
        :sort-options="{ enabled: false }"
        :line-numbers="false"
        :select-options="{ enabled: false }"
        :pagination-options="{ enabled: false }"
        style="overflow-x: auto"
      >
        <template v-slot:table-row="props">
          <template v-if="fields.checkbox.includes(props.column.field)">
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
          <template v-else-if="Object.keys(datas.dropdowns).includes(props.column.field)">
            <Multiselect
                v-model="props.row[props.column.field]"
                :options="datas.dropdowns[props.column.field] || []"
                :searchable="true"
                :allow-empty="false"
                :placeholder="`Select ${props.column.field}`"
                @update:modelValue="trackUpload?.(props.row, props.column.field) || trackChanges?.(props.row, props.column.field)"
            />
            </template>
          <template v-else-if="fields.date.includes(props.column.field)">
            <input
              type="date"
              v-model="props.row[props.column.field]"
              @input="trackUpload(props.row, props.column.field)"
            />
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
    <!-- UPDATE TABLE -->
    <div class="table-container">
      <vue-good-table
        v-if="!loading && !error"
        :columns="columns"
        :rows="datas.data"
        :pagination-options="{ enabled: true, mode: 'pages', perPage: 10 }"
        :search-options="{ enabled: true }"
        :sort-options="{ enabled: true }"
        style="overflow-x: auto"
        @on-filtered="onTableFiltered"
      >
        <template v-slot:table-row="props">
          <template v-if="fields.checkbox.includes(props.column.field)">
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
          <template v-else-if="Object.keys(datas.dropdowns).includes(props.column.field) && canUpdate">
            <Multiselect
                v-model="props.row[props.column.field]"
                :options="datas.dropdowns[props.column.field] || []"
                :searchable="true"
                :allow-empty="false"
                :placeholder="`Select ${props.column.field}`"

                noResultsText="No matching results"
                @update:modelValue="trackUpload?.(props.row, props.column.field) || trackChanges?.(props.row, props.column.field)"
            />
            </template>
          <!-- <template v-else-if="props.column.field === 'name_customer'">
            <Multiselect
              v-model="props.row[props.column.field]"
              :options="datas.dropdowns.name_customer || []"
              :searchable="true"
              :allow-empty="false"
              placeholder="Select customer..."
              noResultsText="No matching customers found"
              @update:modelValue="trackChanges(props.row, props.column.field)"
            />
          </template>
          <template v-else-if="props.column.field === 'location'">
            <Multiselect
              v-model="props.row[props.column.field]"
              :options="datas.dropdowns.location || []"
              :searchable="true"
              :allow-empty="true"
              placeholder="Select location..."
              noResultsText="No matching customers found"
              @update:modelValue="trackChanges(props.row, props.column.field)"
            />
          </template> -->
          <template v-else-if="fields.date.includes(props.column.field)">
            <input
              type="date"
              v-model="props.row[props.column.field]"
              @input="trackChanges(props.row, props.column.field)"
            />
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
/* .table-container {
  width: 100%;
  overflow-x: auto;
  max-width: 100%;
  position: relative;
  margin-top: "200px";
  height: 100%;
  padding: 0px 0px;
} */

.vgt-table th { /* table header */
  padding: 0.5px 5px;
  font-size: 13px;
  font-weight: bold;
  text-align: center;
  color: #333;
}

table.vgt-table td {/* table row / cell */
  padding: 0.5px 5px;
}

.checkbox-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75%;
  padding: 1px;
}

.error {
  color: red;
}
input {
  padding: 0px 0px;
  font-size: 12px; /* font size */
  width: 100%;
  margin: 0px 0px;
  border: none !important;
  outline: none !important;
  height: 100%;
}

.vgt-wrap__footer .footer__row-count__label,
.vgt-wrap__footer .footer__row-count__select,
.vgt-wrap__footer .footer__navigation__page-btn span,
.vgt-wrap__footer .footer__navigation__page-info span {
    font-size: 12px;
}

.multiselect__content-wrapper {
  position:absolute !important;
  z-index: 9999 !important;
  min-height: 100px !important;
  max-height: 100px !important;
  overflow-y: auto !important;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

button {
  padding: 3px 8px;
  margin: 5px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 0.25rem;
}
button:hover {
  background-color: #218838;
}
</style>
