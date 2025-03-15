<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Toast from "primevue/toast";
import * as XLSX from "xlsx";

const apiUrl = "https://www.transkon-rent.com/api/marketing";
const marketingData = ref([]);
const columns = ref([]);
const loading = ref(true);
const error = ref(null);
const toast = useToast();

// Fetch Data
const fetchMarketingData = async () => {
  try {
    loading.value = true;
    const response = await axios.get(apiUrl);

    if (response.data.length > 0) {
      columns.value = [
        { field: "id", header: "ID", sortable: true, frozen: true },
        ...Object.keys(response.data[0])
          .filter((key) => key !== "id")
          .map((key) => ({
            field: key,
            header: key.replace(/_/g, " ").toUpperCase(),
            sortable: true,
          })),
      ];
    }

    marketingData.value = response.data.map((item) => ({
      ...item,
      isEditing: false,
    }));
  } catch (err) {
    error.value = "Failed to fetch data";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Update Data
const updateMarketingData = async (item) => {
  try {
    const updatedItem = { ...item };
    delete updatedItem.isEditing;
    await axios.put(`${apiUrl}/${item.id}`, updatedItem);
    item.isEditing = false;
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Row updated successfully!",
      life: 3000,
    });
  } catch (err) {
    console.error("Update failed:", err);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to update row!",
      life: 3000,
    });
  }
};

// Export to Excel
const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(marketingData.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Marketing Data");
  XLSX.writeFile(workbook, "Marketing_Data.xlsx");
};

// Computed Data
const formattedData = computed(() => marketingData.value);

onMounted(fetchMarketingData);
</script>

<template>
  <div class="container">
    <h2>Marketing Data (PrimeVue Table)</h2>

    <Button
      label="Export to Excel"
      icon="pi pi-file-excel"
      class="p-button-success"
      @click="exportToExcel"
    />

    <p v-if="loading">Loading...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <Toast />

    <DataTable
      v-if="!loading && !error"
      :value="formattedData"
      paginator
      :rows="10"
      class="p-datatable-sm"
    >
      <Column field="id" header="ID" sortable frozen></Column>
      <Column
        v-for="col in columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        sortable
      >
        <template #body="{ data, field }">
          <InputText v-if="data.isEditing" v-model="data[field]" />
          <span v-else>{{ data[field] }}</span>
        </template>
      </Column>
      <Column header="Actions" frozen>
        <template #body="{ data }">
          <Button
            :label="data.isEditing ? 'Save' : 'Edit'"
            :icon="data.isEditing ? 'pi pi-check' : 'pi pi-pencil'"
            class="p-button-sm p-button-rounded"
            @click="
              data.isEditing
                ? updateMarketingData(data)
                : (data.isEditing = true)
            "
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
}
.error {
  color: red;
}
</style>
