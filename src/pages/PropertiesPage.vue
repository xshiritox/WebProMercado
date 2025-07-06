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
            Propiedades Inmobiliarias
          </h1>
          <p class="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Encuentra tu próximo hogar o la mejor inversión inmobiliaria en nuestra selección de propiedades.
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
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Transaction Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
          <select
            v-model="filters.transaction_type"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            @change="() => setFilters({ transaction_type: filters.transaction_type })"
          >
            <option value="">Todos</option>
            <option v-for="type in transactionTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>

        <!-- Property Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Propiedad</label>
          <select
            v-model="filters.property_type"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            @change="() => setFilters({ property_type: filters.property_type })"
          >
            <option value="">Todas</option>
            <option v-for="type in propertyTypes" :key="type" :value="type.toLowerCase()">
              {{ type }}
            </option>
          </select>
        </div>

        <!-- Location -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
          <select
            v-model="filters.location"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            @change="() => setFilters({ location: filters.location })"
          >
            <option value="">Todas las ciudades</option>
            <option v-for="city in colombianCities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
        </div>

        <!-- Price Range -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="filters.min_price"
              type="number"
              placeholder="Mínimo"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
            <span class="text-gray-500">-</span>
            <input
              v-model.number="filters.max_price"
              type="number"
              placeholder="Máximo"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <!-- Bedrooms -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Habitaciones</label>
          <select
            v-model.number="filters.bedrooms"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option :value="null">Cualquier cantidad</option>
            <option v-for="n in 5" :key="n" :value="n">
              {{ n }}+ {{ n === 1 ? 'dormitorio' : 'dormitorios' }}
            </option>
            <option value="6">6+ dormitorios</option>
          </select>
            </div>
          </div>
        </div>

        <!-- Results Info -->
        <div class="flex justify-between items-center mb-6">
          <p class="text-gray-600">
            Mostrando {{ filteredProperties.length }} propiedades
            <span v-if="filters.transaction_type">en {{ filters.transaction_type === 'venta' ? 'venta' : 'arriendo' }}</span>
            <span v-if="filters.location">en {{ filters.location }}</span>
          </p>
          
          <router-link
            v-if="isAuthenticated"
            to="/post-property"
            class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <IconPlus class="w-4 h-4" />
            Publicar Propiedad
          </router-link>
        </div>

        <!-- Properties Grid -->
        <div v-if="loading">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div v-for="n in 8" :key="n" class="animate-pulse bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div class="bg-gray-200 rounded-xl h-48 mb-4"></div>
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div class="h-8 bg-gray-200 rounded-lg w-full"></div>
            </div>
          </div>
        </div>

        <div v-else-if="filteredProperties.length === 0" class="mt-12 text-center py-16 bg-gray-50 rounded-2xl">
          <div class="max-w-md mx-auto">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-50 mb-4">
              <IconHome class="h-10 w-10 text-primary-600" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">No se encontraron propiedades</h3>
            <p class="text-gray-600 mb-6">Intenta ajustar tus filtros de búsqueda o publica una nueva propiedad.</p>
            <button 
              @click="resetFilters"
              class="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Restablecer filtros
            </button>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="property in filteredProperties" 
            :key="property.id" 
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            @click="viewProperty(property.id)"
          >
            <!-- Property Image -->
            <div class="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
              <div v-if="!property.images?.[0]" class="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                <IconImageOff class="w-full h-48 object-cover bg-gray-100" />
                <span class="text-sm">Sin imagen disponible</span>
              </div>
              <img
                v-else
                :src="property.images[0]"
                :alt="property.title"
                class="w-full h-full object-contain bg-white p-2"
              />
              <div class="absolute top-2 left-2">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium text-white"
                  :class="property.transaction_type === 'venta' ? 'bg-green-500' : 'bg-blue-500'"
                >
                  {{ property.transaction_type === 'venta' ? 'Venta' : 'Alquiler' }}
                </span>
              </div>
              <div class="absolute top-2 right-2 flex flex-col items-end gap-2">
                <div 
                  class="bg-white rounded-full p-1 shadow cursor-pointer hover:bg-gray-100" 
                  @click.stop="handleToggleFavorite(property.id, $event)"
                >
                  <IconHeart 
                    :class="[isFavorite('property', property.id) ? 'text-red-500 fill-current' : 'text-gray-400']" 
                    class="w-5 h-5 transition-colors duration-200" 
                  />
                </div>
                <div v-if="property.featured">
                  <span class="bg-secondary-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <IconStar class="w-4 h-4 text-yellow-400 fill-current" />
                    Destacado
                  </span>
                </div>
              </div>
            </div>

            <!-- Property Info -->
            <div class="p-4">
              <div class="flex items-start justify-between mb-2">
                <h3 class="font-semibold text-gray-900 truncate flex-1">{{ property.title }}</h3>
                <span class="text-lg font-bold text-primary-600 ml-2 whitespace-nowrap">
                  {{ formatPrice(property.price) }}
                </span>
              </div>

              <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                {{ property.description }}
              </p>

              <!-- Property Details -->
              <div class="flex items-center justify-between text-sm text-gray-600 mb-3">
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-1">
                    <IconBed class="w-4 h-4 text-gray-400" />
                    <span>{{ property.bedrooms || 'N/A' }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <IconBath class="w-4 h-4 text-gray-400" />
                    <span>{{ property.bathrooms || 'N/A' }}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div class="flex items-center gap-1">
                  <IconMapPin class="w-4 h-4 text-gray-400" />
                  <span>{{ property.location }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <IconClock class="w-4 h-4 text-gray-400" />
                  <span>{{ formatDate(property.created_at) }}</span>
                </div>
              </div>

              <!-- Action Button -->
              <div class="mt-4">
                <button
                  @click="viewProperty(property.id)"
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProperties } from '../composables/useProperties'
import { useFavorites } from '../composables/useFavorites'
import { useAuth } from '../composables/useAuth'
import { 
  Plus as IconPlus, 
  MapPin as IconMapPin, 
  Bed as IconBed, 
  Bath as IconBath, 
  Star as IconStar,
  Home as IconHome,
  ImageOff as IconImageOff,
  Heart as IconHeart,
  Clock as IconClock
} from 'lucide-vue-next'

const router = useRouter()
const { isFavorite, addToFavorites } = useFavorites()
const { user } = useAuth()
const { 
  filteredProperties,
  loading,
  filters,
  setFilters,
  transactionTypes,
  propertyTypes,
  getProperties,
  viewProperty
} = useProperties()

// Computed para verificar autenticación
const isAuthenticated = computed(() => !!user.value)

// Función para manejar el cambio de favoritos
const handleToggleFavorite = async (propertyId: string, event: Event) => {
  event.stopPropagation()
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  
  try {
    if (isFavorite('property', propertyId)) {
      // Aquí necesitaríamos obtener el ID del favorito para eliminarlo
      // Esto es un ejemplo y deberías adaptarlo a tu implementación real
      console.log('Eliminar de favoritos:', propertyId)
      // await removeFromFavorites(favoriteId)
    } else {
      await addToFavorites('property', propertyId)
    }
  } catch (error) {
    console.error('Error al actualizar favoritos:', error)
  }
}

// Función para restablecer filtros
const resetFilters = () => {
  setFilters({
    transaction_type: '',
    property_type: '',
    location: '',
    min_price: null,
    max_price: null,
    bedrooms: null,
    bathrooms: null
  })
}

// Lista de ciudades de Colombia para el filtro
const colombianCities = [
  'Bogotá',
  'Medellín',
  'Cali',
  'Barranquilla',
  'Cartagena',
  'Cúcuta',
  'Bucaramanga',
  'Pereira',
  'Santa Marta',
  'Ibagué',
  'Pasto',
  'Manizales',
  'Neiva',
  'Villavicencio',
  'Valledupar',
  'Montería',
  'Sincelejo',
  'Popayán',
  'Tunja',
  'Riohacha',
  'Quibdó',
  'Mocoa',
  'San Andrés',
  'Leticia'
]

// Cargar propiedades al montar el componente
onMounted(async () => {
  try {
    await getProperties()
  } catch (error) {
    console.error('Error al cargar propiedades:', error)
  }
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(price)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>