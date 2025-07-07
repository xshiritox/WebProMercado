<template>
  <div class="overflow-hidden">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 text-white overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]"></div>
        <div class="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-radial from-white/10 to-transparent rounded-full"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Servicios Profesionales
          </h1>
          <p class="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Encuentra los mejores servicios profesionales cerca de ti. Conecta con expertos en diferentes áreas.
          </p>
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

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="container mx-auto">
        <!-- Filters -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Filtros de búsqueda</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <div class="relative">
                <input
                  v-model="searchInput"
                  @input="handleSearch"
                  type="text"
                  placeholder="Buscar servicios..."
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 shadow-sm hover:shadow-md"
                />
                <IconSearch class="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <!-- Category Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
              <select
                v-model="selectedCategoryLocal"
                @change="handleCategoryChange"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todas las categorías</option>
                <option v-for="category in serviceCategories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <!-- Price Range -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Precio</label>
              <select
                v-model="priceRange"
                @change="handlePriceFilter"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Cualquier precio</option>
                <option value="0-50000">Hasta $50,000</option>
                <option value="50000-200000">$50,000 - $200,000</option>
                <option value="200000-500000">$200,000 - $500,000</option>
                <option value="500000-1000000">$500,000 - $1,000,000</option>
                <option value="1000000+">Más de $1,000,000</option>
              </select>
            </div>

            <!-- Sort -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
              <select
                v-model="sortByLocal"
                @change="handleSortChange"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="created_at">Más recientes</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
                <option value="rating">Mejor valorados</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Results Info -->
        <div class="flex justify-between items-center mb-6">
          <p class="text-gray-600">
            Mostrando {{ filteredServices?.length || 0 }} servicios
            <span v-if="searchQuery">de "{{ searchQuery }}"</span>
            <span v-if="selectedCategory">en {{ selectedCategory }}</span>
          </p>
          
          <router-link
            v-if="isAuthenticated"
            to="/post-service"
            class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus class="w-4 h-4" />
            Publicar Servicio
          </router-link>
        </div>

        <!-- Services Grid -->
        <div v-if="loadingServices">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div v-for="n in 8" :key="n" class="animate-pulse bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div class="bg-gray-200 rounded-xl h-48 mb-4"></div>
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div class="h-8 bg-gray-200 rounded-lg w-full"></div>
            </div>
          </div>
        </div>

        <div v-else-if="filteredServices.length === 0" class="mt-12 text-center py-16 bg-gray-50 rounded-2xl">
          <div class="max-w-md mx-auto">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-50 mb-4">
              <IconWrench class="h-10 w-10 text-primary-600" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">No se encontraron servicios</h3>
            <p class="text-gray-600 mb-6">Intenta ajustar tus filtros de búsqueda o publica un nuevo servicio.</p>
            <button 
              @click="resetFilters"
              class="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Restablecer filtros
            </button>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
            v-for="service in filteredServices" 
            :key="service.id"
            class="bg-white rounded-lg shadow-md overflow-hidden card-hover cursor-pointer"
            @click="viewService(service)"
          >
            <!-- Service Image -->
            <div class="relative h-48 bg-gray-100 overflow-hidden">
              <div v-if="!service.images?.[0]" class="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                <IconWrench class="w-12 h-12 mb-2" />
                <span class="text-sm">Sin imagen disponible</span>
              </div>
              <img
                v-else
                :src="service.images[0]"
                :alt="service.title"
                class="w-full h-full object-cover"
              />
              <!-- Favorite Button -->
              <div class="absolute top-2 right-2 bg-white rounded-full p-1 shadow cursor-pointer hover:bg-gray-100" @click.stop="toggleFavorite(service)">
                <IconHeart 
                  :class="[isFavorite('service', service.id) ? 'text-red-500 fill-current' : 'text-gray-400']" 
                  class="w-5 h-5 transition-colors duration-200" 
                />
              </div>
              <div class="absolute top-2 left-2 flex flex-col gap-2">
                <div v-if="service.featured">
                  <span
                    class="bg-secondary-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                  >
                    <IconStar class="w-3 h-3" />
                    Destacado
                  </span>
                </div>
                <div>
                  <span
                    class="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ service.category }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Service Info -->
            <div class="p-4">
              <div class="flex items-start justify-between mb-2">
                <h3 class="font-semibold text-gray-900 truncate">{{ service.title }}</h3>
                <span class="text-lg font-bold text-primary-600">
                  {{ formatPrice(service.price_from) }}
                  <span v-if="service.price_to" class="text-sm font-normal text-gray-500">
                    - {{ formatPrice(service.price_to) }}
                  </span>
                </span>
              </div>

              <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                {{ service.description }}
              </p>

              <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
                <div class="flex items-center text-sm text-gray-500">
                  <IconMapPin class="w-4 h-4 mr-1" />
                  <span>{{ service.location || 'Ubicación no especificada' }}</span>
                </div>
                <div class="flex items-center text-sm text-gray-500">
                  <IconClock class="w-4 h-4 mr-1" />
                  <span>{{ formatDate(service.created_at) }}</span>
                </div>
              </div>

              <!-- Provider Info -->
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <IconStar class="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span class="text-gray-600 text-sm">{{ service.rating || '5.0' }}</span>
                  <span class="text-gray-400 text-sm ml-1"></span>
                </div>
                <span class="text-sm text-gray-600">{{ service.profile?.full_name || 'Proveedor' }}</span>
              </div>
                
              <div v-if="service.profile?.badge" class="flex items-center">
                <span
                  :class="badgeClass(service.profile.badge)"
                  class="px-2 py-1 rounded-full text-xs font-medium text-white"
                >
                  {{ badgeText(service.profile.badge) }}
                </span>
              </div>

              <!-- Action Button -->
              <div class="mt-4">
                <button
                  @click.stop="viewService(service)"
                  class="w-full btn-primary justify-center"
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- How It Works Section -->
    <section class="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -left-1/4 -bottom-1/4 w-full h-full bg-gradient-radial from-primary-500/5 to-transparent rounded-full"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-full mb-4">
            ¿Cómo Funciona?
          </span>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Encuentra el servicio perfecto</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Conectamos a clientes con los mejores profesionales de manera fácil y segura
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="relative group bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary-100">
            <div class="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <IconSearch class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">1. Busca</h3>
            <p class="text-gray-600 mb-4">Explora nuestra amplia gama de profesionales y servicios especializados</p>
            <div class="absolute bottom-6 left-6 w-8 h-0.5 bg-gradient-to-r from-primary-500 to-transparent transition-all duration-300 group-hover:w-12"></div>
          </div>

          <!-- Feature 2 -->
          <div class="relative group bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-secondary-100">
            <div class="w-12 h-12 rounded-xl bg-secondary-50 text-secondary-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <IconMessageCircle class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">2. Contacta</h3>
            <p class="text-gray-600 mb-4">Comunícate directamente con los profesionales para discutir tu proyecto</p>
            <div class="absolute bottom-6 left-6 w-8 h-0.5 bg-gradient-to-r from-secondary-500 to-transparent transition-all duration-300 group-hover:w-12"></div>
          </div>

          <!-- Feature 3 -->
          <div class="relative group bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-accent-100">
            <div class="w-12 h-12 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <IconCheckCircle class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">3. Contrata</h3>
            <p class="text-gray-600 mb-4">Elige al profesional ideal y disfruta de un servicio de calidad</p>
            <div class="absolute bottom-6 left-6 w-8 h-0.5 bg-gradient-to-r from-accent-500 to-transparent transition-all duration-300 group-hover:w-12"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Professional Registration CTA -->
    <section class="relative py-20 bg-gradient-to-br from-primary-700 to-secondary-600 text-white overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]"></div>
        <div class="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-radial from-white/10 to-transparent rounded-full"></div>
      </div>
      
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-6">
          <span class="text-sm font-medium">¿Eres un Profesional?</span>
        </div>
        
        <h2 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Únete a nuestra plataforma
        </h2>
        
        <p class="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          Conecta con miles de clientes potenciales y haz crecer tu negocio
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            v-if="!isAuthenticated"
            to="/register"
            class="group relative bg-white text-primary-600 hover:bg-gray-50 font-medium py-4 px-8 rounded-xl transition-all duration-300 flex items-center gap-2 justify-center text-lg hover:shadow-2xl hover:-translate-y-1"
          >
            <span class="relative z-10 flex items-center gap-2">
              <IconUserPlus class="w-5 h-5" />
              Registrarse como Profesional
            </span>
            <span class="absolute inset-0 rounded-xl bg-gradient-to-r from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </router-link>
          
          <router-link
            v-else
            to="/post-service"
            class="group relative bg-white text-primary-600 hover:bg-gray-50 font-medium py-4 px-8 rounded-xl transition-all duration-300 flex items-center gap-2 justify-center text-lg hover:shadow-2xl hover:-translate-y-1"
          >
            <span class="relative z-10 flex items-center gap-2">
              <IconPlus class="w-5 h-5" />
              Publicar Servicio
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
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFavorites } from '../composables/useFavorites'
import { useAuth } from '../composables/useAuth'
import { 
  Search as IconSearch, 
  Plus as IconPlus,
  Wrench as IconWrench,
  Star as IconStar,
  Heart as IconHeart,
  UserPlus as IconUserPlus,
  MessageCircle as IconMessageCircle,
  CheckCircle as IconCheckCircle,
  MapPin as IconMapPin,
  Clock as IconClock
} from 'lucide-vue-next'
import { useServices } from '../composables/useServices'

