<template>
  <nav class="bg-white shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center">
              <ShoppingBag class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold gradient-text">PubliNet</span>
          </router-link>
        </div>

        <!-- Search Bar -->
        <div class="flex-1 max-w-2xl mx-8">
          <div class="relative">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="¿Qué estás buscando?"
              class="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <Search class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <button
              @click="handleSearch"
              class="absolute right-2 top-1.5 px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <Search class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-4">
          <router-link
            to="/products"
            class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Productos
          </router-link>
          <router-link
            to="/properties"
            class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Propiedades
          </router-link>
          <router-link
            to="/services"
            class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Servicios
          </router-link>

          <!-- Auth Buttons -->
          <div v-if="!isAuthenticated" class="flex items-center space-x-2">
            <router-link
              to="/login"
              class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Iniciar Sesión
            </router-link>
            <router-link
              to="/register"
              class="btn-primary text-sm"
            >
              Registrarse
            </router-link>
          </div>

          <!-- User Menu -->
          <div v-else class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <User class="w-4 h-4 text-white" />
              </div>
              <span>{{ profile?.full_name }}</span>
              <ChevronDown class="w-4 h-4" />
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                Mi Perfil
              </router-link>
              <router-link
                to="/post-product"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                Publicar Producto
              </router-link>
              <router-link
                v-if="isAdmin"
                to="/admin"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                Administración
              </router-link>
              <button
                @click="handleSignOut"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          >
            <Menu class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="showMobileMenu" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
        <router-link
          to="/products"
          class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
          @click="showMobileMenu = false"
        >
          Productos
        </router-link>
        <router-link
          to="/properties"
          class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
          @click="showMobileMenu = false"
        >
          Propiedades
        </router-link>
        <router-link
          to="/services"
          class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
          @click="showMobileMenu = false"
        >
          Servicios
        </router-link>
        
        <div v-if="!isAuthenticated" class="pt-2">
          <router-link
            to="/login"
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
            @click="showMobileMenu = false"
          >
            Iniciar Sesión
          </router-link>
          <router-link
            to="/register"
            class="block px-3 py-2 text-base font-medium text-primary-600 hover:text-primary-700"
            @click="showMobileMenu = false"
          >
            Registrarse
          </router-link>
        </div>

        <div v-else class="pt-2">
          <router-link
            to="/profile"
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
            @click="showMobileMenu = false"
          >
            Mi Perfil
          </router-link>
          <router-link
            to="/post-product"
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
            @click="showMobileMenu = false"
          >
            Publicar Producto
          </router-link>
          <router-link
            v-if="isAdmin"
            to="/admin"
            class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
            @click="showMobileMenu = false"
          >
            Administración
          </router-link>
          <button
            @click="handleSignOut"
            class="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingBag, Search, User, ChevronDown, Menu } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { isAuthenticated, isAdmin, profile, signOut } = useAuth()

const searchQuery = ref('')
const showUserMenu = ref(false)
const showMobileMenu = ref(false)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'products', query: { search: searchQuery.value } })
  }
}

const handleSignOut = async (e?: Event) => {
  e?.preventDefault()
  e?.stopPropagation()
  
  try {
    // Cerrar menús antes de redirigir
    showUserMenu.value = false
    showMobileMenu.value = false
    
    // Esperar un momento para que los menús se cierren visualmente
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Cerrar sesión
    await signOut()
    
    // Redirigir a la página de inicio
    if (window.location.pathname !== '/') {
      router.push('/')
      // Forzar recarga en móviles para limpiar el estado
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location.href = '/'
      }
    }
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    // Forzar recarga en caso de error
    window.location.href = '/'
  }
}

// Close menus when clicking outside
document.addEventListener('click', (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.relative')) {
    showUserMenu.value = false
  }
})
</script>