<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Propiedades</h1>
      <p class="text-gray-600">Encuentra tu próximo hogar o inversión inmobiliaria</p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Transaction Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
          <select
            v-model="filters.transaction_type"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Todos</option>
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </div>

        <!-- Property Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Propiedad</label>
          <select
            v-model="filters.property_type"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Todas</option>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
            <option value="local">Local</option>
            <option value="oficina">Oficina</option>
            <option value="lote">Lote</option>
          </select>
        </div>

        <!-- Location -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
          <select
            v-model="filters.location"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Todas las ciudades</option>
            <option v-for="city in colombianCities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
        </div>

        <!-- Price Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Precio</label>
          <select
            v-model="filters.price_range"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Cualquier precio</option>
            <option value="0-200000000">Hasta $200M</option>
            <option value="200000000-500000000">$200M - $500M</option>
            <option value="500000000-1000000000">$500M - $1,000M</option>
            <option value="1000000000+">Más de $1,000M</option>
          </select>
        </div>

        <!-- Bedrooms -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Habitaciones</label>
          <select
            v-model="filters.bedrooms"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Cualquier cantidad</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Results Info -->
    <div class="flex justify-between items-center mb-6">
      <p class="text-gray-600">
        Mostrando {{ filteredProperties.length }} propiedades
      </p>
      
      <router-link
        v-if="isAuthenticated"
        to="/post-property"
        class="btn-primary"
      >
        <Plus class="w-4 h-4" />
        Publicar Propiedad
      </router-link>
    </div>

    <!-- Properties Grid -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="n in 6" :key="n" class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div class="h-48 bg-gray-200"></div>
        <div class="p-4">
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <div v-else-if="filteredProperties.length === 0" class="text-center py-12">
      <Home class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No se encontraron propiedades</h3>
      <p class="text-gray-600 mb-6">Intenta ajustar tus filtros de búsqueda</p>
      <router-link
        v-if="isAuthenticated"
        to="/post-property"
        class="btn-primary"
      >
        <Plus class="w-4 h-4" />
        Publicar la Primera Propiedad
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="property in filteredProperties"
        :key="property.id"
        class="bg-white rounded-lg shadow-md overflow-hidden card-hover cursor-pointer"
        @click="viewProperty(property.id)"
      >
        <!-- Property Image -->
        <div class="relative h-48 bg-gray-100">
          <div v-if="!property.images?.[0]" class="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
            <ImageOff class="w-12 h-12 mb-2" />
            <span class="text-sm">Sin imagen disponible</span>
          </div>
          <img
            v-else
            :src="property.images[0]"
            :alt="property.title"
            class="w-full h-full object-cover"
          />
          <div class="absolute top-2 left-2">
            <span
              :class="transactionTypeClass(property.transaction_type)"
              class="px-2 py-1 rounded-full text-xs font-medium text-white"
            >
              {{ property.transaction_type === 'venta' ? 'Venta' : 'Alquiler' }}
            </span>
          </div>
          <div v-if="property.featured" class="absolute top-2 right-2">
            <span class="bg-secondary-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Star class="w-3 h-3" />
              Destacado
            </span>
          </div>
        </div>

        <!-- Property Info -->
        <div class="p-4">
          <div class="flex items-start justify-between mb-2">
            <h3 class="font-semibold text-gray-900 truncate">{{ property.title }}</h3>
            <span class="text-lg font-bold text-primary-600">
              ${{ formatPrice(property.price) }}
            </span>
          </div>

          <p class="text-gray-600 text-sm mb-3 line-clamp-2">
            {{ property.description }}
          </p>

          <!-- Property Details -->
          <div class="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-1">
                <Bed class="w-4 h-4" />
                <span>{{ property.bedrooms || 'N/A' }}</span>
              </div>
              <div class="flex items-center gap-1">
                <Bath class="w-4 h-4" />
                <span>{{ property.bathrooms || 'N/A' }}</span>
              </div>
              <div class="flex items-center gap-1">
                <Square class="w-4 h-4" />
                <span>{{ property.area }}m²</span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between text-sm text-gray-500">
            <div class="flex items-center gap-1">
              <MapPin class="w-4 h-4" />
              <span>{{ property.location }}</span>
            </div>
            <div class="flex items-center gap-1">
              <Clock class="w-4 h-4" />
              <span>{{ formatDate(property.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Plus, Home, Star, MapPin, Clock, Bed, Bath, Square, ImageOff 
} from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'
import { supabase } from '../lib/supabase'

const router = useRouter()
const { isAuthenticated } = useAuth()

const properties = ref<any[]>([])
const loading = ref(true)

const filters = reactive({
  transaction_type: '',
  property_type: '',
  location: '',
  price_range: '',
  bedrooms: ''
})

const colombianCities = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Granada',
  'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué', 'Pasto', 'Manizales',
  'Neiva', 'Soledad', 'Armenia', 'Villavicencio', 'Montería', 'Valledupar'
]

const filteredProperties = computed(() => {
  let filtered = properties.value

  if (filters.transaction_type) {
    filtered = filtered.filter(p => p.transaction_type === filters.transaction_type)
  }

  if (filters.property_type) {
    filtered = filtered.filter(p => p.property_type === filters.property_type)
  }

  if (filters.location) {
    filtered = filtered.filter(p => p.location === filters.location)
  }

  if (filters.bedrooms) {
    const minBedrooms = parseInt(filters.bedrooms)
    filtered = filtered.filter(p => p.bedrooms >= minBedrooms)
  }

  return filtered
})

const transactionTypeClass = (type: string) => {
  return type === 'venta' ? 'bg-green-500' : 'bg-blue-500'
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO').format(price)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-CO', { 
    day: 'numeric', 
    month: 'short' 
  })
}

const viewProperty = (propertyId: string) => {
  router.push(`/property/${propertyId}`)
}

const loadProperties = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url,
          badge
        )
      `)
      .eq('status', 'active')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error

    properties.value = data || []
  } catch (error) {
    console.error('Error loading properties:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadProperties()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>