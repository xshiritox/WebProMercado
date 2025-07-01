import type { RouteRecordRaw } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import ProductsPage from '../pages/ProductsPage.vue'
import ProductDetailPage from '../pages/ProductDetailPage.vue'
import PostProductPage from '../pages/PostProductPage.vue'
import PropertiesPage from '../pages/PropertiesPage.vue'
import ServicesPage from '../pages/ServicesPage.vue'
import AdminPage from '../pages/AdminPage.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    name: 'products',
    component: ProductsPage
  },
  {
    path: '/product/:id',
    name: 'product-detail',
    component: ProductDetailPage
  },
  {
    path: '/post-product',
    name: 'post-product',
    component: PostProductPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/properties',
    name: 'properties',
    component: PropertiesPage
  },
  {
    path: '/services',
    name: 'services',
    component: ServicesPage
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage
  }
]