const router = useRouter()
const route = useRoute()
const { isAuthenticated } = useAuth()
const { 
  addToFavorites, 
  removeFromFavorites, 
  isFavorite, 
  loadFavorites, 
  favorites 
} = useFavorites()

// Cargar servicios al montar el componente
onMounted(async () => {
  if (isAuthenticated.value) {
    await loadFavorites()
  }
  await getServices()
  
  // Aplicar filtros de la URL si existen
  if (route.query.search) {
    searchInput.value = route.query.search.toString()
    searchServices(searchInput.value)
  }
  
  if (route.query.category) {
    selectedCategoryLocal.value = route.query.category.toString()
    filterByCategory(selectedCategoryLocal.value)
  }
  
  if (route.query.sort) {
    sortByLocal.value = route.query.sort.toString()
    setSortBy(sortByLocal.value)
  }
  
  if (route.query.price) {
    priceRange.value = route.query.price.toString()
    setPriceRange(priceRange.value)
  }
})

const { 
  filteredServices,
  loading: loadingServices,
  serviceCategories,
  searchQuery,
  selectedCategory,
  searchServices,
  filterByCategory,
  setSortBy,
  setPriceRange,
  getServices
} = useServices()

const searchInput = ref('')
const selectedCategoryLocal = ref('')
const sortByLocal = ref('created_at')
const priceRange = ref('')

