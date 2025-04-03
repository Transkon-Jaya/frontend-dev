<template>
    <div class="container mt-4">
      <div class="card p-4 shadow-sm">
        <h2 class="fw-bold">Inventory Detail</h2>
        <div v-if="product">
          <div class="d-flex align-items-center mb-3">
            <img :src="product.image" alt="Product Image" class="detail-img me-3" />
            <div>
              <p class="mb-1"><strong>Name:</strong> {{ product.name }}</p>
              <p class="mb-1"><strong>Unit:</strong> {{ product.unit }}</p>
              <p class="mb-1"><strong>Price:</strong> {{ formatRupiah(product.price) }}</p>
              <p class="mb-1"><strong>Category:</strong> {{ product.category }}</p>
              <p class="mb-1"><strong>Stock:</strong> {{ product.stock }}</p>
              <p class="mb-1"><strong>Status:</strong> <span :class="getStatusClass(product.status)">{{ product.status }}</span></p>
            </div>
          </div>
          
          <!-- Stock Transaction Table -->
          <h4 class="fw-bold mt-4">Stock Transaction History</h4>
          <table class="table table-bordered mt-3">
            <thead class="table-light">
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, index) in product.stockHistory" :key="index">
                <td>{{ entry.date }}</td>
                <td :class="getTransactionClass(entry.type)">{{ entry.type }}</td>
                <td>{{ entry.quantity }}</td>
                <td>{{ entry.notes }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <router-link to="/inventory" class="btn btn-danger mt-3">Back to Inventory</router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        product: {
          id: 1,
          name: "Ban",
          unit: "Triton 4x4",
          image: import.meta.env.BASE_URL + "/images/ban.jpg",
          price: 1250000,
          category: "P1",
          stock: 10,
          status: "INSTOCK",
          stockHistory: [
            { date: "2025-03-25", type: "IN", quantity: 5, notes: "Restock from supplier" },
            { date: "2025-03-20", type: "OUT", quantity: 2, notes: "Used for vehicle maintenance" },
            { date: "2025-03-15", type: "IN", quantity: 8, notes: "Initial stock" }
          ]
        }
      };
    },
    methods: {
      formatRupiah(value) {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(value);
      },
      getStatusClass(status) {
        if (status === "INSTOCK") return "badge bg-success";
        if (status === "LOWSTOCK") return "badge bg-warning text-dark";
        if (status === "OUTSTOCK") return "badge bg-danger";
      },
      getTransactionClass(type) {
        return type === "IN" ? "text-success fw-bold" : "text-danger fw-bold";
      }
    }
  };
  </script>
  
  <style scoped>
  .detail-img {
    width: 200px;
    height: 200px;
    border-radius: 5px;
    object-fit: cover;
  }
  .badge {
    font-size: 14px;
    padding: 5px 10px;
    width: 100px;
  }
  .table th, .table td {
    vertical-align: middle;
    text-align: center;
  }
  </style>