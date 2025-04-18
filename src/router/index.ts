import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { jwtDecode } from "jwt-decode";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import { Sidebar } from "primevue";

// Daftar Routes
const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/dashboard" },
  { path: "/login", name: "login", component: LoginView },
  {
    path: "/admin",
    name: "admin",
    meta: { requiresAuth: true, minimumLevel: 0 },
    children: [
      {
        path: "users",
        name: "admin-users",
        component: () => import("../views/admin/UsersView.vue"),
        meta: { requiresAuth: true, minimumLevel: 0 },
      },
      {
        path: "test",
        name: "admin-test",
        component: () => import("../views/admin/AdminTest.vue"),
        meta: { requiresAuth: true, minimumLevel: 0 },
      },
    ],
  },
  {
    path: "/error",
    name: "error",
    children: [
      {
        path: "403",
        name: "forbidden",
        component: () => import("../views/errors/403.vue"),
      },
      {
        path: "404",
        name: "not found",
        component: () => import("../views/errors/404.vue"),
      },
    ],
  },
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
    meta: {
      hideHeader: false, // sembunyikan Appheader.vue
      hideSidebar: true // sembunyikan Sidebar.vue
    }
  },
  {
    path: "/absensi",
    name: "absensi",
    component: () => import("../views/AbsensiView.vue"),
    meta: {
      hideHeader: false, // sembunyikan Appheader.vue
      hideSidebar: true // sembunyikan Sidebar.vue
    }
  },
  {
    path: "/pengumuman-test",
    name: "pengumuman",
    component: () => import("../views/PengumumanTestingView.vue"),
  },
  {
    path: "/fleet",
    name: "fleet",
    component: () => import("../views/FleetView.vue"),
    meta: { hideHeader: false }, // sembunyikan Appheader.vue
  },
  {
    path: "/de/down-equipment",
    name: "de-down-equipment",
    component: () => import("../views/de/DownEquipment.vue"),
    meta: { hideHeader: false }, // sembunyikan Appheader.vue
  },
  {
    path: "/de/admin",
    name: "admin",
    component: () => import("../views/de/AdminForm.vue"),
    meta: { hideHeader: false }, // sembunyikan Appheader.vue
  },
  {
    path: "/de/dashboard",
    name: "de-dashboard",
    component: () => import("../views/de/DeDashboard.vue"),
    meta: {
      hideHeader: true, // sembunyikan Appheader.vue
      hideSidebar: true // sembunyikan Sidebar.vue
    }
  },
  {
    path: "/hr/dashboard",
    name: "hr-dashboard",
    component: () => import("../views/hr/HrDashboardView.vue"),
    meta: { hideHeader: false }, // sembunyikan Appheader.vue
  },
  {
    path: "/hr/absensi",
    name: "hr-absensi",
    component: () => import("../views/hr/AbsensiView.vue"),
    meta: { hideHeader: false }, // sembunyikan Appheader.vue
  },
  {
    path: "/hr/absensi-detail",
    name: "hr-absensi-detail",
    component: () => import("../views/hr/AbsensiDetailView.vue"),
    meta: { hideHeader: false }, // sembunyikan Appheader.vue
  },
  {
    path: "/marketing-dashboard",
    name: "marketing-dashboard",
    component: () => import("../views/Marketing-DashboardView.vue"),
    meta: { hideHeader: false }, // sembunyikan Appheader.vue
  },
  {
    path: "/marketing-admin",
    name: "marketing-admin",
    component: () => import("../views/MarketingAdminView.vue"),
    meta: { hideHeader: false }, // sembunyikan Appheader.vue
  },
  {
    path: "/test",
    name: "test",
    component: () => import("../views/TestView.vue"),
  },
  {
    path: "/detest",
    name: "detest",
    component: () => import("@/views/de/DeTestView.vue"),
  },
  {
    path: "/it",
    name: "it",
    component: () => import("@/views/de/MtTestView.vue"),
  },
  {
    path: "/mt",
    name: "mt",
    component: () => import("@/components/MiniTable.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/ProfileView.vue"),
  },
  {
    path: "/inventory",
    name: "inventory",
    component: () => import("../views/InventoryView.vue"),
    meta: { hideSidebar: true }, // sembunyikan Sidebar.vue
  },
  {
    path: "/inventory-detail",
    name: "inventory-detail",
    component: () => import("../views/InventoryDetailView.vue"),
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
  { path: "/:pathMatch(.*)*", redirect: "/error/404" }, // Redirect untuk route yang tidak ditemukan
];

// Buat router
const router = createRouter({
  history: createWebHistory("/office/"),
  routes,
});

// Middleware untuk autentikasi sebelum masuk ke halaman tertentu
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  // console.log(from, " -> ", to);

  if (!("requiresAuth" in to.meta)) {
    // no login needed
    next();
  } else if (to.meta.requiresAuth && !token) {
    // need login first
    console.warn("🔒 Akses ditolak! Harus login dulu.");
    next("/login");
  }
  const decoded = jwtDecode(token);
  const user_level = parseInt(decoded.user_level, 10);
  if (to.meta.minimumLevel && user_level > (to.meta.minimumLevel as number)) {
    console.warn(`⛔ Akses ditolak! Hubungi admin jika membutuhkan izin`);
    next("/error/403");
  } else {
    next();
  }
});

export default router;
