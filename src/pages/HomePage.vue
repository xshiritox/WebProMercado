<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-primary-600 to-secondary-500 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Compra y Vende en
            <span class="text-secondary-200">PubliNet</span>
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-blue-100">
            La plataforma líder para productos, propiedades y servicios
          </p>
          
          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto mb-8">
            <div class="relative">
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                type="text"
                placeholder="¿Qué estás buscando?"
                class="w-full px-6 py-4 text-gray-900 rounded-lg focus:ring-4 focus:ring-blue-300 focus:outline-none text-lg"
              />
              <button
                @click="handleSearch"
                class="absolute right-2 top-2 px-6 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
              >
                <Search class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-wrap justify-center gap-4">
            <router-link
              to="/products"
              class="btn-secondary text-lg px-6 py-3 justify-center flex-1 sm:flex-none min-w-[200px]"
            >
              <Package class="w-5 h-5" />
              Ver Productos
            </router-link>
            <router-link
              to="/properties"
              class="btn-secondary text-lg px-6 py-3 justify-center flex-1 sm:flex-none min-w-[200px]"
            >
              <Home class="w-5 h-5" />
              Ver Propiedades
            </router-link>
            <router-link
              to="/services"
              class="btn-secondary text-lg px-6 py-3 justify-center flex-1 sm:flex-none min-w-[200px]"
            >
              <Wrench class="w-5 h-5" />
              Ver Servicios
            </router-link>
            <router-link
              v-if="!isAuthenticated"
              to="/register"
              class="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-all duration-200 flex items-center gap-2 justify-center text-lg"
            >
              <UserPlus class="w-5 h-5" />
              Registrarse Gratis
            </router-link>
            <router-link
              v-else
              to="/post-product"
              class="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-all duration-200 flex items-center gap-2 justify-center text-lg"
            >
              <Plus class="w-5 h-5" />
              Publicar Producto
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Categorías Populares</h2>
          <p class="text-gray-600 text-lg">Encuentra lo que necesitas en nuestras categorías más buscadas</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            v-for="category in categories"
            :key="category.name"
            @click="navigateToCategory(category.name)"
            class="bg-gray-50 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer card-hover"
          >
            <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <component :is="category.icon" class="w-6 h-6 text-primary-600" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">{{ category.name }}</h3>
            <p class="text-sm text-gray-600">{{ category.count }}+ anuncios</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
          <p class="text-gray-600 text-lg">Los mejores productos de nuestra comunidad</p>
        </div>

        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="n in 8" :key="n" class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div class="h-48 bg-gray-200"></div>
            <div class="p-4">
              <div class="h-4 bg-gray-200 rounded mb-2"></div>
              <div class="h-3 bg-gray-200 rounded mb-2"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
          />
        </div>

        <div class="text-center mt-12">
          <router-link
            to="/products"
            class="btn-outline text-lg px-8 py-3"
          >
            Ver Todos los Productos
            <ArrowRight class="w-5 h-5" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">¿Por qué PubliNet?</h2>
          <p class="text-gray-600 text-lg">La mejor plataforma para comprar y vender en Colombia</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield class="w-8 h-8 text-primary-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Seguro y Confiable</h3>
            <p class="text-gray-600">Sistema de verificación de usuarios y transacciones seguras</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap class="w-8 h-8 text-secondary-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Rápido y Fácil</h3>
            <p class="text-gray-600">Publica tus productos en minutos y llega a miles de compradores</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users class="w-8 h-8 text-accent-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Comunidad Activa</h3>
            <p class="text-gray-600">Usuarios activos en toda Colombia</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-primary-600 to-secondary-500 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
        <p class="text-xl mb-8 text-blue-100">
          Únete a la comunidad de compra y venta más grande de Colombia
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            v-if="!isAuthenticated"
            to="/register"
            class="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-all duration-200 flex items-center gap-2 justify-center text-lg"
          >
            <UserPlus class="w-5 h-5" />
            Crear Cuenta Gratis
          </router-link>
          <router-link
            v-else
            to="/post-product"
            class="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-all duration-200 flex items-center gap-2 justify-center text-lg"
          >
            <Plus class="w-5 h-5" />
            Publicar mi Primer Producto
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { 
  Search, Package, UserPlus, Plus, ArrowRight, Shield, Zap, Users,
  Smartphone, Car, Home, Shirt, Dumbbell, Book, Building, Wrench
} from 'lucide-vue-next'
import ProductCard from '../components/ProductCard.vue'
import { useAuth } from '../composables/useAuth'
import { useProducts } from '../composables/useProducts'

const router = useRouter()
const { isAuthenticated } = useAuth()
const { getProducts, loading } = useProducts()

const searchQuery = ref('')
const featuredProducts = ref<any[]>([])

interface Category {
  name: string
  icon: any
  count?: number
}

const categories = ref<Category[]>([
  { name: 'Electrónicos', icon: Smartphone, count: 0 },
  { name: 'Vehículos', icon: Car, count: 0 },
  { name: 'Hogar y Jardín', icon: Home, count: 0 },
  { name: 'Moda y Belleza', icon: Shirt, count: 0 },
  { name: 'Deportes', icon: Dumbbell, count: 0 },
  { name: 'Libros y Música', icon: Book, count: 0 },
  { name: 'Inmuebles', icon: Building, count: 0 },
  { name: 'Servicios', icon: Wrench, count: 0 }
])

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'products', query: { search: searchQuery.value } })
  }
}

const navigateToCategory = (category: string) => {
  router.push({ name: 'products', query: { category } })
}

const loadCategoryCounts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('status', 'active')
      .not('category', 'is', null)

    if (error) throw error

    // Contar productos por categoría
    const counts: Record<string, number> = {}
    data?.forEach((item: any) => {
      counts[item.category] = (counts[item.category] || 0) + 1
    })

    // Actualizar los contadores en las categorías, filtrar las que tienen 0 y ordenar de mayor a menor
    categories.value = categories.value
      .map(cat => ({
        ...cat,
        count: counts[cat.name] || 0
      }))
      .filter(cat => cat.count > 0) // Solo mantener categorías con al menos un producto
      .sort((a, b) => b.count - a.count)
  } catch (error) {
    console.error('Error al cargar el conteo de productos por categoría:', error)
  }
}

onMounted(async () => {
  const [products] = await Promise.all([
    getProducts(),
    loadCategoryCounts()
  ])
  featuredProducts.value = products?.slice(0, 8) || []
})
</script>