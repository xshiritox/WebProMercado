<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Servicios Profesionales</h1>
      <p class="text-gray-600">Encuentra profesionales y servicios especializados en tu área</p>
    </div>

    <!-- Service Categories -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="category in serviceCategories"
        :key="category.name"
        class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
        @click="filterByCategory(category.name)"
      >
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <component :is="category.icon" class="w-6 h-6 text-primary-600" />
        </div>
        <h3 class="font-semibold text-gray-900 mb-2">{{ category.name }}</h3>
        <p class="text-sm text-gray-600">{{ category.count }}+ profesionales</p>
      </div>
    </div>

    <!-- Services Grid -->
    <div class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Servicios Disponibles</h2>
      
      <div v-if="loadingServices" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div class="h-48 bg-gray-200"></div>
          <div class="p-4">
            <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>

      <div v-else-if="services.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wrench class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No hay servicios disponibles</h3>
        <p class="text-gray-500 mb-6">Parece que aún no hay servicios publicados en esta categoría.</p>
        <router-link 
          v-if="isAuthenticated"
          to="/post-service" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus class="w-4 h-4 mr-2" />
          Publicar un servicio
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="service in services" 
          :key="service.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          <div class="h-48 bg-gray-100 relative">
            <img 
              v-if="service.images && service.images.length > 0"
              :src="service.images[0]" 
              :alt="service.title"
              class="w-full h-full object-cover"
            >
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
              <Wrench class="w-12 h-12 text-gray-400" />
            </div>
            <div class="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
              <Heart class="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer" />
            </div>
          </div>
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold text-gray-900 line-clamp-1">{{ service.title }}</h3>
              <span class="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {{ service.category }}
              </span>
            </div>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ service.description }}</p>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-lg font-bold text-gray-900">
                  {{ formatPrice(service.price_from) }}
                  <span v-if="service.price_to" class="text-sm font-normal text-gray-500">
                    - {{ formatPrice(service.price_to) }}
                  </span>
                </p>
                <p class="text-xs text-gray-500">{{ getPriceType(service.price_type) }}</p>
              </div>
              <div class="flex items-center">
                <Star class="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span class="text-sm font-medium text-gray-900">{{ service.rating || 'Nuevo' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- How It Works -->
    <div class="bg-white rounded-lg shadow-md p-8 mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">¿Cómo Funciona?</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search class="w-8 h-8 text-primary-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">1. Busca</h3>
          <p class="text-gray-600">
            Explora nuestra amplia gama de profesionales y servicios especializados
          </p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle class="w-8 h-8 text-secondary-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">2. Contacta</h3>
          <p class="text-gray-600">
            Comunícate directamente con los profesionales para discutir tu proyecto
          </p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle class="w-8 h-8 text-accent-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">3. Contrata</h3>
          <p class="text-gray-600">
            Elige al profesional ideal y disfruta de un servicio de calidad
          </p>
        </div>
      </div>
    </div>

    <!-- Professional Registration CTA -->
    <div class="bg-gradient-to-r from-primary-600 to-secondary-500 rounded-lg p-8 text-white text-center">
      <h2 class="text-2xl font-bold mb-4">¿Eres un Profesional?</h2>
      <p class="text-lg mb-6 text-primary-100">
        Únete a nuestra plataforma y conecta con miles de clientes potenciales
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link
          v-if="!isAuthenticated"
          to="/register"
          class="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-all duration-200 flex items-center gap-2 justify-center"
        >
          <UserPlus class="w-5 h-5" />
          Registrarse como Profesional
        </router-link>
        <router-link
          v-else
          to="/post-service"
          class="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-all duration-200 flex items-center gap-2 justify-center"
        >
          <Plus class="w-5 h-5" />
          Publicar Servicio
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Search, MessageCircle, CheckCircle, UserPlus, Plus,
  Wrench, Palette, Camera, Car, Home, Briefcase, Heart, GraduationCap, Star
} from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'
import { supabase } from '../lib/supabase'

const route = useRoute()
const { isAuthenticated } = useAuth()
const loadingServices = ref(false)
const services = ref<any[]>([])
const selectedCategory = ref('')

const serviceCategories = ref([
  { name: 'Reparaciones', icon: Wrench, count: 0 },
  { name: 'Diseño', icon: Palette, count: 0 },
  { name: 'Fotografía', icon: Camera, count: 0 },
  { name: 'Automotriz', icon: Car, count: 0 },
  { name: 'Hogar', icon: Home, count: 0 },
  { name: 'Negocios', icon: Briefcase, count: 0 },
  { name: 'Salud', icon: Heart, count: 0 },
  { name: 'Educación', icon: GraduationCap, count: 0 }
])

const loadServiceCounts = async () => {
  try {
    // Primero obtenemos todos los servicios agrupados por categoría
    const { data, error } = await supabase
      .from('services')
      .select('category')
      .eq('status', 'active')
      .not('category', 'is', null)

    if (error) throw error

    // Contamos cuántos servicios hay por categoría
    const counts: Record<string, number> = {}
    data?.forEach((item: any) => {
      counts[item.category] = (counts[item.category] || 0) + 1
    })

    // Actualizamos los contadores en las categorías
    serviceCategories.value = serviceCategories.value.map(cat => ({
      ...cat,
      count: counts[cat.name] || 0
    }))
  } catch (error) {
    console.error('Error al cargar el conteo de servicios por categoría:', error)
  }
}

const loadServices = async () => {
  loadingServices.value = true
  try {
    let query = supabase
      .from('services')
      .select('*')
      .eq('status', 'active')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(12)

    if (selectedCategory.value) {
      query = query.eq('category', selectedCategory.value)
    }

    const { data, error } = await query

    if (error) throw error
    
    services.value = data || []
  } catch (error) {
    console.error('Error loading services:', error)
  } finally {
    loadingServices.value = false
  }
}

const filterByCategory = (category: string) => {
  selectedCategory.value = selectedCategory.value === category ? '' : category
  loadServices()
}

const getPriceType = (type: string) => {
  const types: Record<string, string> = {
    fixed: 'Precio fijo',
    hourly: 'Por hora',
    project: 'Por proyecto',
    negotiable: 'Precio negociable'
  }
  return types[type] || type
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

// Cargar los servicios y contadores al montar el componente
onMounted(() => {
  loadServiceCounts()
  loadServices()
  
  // Verificar si hay una categoría en la URL
  if (route.query.category) {
    selectedCategory.value = route.query.category as string
    loadServices()
  }
})

// Observar cambios en la ruta para actualizar los filtros
// watch(() => route.query, (newQuery) => {
//   if (newQuery.category) {
//     selectedCategory.value = newQuery.category as string
//   } else {
//     selectedCategory.value = ''
//   }
//   loadServices()
// })
</script>