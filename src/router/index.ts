import type { RouteRecordRaw } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import ProductsPage from '../pages/ProductsPage.vue'
import ProductDetailPage from '../pages/ProductDetailPage.vue'
import PostProductPage from '../pages/PostProductPage.vue'
import EditProductPage from '../pages/EditProductPage.vue'
import PropertiesPage from '../pages/PropertiesPage.vue'
import PropertyDetailPage from '../pages/PropertyDetailPage.vue'
import PostPropertyPage from '../pages/PostPropertyPage.vue'
import EditPropertyPage from '../pages/EditPropertyPage.vue'
import ServicesPage from '../pages/ServicesPage.vue'
import ServiceDetailPage from '../pages/ServiceDetailPage.vue'
import PostServicePage from '../pages/PostServicePage.vue'
import EditServicePage from '../pages/EditServicePage.vue'
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
    path: '/product/:id/edit',
    name: 'edit-product',
    component: EditProductPage,
    meta: { requiresAuth: true }
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
    path: '/property/:id',
    name: 'property-detail',
    component: PropertyDetailPage
  },
  {
    path: '/property/:id/edit',
    name: 'edit-property',
    component: EditPropertyPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/post-property',
    name: 'post-property',
    component: PostPropertyPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/services',
    name: 'services',
    component: ServicesPage
  },
  {
    path: '/service/:id',
    name: 'service-detail',
    component: ServiceDetailPage
  },
  {
    path: '/service/:id/edit',
    name: 'edit-service',
    component: EditServicePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/post-service',
    name: 'post-service',
    component: PostServicePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true },
    beforeEnter: async (to, from, next) => {
      const { isAuthenticated, isAdmin, profile } = useAuth()
      
      // Verificar autenticación
      if (!isAuthenticated.value) {
        next('/login')
        return
      }
      
      // Verificar si el perfil está cargado
      if (!profile.value) {
        // Esperar un momento para que se cargue el perfil
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      // Verificar permisos de administrador
      if (!isAdmin.value) {
        next('/')
        return
      }
      
      next()
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage
  }
]