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
        v-for="property in filteredProperties" :key="property.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        @click="viewProperty(property.id)"
      >
        <!-- Property Image -->
        <div class="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          <div v-if="!property.images?.[0]" class="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
            <ImageOff class="w-12 h-12 mb-2" />
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

            </div>
          </div>

          <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div class="flex items-center gap-1">
              <MapPin class="w-4 h-4" />
              <span>{{ property.location }}</span>
            </div>
            <div class="flex items-center gap-1">
              <Clock class="w-4 h-4" />
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
</template>

<script setup lang="ts">
import { useProperties } from '../composables/useProperties'
import { Plus, MapPin, Bed, Bath, Star, Home, ImageOff, Clock } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'
import { onMounted } from 'vue'

const { isAuthenticated } = useAuth()

const {
  filteredProperties,
  loading,
  filters,
  viewProperty,
  propertyTypes,
  transactionTypes,
  setFilters,
  getProperties
} = useProperties()

// Load properties when the component is mounted
onMounted(() => {
  getProperties()
})

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
  'Riohacha'
]



const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(price)
}

const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('es-CO', options)
}

const transactionTypeClass = (type: string) => {
  return type === 'Venta' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>