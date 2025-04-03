<template>
    <div class="container mt-4">
      <div class="card p-4 shadow-sm">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="fw-bold">Inventory</h2>
          <input type="text" class="form-control w-25" placeholder="Search" v-model="searchQuery" />
        </div>
  
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr class="filter-row">
              <th>
                <input type="text" class="form-control form-control-sm" placeholder="Filter name..." v-model="columnFilters.name" />
              </th>
              <th></th>
              <th>
                <div class="d-flex">
                  <select class="form-select form-select-sm me-1" v-model="priceFilter.operator">
                    <option value=">">></option>
                    <option value="<"><</option>
                    <option value="=">=</option>
                  </select>
                  <input type="number" class="form-control form-control-sm" placeholder="Price" v-model="priceFilter.value" />
                </div>
              </th>
              <th>
                <select class="form-select form-select-sm" v-model="columnFilters.category">
                  <option value="">All Categories</option>
                  <option v-for="cat in uniqueCategories" :value="cat">{{ cat }}</option>
                </select>
              </th>
              <th>
                <div class="d-flex">
                  <select class="form-select form-select-sm me-1" v-model="stockFilter.operator">
                    <option value=">">></option>
                    <option value="<"><</option>
                    <option value="=">=</option>
                  </select>
                  <input type="number" class="form-control form-control-sm" placeholder="Stock" v-model="stockFilter.value" />
                </div>
              </th>
              <th>
                <select class="form-select form-select-sm" v-model="columnFilters.status">
                  <option value="">All Status</option>
                  <option value="INSTOCK">In Stock</option>
                  <option value="LOWSTOCK">Low Stock</option>
                  <option value="OUTSTOCK">Out of Stock</option>
                </select>
              </th>
            </tr>
            <tr>
              <th>Item name</th>
              <th>Image</th>
              <th>Price</th>
              <th class="text-center">Category</th>
              <th class="text-right">Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            
            <tr v-for="product in filteredProducts" :key="product.id" @click="goToDetail(product.id)" class="clickable-row">
              <td>{{ product.name }}</td>
              <td>
                <img :src="product.image" alt="Product Image" class="product-img" />
              </td>
              <td>{{ formatRupiah(product.price) }}</td>
              <td class="text-center">{{ product.category }}</td>
              <td>{{ product.stock }}</td>
              <td>
                <span :class="getStatusClass(product.status)">{{ product.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
  
        <p class="mt-3">In total there are {{ filteredProducts.length }} products.</p>
      </div>
    </div>
  </template>
  
  <script>
import { RouterLink } from 'vue-router';

  export default {
    data() {
      return {
        searchQuery: "",
        columnFilters: { name: "", category: "", status: "" },
        priceFilter: { operator: ">", value: null },
        stockFilter: { operator: ">", value: null },
        products: [
          { id: 1, name: "Ban", image: import.meta.env.BASE_URL + "src/assets/images/avatars/ban.jpg", price: 1250000, category: "P1", stock: 10, status: "INSTOCK" },
          { id: 2, name: "Pin Caliper", image: import.meta.env.BASE_URL + "src/assets/images/avatars/caliper.jpg", price: 120000, category: "P2", stock: 5, status: "INSTOCK" },
          { id: 3, name: "Piston", image: import.meta.env.BASE_URL + "src/assets/images/avatars/piston.jpg", price: 300000, category: "P2", stock: 2, status: "LOWSTOCK" },
          { id: 4, name: "Bearing", image: import.meta.env.BASE_URL + "src/assets/images/avatars/bearing.jpg", price: 400000, category: "P1", stock: 8, status: "INSTOCK" },
          { id: 5, name: "Gear", image: import.meta.env.BASE_URL + "src/assets/images/avatars/Gear.jpg", price: 1500000, category: "P3", stock: 0, status: "OUTSTOCK" }
        ]
      };
    },
    computed: {
      uniqueCategories() {
        return [...new Set(this.products.map(item => item.category))];
      },
      filteredProducts() {
        return this.products.filter(product => {
          if (this.searchQuery && !product.name.toLowerCase().includes(this.searchQuery.toLowerCase())) return false;
          if (this.columnFilters.name && !product.name.toLowerCase().includes(this.columnFilters.name.toLowerCase())) return false;
          if (this.columnFilters.category && product.category !== this.columnFilters.category) return false;
          if (this.columnFilters.status && product.status !== this.columnFilters.status) return false;
          return true;
        });
      }
    },
    methods: {
      formatRupiah(value) {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
      },
      getStatusClass(status) {
        return status === "INSTOCK" ? "badge bg-success" : status === "LOWSTOCK" ? "badge bg-warning text-dark" : "badge bg-danger";
      },
      goToDetail(id) {
        this.$router.push({ name: "InventoryDetail", params: { id } });
      }
    }
  };
  </script>
  
  <style scoped>
  .product-img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
    object-fit: cover;
  }
  .badge {
    font-size: 14px;
    padding: 5px 10px;
    width: 100px;
  }
  .clickable-row {
    cursor: pointer;
  }
  .clickable-row:hover {
    background-color: #f1f1f1;
  }
  .text-center {
  text-align: center;
}
  </style>
  