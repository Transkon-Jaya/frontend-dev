<template>
    <div class="container mt-4">
      <div class="card p-4 shadow-sm">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="fw-bold">Inventory</h2>
          <input type="text" class="form-control w-25" placeholder="Search" v-model="searchQuery" />
        </div>
  
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>{{ product.name }}</td>
              <td>
                <img :src="product.image" alt="Product Image" class="product-img" />
              </td>
              <td>{{ formatRupiah(product.price) }}</td>
              <td>{{ product.category }}</td>
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
  export default {
    data() {
      return {
        searchQuery: "",
        products: [
          {
            id: 1,
            name: "Ban",
            image: "https://pixabay.com/get/g6bf130bf74f25c5422a162e79d49387712e20ee88aae279df1cb44486b042a4cdd07bcdf85701f9b15f5ad6baf095310dee7fe0d3e5273e93eaa8c28c348f572a8b2f427a79cf70e6fc655478619ae6c_640.jpg",
            price: 1250000,
            category: "Stok LV",
            stock: 10,
            status: "INSTOCK",
          },
          {
            id: 2,
            name: "Pin Caliper",
            image: "https://pixabay.com/get/g836cbdefc96ebe0ca1cc1d38dfa7ee84296ca0f287cd2a114e370262d955f49f1d2628991184e73bc608bd69c5bc951ead509ede500525d9e77076be97f681eef380075920a631346396429e1d219876_640.jpg",
            price: 120000,
            category: "Stok LV",
            stock: 5,
            status: "INSTOCK",
          },
          {
            id: 3,
            name: "Piston",
            image: "https://pixabay.com/get/g65f8d9481b9e51ab0a0c3f5f4225d1f049797d0640744070774a6048dcd9e6737e02b37c3fa90106433272632d7b11ab36c3b8c82468ce92ba77c771e7775b2fac3788a8b80040c3e26062405f46d958_640.jpg",
            price: 300000,
            category: "Stok LV",
            stock: 2,
            status: "LOWSTOCK",
          },
          {
            id: 4,
            name: "Bantalan",
            image: "https://pixabay.com/get/gd04f4a683050d1343ee79a47a8cd3ee532942beb83e3422c27f6c96b7d09664ba7ec5bc090646bafd1f3a2b713e5cc3b3946a2ae44f136001e96966e69350cb71bb7a1eb4534de7c673194bdead1aeed_640.jpg",
            price: 400000,
            category: "Stok LV",
            stock: 8,
            status: "INSTOCK",
          },
          {
            id: 5,
            name: "Pompa",
            image: "https://pixabay.com/get/g3ede2324559aec28373a26b364b781c29badbcba01763699cb73788aef6c76239dcf620c2d39d7037469c09dd9ea2da3235d858824538ec8056090dc640340b0c7f7e33a7e11f07b0ea773c184ad937c_640.jpg",
            price: 1500000,
            category: "Stok LV",
            stock: 0,
            status: "OUTSTOCK",
          },
        ],
      };
    },
    computed: {
      filteredProducts() {
        return this.products.filter((product) =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      },
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
    },
  };
  </script>
  
  <style scoped>
  .product-img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
  }
  .badge {
    font-size: 14px;
    padding: 5px 10px;
  }
  .text-end {
    text-align: right;
  }
  </style>
  