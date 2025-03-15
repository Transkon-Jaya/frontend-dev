import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";

// Daftar Routes
const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/dashboard" },
  { path: "/login", name: "login", component: LoginView },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
  },
  {
    path: "/test",
    name: "test",
    component: () => import("../views/TestView.vue"),
  },
  {
    path: "/marketing",
    name: "marketing",
    component: () => import("../views/MarketingView.vue"),
    meta: { requiresAuth: true, minimumLevel: 10 },
  },
  {
    path: "/marketing-e",
    name: "marketing-e",
    component: () => import("../views/MarketingViewE.vue"),
    meta: { requiresAuth: true, minimumLevel: 5 },
  },
  { path: "/:pathMatch(.*)*", redirect: "/dashboard" }, // Redirect untuk route yang tidak ditemukan
];

// Buat router
const router = createRouter({
  history: createWebHistory("/office/"),
  routes,
});

// Middleware untuk autentikasi sebelum masuk ke halaman tertentu
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const user_level = parseInt(localStorage.getItem("user_level") || "0", 10); // Default 0 jika tidak ada
  console.log(`${user_level} > ${to.meta.minimumLevel}`);
  // Cek apakah route memiliki meta auth atau minimumLevel
  if (to.meta.requiresAuth && !token) {
    console.warn("🔒 Akses ditolak! Harus login dulu.");
    next("/login");
  } else if (
    to.meta.minimumLevel &&
    user_level > (to.meta.minimumLevel as number) // ✅ Type assertion agar TypeScript mengenali tipe
  ) {
    console.warn(
      `⛔ Akses ditolak! Level ${user_level} kurang dari ${to.meta.minimumLevel}`
    );
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