const handleSearch = () => {
  searchServices(searchInput.value)
}

const handleCategoryChange = () => {
  filterByCategory(selectedCategoryLocal.value)
}

const handleSortChange = () => {
  setSortBy(sortByLocal.value)
}

const handlePriceFilter = () => {
  setPriceRange(priceRange.value)
}

const resetFilters = () => {
  searchInput.value = ''
  selectedCategoryLocal.value = ''
  sortByLocal.value = 'created_at'
  priceRange.value = ''
  
  // Reset all filters
  searchServices('')
  filterByCategory('')
  setSortBy('created_at')
  setPriceRange('')
}

const viewService = (service: any) => {
  router.push(`/service/${service.id}`)
}

const toggleFavorite = async (service: any) => {
  if (!isAuthenticated.value) {
    // Redirigir al login si no está autenticado
    router.push('/login')
    return
  }

  try {
    if (isFavorite('service', service.id)) {
      // Encontrar el ID del favorito para eliminarlo
      const fav = favorites.value.find((f: any) => f.service_id === service.id)
      if (fav) {
        await removeFromFavorites(fav.id)
      }
    } else {
      await addToFavorites('service', service.id)
    }
  } catch (error) {
    console.error('Error al actualizar favoritos:', error)
  }
}

const loadServices = async () => {
  try {
    await getServices()
  } catch (error) {
    console.error('Error cargando servicios:', error)
  }
}

const formatPrice = (price: number) => {
  if (!price) return '$0'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-CO', { 
    day: 'numeric', 
    month: 'short' 
  })
}

const badgeClass = (badge?: string) => {
  switch (badge) {
    case 'destacado':
      return 'badge-destacado'
    case 'colaborador':
      return 'badge-colaborador'
    case 'vip':
      return 'badge-vip'
    case 'moderador':
      return 'badge-moderador'
    case 'admin':
      return 'badge-admin'
    default:
      return 'bg-gray-500'
  }
}

const badgeText = (badge?: string) => {
  switch (badge) {
    case 'destacado':
      return 'Destacado'
    case 'colaborador':
      return 'Colaborador'
    case 'vip':
      return 'VIP'
    case 'moderador':
      return 'Moderador'
    case 'admin':
      return 'Admin'
    default:
      return ''
  }
}

// Cargar servicios cuando el componente se monta
onMounted(() => {
  loadServices()
})

// Observar cambios en los parámetros de la ruta
watch(() => route.query, (newQuery) => {
  if (newQuery.search) {
    searchInput.value = newQuery.search as string
    searchServices(searchInput.value)
  } else if (searchInput.value) {
    searchInput.value = ''
    searchServices('')
  }
  
  if (newQuery.category) {
    selectedCategoryLocal.value = newQuery.category as string
    filterByCategory(selectedCategoryLocal.value)
  } else if (selectedCategoryLocal.value) {
    selectedCategoryLocal.value = ''
    filterByCategory('')
  }
}, { immediate: true })
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>