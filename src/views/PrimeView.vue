<template>
    <div class="card">
        <h2>Marketing Data</h2>

        <!-- Filter Section -->
        <div class="filter-container">
            <div v-for="col in columns" :key="col.field" class="filter-box">
                <label>{{ col.header }}</label>
                <InputText v-model="filters[col.field]" placeholder="Search..." class="filter-input" />
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="button-group">
            <Button label="Upload" @click="upload" class="p-button-sm" />
            <Button label="Add New Row" @click="addNewRow" class="p-button-sm p-button-secondary" />
            <Button label="Export to Excel" @click="exportToExcel" class="p-button-sm p-button-success" />
            <Button label="Save Updates" @click="saveChanges" class="p-button-sm p-button-warning" />
        </div>

        <!-- Loading & Error Messages -->
        <p v-if="loading" class="loading-text">Loading...</p>
        <p v-if="error" class="error-text">{{ error }}</p>

        <!-- Data Table -->
        <DataTable v-if="!loading && !error"
            :value="filteredData"
            editMode="cell"
            sortMode="multiple"
            scrollable scrollHeight="400px"
            paginator :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            showGridlines tableStyle="min-width: 2000px; overflow-x: auto;"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            @cell-edit-complete="onCellEditComplete">

            <template #paginatorstart>
                <Button type="button" icon="pi pi-refresh" text @click="fetchMarketingData" />
            </template>
            <template #paginatorend>
                <Button type="button" icon="pi pi-download" text @click="exportToExcel" />
            </template>

            <!-- Serial Number Column -->
            <Column header="#" style="width: 50px; text-align: center;">
                <template #body="{ index }">
                    {{ index + 1 }}
                </template>
            </Column>

            <!-- Data Columns -->
            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" style="white-space: nowrap;">
                <template #body="{ data, field }">
                    <template v-if="checkboxFields.includes(field)">
                        <Checkbox v-model="data[field]" :binary="true" />
                    </template>
                    <template v-else>
                        {{ data[field] }}
                    </template>
                </template>
                <template #editor="{ data, field }">
                    <template v-if="checkboxFields.includes(field)">
                        <Checkbox v-model="data[field]" :binary="true" />
                    </template>
                    <template v-else>
                        <InputText v-model="data[field]" autofocus fluid />
                    </template>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import axios from 'axios';
import * as XLSX from 'xlsx';

const apiUrl = "https://www.transkon-rent.com/api/marketing";
const marketingData = ref([]);
const loading = ref(true);
const error = ref(null);
const filters = ref({});
const checkboxFields = ["front_bumper", "rear_bumper", "roll_bar", "rops"];

const columns = ref([
    { field: 'name_customer', header: 'Customer Name' },
    { field: 'location', header: 'Location' },
    { field: 'plan_hub', header: 'Plan Hub' },
    { field: 'total_unit', header: 'Total Unit' },
    { field: 'period', header: 'Period' },
    { field: 'brand', header: 'Brand' },
    { field: 'model_unit', header: 'Model Unit' },
    { field: 'type_unit', header: 'Type Unit' },
    { field: 'inquiry', header: 'Inquiry' },
    { field: 'date_rfq', header: 'Date RFQ' },
    { field: 'date_deadline_tender', header: 'Deadline Tender' },
    { field: 'approval_presdir', header: 'Approval Presdir' }
]);

const fetchMarketingData = async () => {
    try {
        loading.value = true;
        const response = await axios.get(apiUrl);
        marketingData.value = response.data;
    } catch (err) {
        error.value = "Failed to fetch data";
        console.error(err);
    } finally {
        loading.value = false;
    }
};

const filteredData = computed(() => {
    return marketingData.value.map((item, index) => ({
        ...item,
        nomor_urut: index + 1
    })).filter(item => {
        return Object.keys(filters.value).every(field => {
            const filterValue = filters.value[field]?.toLowerCase() || "";
            return filterValue === "" || String(item[field]).toLowerCase().includes(filterValue);
        });
    });
});

const addNewRow = () => {
    marketingData.value.push({
        name_customer: '', location: '', plan_hub: '', total_unit: 0
    });
};

const upload = async () => {
    console.log("Uploading data...");
};

const saveChanges = async () => {
    console.log("Saving changes...");
};

const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(marketingData.value);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Marketing Data");
    XLSX.writeFile(workbook, "Marketing_Data.xlsx");
};

const onCellEditComplete = (event) => {
    let { data, field, newValue } = event;
    data[field] = newValue;
};

onMounted(fetchMarketingData);
</script>

<style scoped>
/* General Styles */
.card {
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    max-width: 100%;
    overflow-x: auto;
}

/* Button Group */
.button-group {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

/* Filter Section */
.filter-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 15px;
}

.filter-box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.filter-box label {
    font-size: 12px;
    font-weight: bold;
}

.filter-input {
    width: 150px;
    padding: 5px;
    font-size: 12px;
}

/* Loading & Error Messages */
.loading-text {
    color: blue;
    font-weight: bold;
}

.error-text {
    color: red;
    font-weight: bold;
}

/* Data Table */
.p-datatable {
    border-radius: 16px;
    overflow: hidden;
}

.p-datatable th {
    background: #a7a7a7;
    text-align: center;
}

.p-datatable td {
    text-align: center;
    padding: 8px;
    white-space: nowrap;
}

/* Scroll */
.p-datatable-wrapper {
    overflow-x: auto;
}

/* Paginator */
.p-paginator {
    margin-top: 30px;
}
</style>