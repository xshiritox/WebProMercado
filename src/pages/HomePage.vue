<template>
  <div class="overflow-hidden">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 text-white overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]"></div>
        <div class="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-radial from-white/10 to-transparent rounded-full"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div class="text-center max-w-4xl mx-auto">
  
          
          <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Descubre y compra en
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-secondary-200 to-white">Kroma</span>
          </h1>
          
          <p class="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Conectamos a compradores y vendedores en una plataforma segura, rápida y fácil de usar. Encuentra lo que necesitas o vende lo que ya no usas.
          </p>
          
          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto">
            <div class="relative shadow-2xl rounded-xl overflow-hidden">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search class="w-5 h-5 text-gray-400" />
              </div>
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                type="text"
                placeholder="¿Qué estás buscando?"
                class="w-full px-12 py-4 text-gray-900 focus:outline-none text-lg"
              />
              <button
                @click="handleSearch"
                class="absolute right-2 top-2 px-6 py-2.5 bg-gradient-to-r from-secondary-500 to-primary-500 text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Wave divider -->
      <div class="absolute bottom-0 left-0 right-0 overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="w-full h-16 md:h-24">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512,52,583,67.3c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                opacity="0.25" class="fill-white"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,141.56,72.41,11.5,20.05,17.58,40.49,21.91,64.18V0Z" 
                opacity="0.5" class="fill-white"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,86c57.52-8.08,108.87-34.5,145.24-68.21,14-12.93,27.95-25.77,43.56-34.69V0Z" 
                class="fill-white"></path>
        </svg>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 bg-white relative">
      <div class="absolute inset-0 bg-gradient-to-b from-white to-gray-50 -z-10"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-full mb-4">
            Categorías
          </span>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Explora por categoría</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre una amplia variedad de productos, propiedades y servicios en nuestras categorías más populares
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div
            v-for="(category, index) in categories"
            :key="category.name"
            @click="navigateToCategory(category.name)"
            class="group relative bg-white rounded-2xl p-6 text-center hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden"
            :class="[
              'hover:border-primary-100',
              index % 3 === 0 ? 'hover:shadow-primary-100/20' : 
              index % 3 === 1 ? 'hover:shadow-secondary-100/20' : 
              'hover:shadow-accent-100/20'
            ]"
          >
            <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                 :class="[
                   index % 3 === 0 ? 'from-primary-50/50 to-white' : 
                   index % 3 === 1 ? 'from-secondary-50/50 to-white' : 
                   'from-accent-50/50 to-white'
                 ]">
            </div>
            <div class="relative z-10">
              <div class="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300"
                   :class="[
                     'group-hover:scale-110',
                     index % 3 === 0 ? 'bg-primary-50 text-primary-600' : 
                     index % 3 === 1 ? 'bg-secondary-50 text-secondary-600' : 
                     'bg-accent-50 text-accent-600'
                   ]">
                <component :is="category.icon" class="w-6 h-6" />
              </div>
              <h3 class="font-semibold text-gray-900 mb-1 text-lg group-hover:text-primary-600 transition-colors">
                {{ category.name }}
              </h3>
              <p class="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                {{ category.count }}+ anuncios
              </p>
            </div>
          </div>
        </div>
        
        <div class="mt-12 text-center">
          <router-link 
            to="/categories" 
            class="inline-flex items-center gap-2 px-6 py-3 text-primary-600 hover:text-primary-700 font-medium rounded-lg border border-primary-200 hover:border-primary-300 bg-white hover:bg-primary-50 transition-all duration-200"
          >
            Ver todas las categorías
            <ArrowRight class="w-5 h-5" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute inset-0 overflow-hidden opacity-10">
        <div class="absolute -right-1/4 -top-1/4 w-full h-full bg-gradient-radial from-primary-500/20 to-transparent rounded-full"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-full mb-4">
            Productos Destacados
          </span>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Descubre lo más popular</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Productos cuidadosamente seleccionados por nuestra comunidad
          </p>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div class="animate-pulse">
              <div class="bg-gray-200 h-48 w-full"></div>
              <div class="p-4 space-y-3">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-3 bg-gray-200 rounded w-full"></div>
                <div class="h-3 bg-gray-200 rounded w-5/6"></div>
                <div class="flex justify-between items-center pt-4">
                  <div class="h-6 bg-gray-200 rounded w-20"></div>
                  <div class="w-6 h-6 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="product in featuredProducts" 
            :key="product.id"
            class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100"
          >
            <div class="relative pb-[75%] bg-gray-100 overflow-hidden">
              <img 
                :src="product.image_url || 'https://placehold.co/400x300/e5e7eb/9ca3af?text=Sin+imagen'" 
                :alt="product.name"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span class="text-white font-medium">Ver detalles</span>
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-gray-900 mb-1 line-clamp-1">{{ product.name }}</h3>
              <p class="text-sm text-gray-500 mb-2 line-clamp-2 h-10">{{ product.description }}</p>
              <div class="flex items-center justify-between mt-3">
                <span class="text-lg font-bold text-gray-900">${{ formatPrice(product.price) }}</span>
                <button class="text-primary-600 hover:text-primary-700 transition-colors">
                  <Plus class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-12">
          <router-link
            to="/products"
            class="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            Explorar todos los productos
            <ArrowRight class="w-5 h-5" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -left-1/4 -bottom-1/4 w-full h-full bg-gradient-radial from-primary-500/5 to-transparent rounded-full"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-full mb-4">
            Nuestras Ventajas
          </span>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">¿Por qué elegir Kroma?</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            La plataforma más confiable para comprar y vender en Colombia
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Feature 1 -->
          <div class="relative group bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary-100">
            <div class="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Shield class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Seguridad Garantizada</h3>
            <p class="text-gray-600 mb-4">Perfiles verificados y transacciones seguras para tu tranquilidad.</p>
            <div class="absolute bottom-6 left-6 w-8 h-0.5 bg-gradient-to-r from-primary-500 to-transparent transition-all duration-300 group-hover:w-12"></div>
          </div>

          <!-- Feature 2 -->
          <div class="relative group bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-secondary-100">
            <div class="w-12 h-12 rounded-xl bg-secondary-50 text-secondary-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Zap class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Rápido y Fácil</h3>
            <p class="text-gray-600 mb-4">Publica en minutos y llega a miles de compradores potenciales.</p>
            <div class="absolute bottom-6 left-6 w-8 h-0.5 bg-gradient-to-r from-secondary-500 to-transparent transition-all duration-300 group-hover:w-12"></div>
          </div>

          <!-- Feature 3 -->
          <div class="relative group bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-accent-100">
            <div class="w-12 h-12 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Comunidad Activa</h3>
            <p class="text-gray-600 mb-4">Miles de usuarios activos en todo el país buscando oportunidades.</p>
            <div class="absolute bottom-6 left-6 w-8 h-0.5 bg-gradient-to-r from-accent-500 to-transparent transition-all duration-300 group-hover:w-12"></div>
          </div>

          <!-- Feature 4 -->
          <div class="relative group bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary-100">
            <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Mejores Oportunidades</h3>
            <p class="text-gray-600 mb-4">Encuentra las mejores ofertas y precios del mercado.</p>
            <div class="absolute bottom-6 left-6 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-transparent transition-all duration-300 group-hover:w-12"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative py-20 bg-gradient-to-br from-primary-700 to-secondary-600 text-white overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]"></div>
        <div class="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-radial from-white/10 to-transparent rounded-full"></div>
      </div>
      
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-6">
          <span class="text-sm font-medium">¡Únete a nuestra comunidad!</span>
        </div>
        
        <h2 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          ¿Listo para comenzar a comprar y vender?
        </h2>
        
        <p class="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          Únete a miles de usuarios que ya están disfrutando de la mejor experiencia de compra y venta en línea
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            v-if="!isAuthenticated"
            to="/register"
            class="group relative bg-white text-primary-600 hover:bg-gray-50 font-medium py-4 px-8 rounded-xl transition-all duration-300 flex items-center gap-2 justify-center text-lg hover:shadow-2xl hover:-translate-y-1"
          >
            <span class="relative z-10 flex items-center gap-2">
              <UserPlus class="w-5 h-5" />
              Crear Cuenta Gratis
            </span>
            <span class="absolute inset-0 rounded-xl bg-gradient-to-r from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </router-link>
          
          <router-link
            v-else
            to="/post-product"
            class="group relative bg-white text-primary-600 hover:bg-gray-50 font-medium py-4 px-8 rounded-xl transition-all duration-300 flex items-center gap-2 justify-center text-lg hover:shadow-2xl hover:-translate-y-1"
          >
            <span class="relative z-10 flex items-center gap-2">
              <Plus class="w-5 h-5" />
              Publicar Producto
            </span>
            <span class="absolute inset-0 rounded-xl bg-gradient-to-r from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </router-link>
          
          <router-link
            to="/how-it-works"
            class="group relative bg-transparent border-2 border-white/20 hover:border-white/40 text-white hover:bg-white/10 font-medium py-4 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 justify-center text-lg"
          >
            <span class="relative z-10 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Cómo funciona
            </span>
          </router-link>
        </div>
      </div>
      
      <!-- Wave divider -->
      <div class="absolute bottom-0 left-0 right-0 overflow-hidden rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="w-full h-16 md:h-24">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512,52,583,67.3c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                opacity="0.25" class="fill-white"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,141.56,72.41,11.5,20.05,17.58,40.49,21.91,64.18V0Z" 
                opacity="0.5" class="fill-white"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,86c57.52-8.08,108.87-34.5,145.24-68.21,14-12.93,27.95-25.77,43.56-34.69V0Z" 
                class="fill-white"></path>
        </svg>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { 
  Search, UserPlus, Plus, ArrowRight, Shield, Zap, Users,
  Smartphone, Car, Home, Shirt, Dumbbell, Book, Building, Wrench, TrendingUp
} from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'
import { useProducts } from '../composables/useProducts'

const router = useRouter()
const { isAuthenticated } = useAuth()
const { getProducts, loading } = useProducts()

const searchQuery = ref('')
const featuredProducts = ref<any[]>([])

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO').format(price)
}

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