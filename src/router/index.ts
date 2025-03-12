import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";

interface RouteMeta {
  requiresAuth?: boolean;
  minimumLevel?: number;
  [key: string]: unknown;
  [key: symbol]: unknown; // Allows additional properties
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/test",
    name: "test",
    component: () =>
      import(/* webpackChunkName: "test" */ "../views/TestView.vue"),
  },
  {
    path: "/marketing",
    name: "marketing",
    component: () =>
      import(/* webpackChunkName: "marketing" */ "../views/MarketingView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/marketing-e",
    name: "marketing-e",
    component: () =>
      import(
        /* webpackChunkName: "marketing-e" */ "../views/MarketingViewE.vue"
      ),
    meta: { requiresAuth: true, minimumLevel: 5 } as RouteMeta,
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Add type assertion to ensure meta is always of the correct type
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const user_level_g = localStorage.getItem("user_level");
  const user_level = user_level_g ? parseInt(user_level_g, 10) : 10;
  // Ensure meta is defined before accessing it
  const meta = to.meta as RouteMeta;
  if (meta.requiresAuth && !token) {
    next("/login");
  } else if (meta.minimumLevel && meta.minimumLevel < user_level) {
    next("/");
  } else {
    next();
  }
});

export default router;
