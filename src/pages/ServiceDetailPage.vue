<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-96">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <AlertCircle class="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Error al cargar el servicio</h3>
      <p class="text-gray-600 mb-6">{{ error }}</p>
      <button @click="loadService" class="btn-primary">
        <RefreshCw class="w-4 h-4 mr-2" />
        Reintentar
      </button>
    </div>

    <!-- Service Content -->
    <div v-else-if="service" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2">
        <!-- Service Images -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div class="aspect-w-16 aspect-h-9 bg-gray-100">
            <div class="w-full h-96 flex items-center justify-center overflow-hidden">
              <div v-if="!service.images?.[0]" class="w-full h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                <Wrench class="w-16 h-16 mb-4" />
                <span class="text-lg">Sin imagen disponible</span>
              </div>
              <img
                v-else
                :src="service.images[0]"
                :alt="service.title"
                class="w-full h-full object-contain bg-white p-4"
                style="max-height: 24rem;"
              >
            </div>
          </div>
        </div>

        <!-- Service Details -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ service.title }}</h1>
          
          <div class="flex items-center mb-6">
            <span class="bg-primary-100 text-primary-800 text-sm font-medium px-2.5 py-0.5 rounded">
              {{ service.category }}
            </span>
            <span class="ml-4 text-sm text-gray-500">
              Publicado el {{ formatDate(service.created_at) }}
            </span>
          </div>

          <div class="prose max-w-none text-gray-700 mb-6">
            <p class="whitespace-pre-line">{{ service.description }}</p>
          </div>

          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Detalles del servicio</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-start">
                <Calendar class="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <span class="text-gray-600">Disponibilidad: </span>
                  <span v-if="!service.availability || service.availability.length === 0" class="text-gray-600">A convenir</span>
                  <div v-else class="flex flex-wrap gap-1 mt-1">
                    <span 
                      v-for="day in orderedAvailability" 
                      :key="day"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {{ day }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex items-center">
                <Clock class="w-5 h-5 text-gray-400 mr-2" />
                <span class="text-gray-600">Tiempo de respuesta: {{ service.response_time || 'A convenir' }}</span>
              </div>
              <div class="flex items-center">
                <MapPin class="w-5 h-5 text-gray-400 mr-2" />
                <span class="text-gray-600">Ubicación: {{ service.location || 'No especificada' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <!-- Price Card -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Precio</h3>
          <div class="flex items-baseline mb-6">
            <span class="text-3xl font-bold text-gray-900">
              {{ formatPrice(service.price_from) }}
            </span>
            <span v-if="service.price_to" class="text-gray-600 ml-2">
              - {{ formatPrice(service.price_to) }}
            </span>
            <span class="text-gray-500 ml-2">
              {{ getPriceType(service.price_type) }}
            </span>
          </div>
          
          <button 
            @click="contactService"
            class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <MessageCircle class="w-5 h-5 mr-2" />
            Contactar al proveedor
          </button>
        </div>

        <!-- Provider Info -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Acerca del proveedor</h3>
          <div class="flex items-center mb-4">
            <div class="relative">
              <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <User v-if="!service.profile?.avatar_url" class="w-8 h-8 text-gray-400" />
                <img 
                  v-else
                  :src="service.profile.avatar_url" 
                  :alt="service.profile.full_name"
                  class="w-full h-full object-cover"
                >
              </div>
              <div v-if="service.profile?.badge === 'verified'" class="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <div class="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check class="w-2.5 h-2.5 text-white" />
                </div>
              </div>
            </div>
            <div class="ml-4">
              <h4 class="font-semibold text-gray-900">{{ service.profile?.full_name || 'Anónimo' }}</h4>
              <div class="flex items-center text-sm text-gray-500">
                <Star class="w-4 h-4 text-yellow-400 mr-1" />
                <span>5.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useToast } from 'vue-toastification'
import { 
  Wrench, User, Star, MapPin, Calendar, Clock, MessageCircle, 
  Check, AlertCircle, RefreshCw 
} from 'lucide-vue-next'

const route = useRoute()
const toast = useToast()

const service = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const daysOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const orderedAvailability = computed(() => {
  if (!service.value?.availability) return []
  
  // Si es un string, convertirlo a array
  const availability = Array.isArray(service.value.availability) 
    ? [...service.value.availability] 
    : [service.value.availability]
  
  // Ordenar según el orden de daysOrder
  return availability.sort((a, b) => {
    return daysOrder.indexOf(a) - daysOrder.indexOf(b)
  })
})

const loadService = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Primero obtenemos el servicio
    const { data: serviceData, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (serviceError) throw serviceError

    // Luego obtenemos el perfil del proveedor
    if (serviceData) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', serviceData.user_id)
        .single()

      if (profileError) {
        console.warn('Error al cargar el perfil del proveedor:', profileError)
      }

      // Combinamos los datos
      service.value = {
        ...serviceData,
        profile: profileData || null
      }
    }
  } catch (err: any) {
    console.error('Error loading service:', err)
    error.value = 'No se pudo cargar el servicio. Por favor, inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

const getPriceType = (type: string) => {
  const types: Record<string, string> = {
    'fixed': 'Precio fijo',
    'hourly': 'Por hora',
    'quote': 'A convenir'
  }
  return types[type] || type
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-DO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const contactService = () => {
  if (!service.value?.profile?.phone) {
    toast.warning('Este proveedor no ha proporcionado información de contacto')
    return
  }
  
  // Formatear el número de teléfono (eliminar espacios, guiones, etc.)
  const phoneNumber = service.value.profile.phone.replace(/[^\d+]/g, '')
  
  // Crear mensaje predeterminado
  const message = encodeURIComponent(
    `Hola, estoy interesado en tu servicio "${service.value.title}" en PubliNet.`
  )
  
  // Abrir WhatsApp
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
}

onMounted(() => {
  loadService()
})
</script>

<style scoped>
/* Las clases de Tailwind se han movido directamente a los elementos */
</style>
