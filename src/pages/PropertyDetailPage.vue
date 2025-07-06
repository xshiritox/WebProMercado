<template>
  <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="animate-pulse">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="h-96 bg-gray-200 rounded-lg"></div>
        <div class="space-y-4">
          <div class="h-8 bg-gray-200 rounded"></div>
          <div class="h-6 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="!property" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center py-12">
      <IconAlertCircle class="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Propiedad no encontrada</h2>
      <p class="text-gray-600 mb-6">La propiedad que buscas no existe o ha sido eliminada</p>
      <router-link to="/properties" class="btn-primary">
        Ver Propiedades
      </router-link>
    </div>
  </div>

  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Breadcrumb -->
    <nav class="flex mb-8" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li>
          <router-link to="/" class="text-gray-500 hover:text-primary-600">Inicio</router-link>
        </li>
        <li>
          <IconChevronRight class="w-4 h-4 text-gray-500" />
        </li>
        <li>
          <router-link to="/properties" class="text-gray-500 hover:text-primary-600">Propiedades</router-link>
        </li>
        <li>
          <IconChevronRight class="w-4 h-4 text-gray-500" />
        </li>
        <li>
          <span class="text-gray-900">{{ property.title }}</span>
        </li>
      </ol>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Property Images -->
      <div>
        <div class="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden mb-4">
          <div class="w-full h-96 flex items-center justify-center overflow-hidden">
            <img
              v-if="currentImage || property.images?.[0]"
              :src="currentImage || property.images[0]"
              :alt="property.title"
              class="w-full h-full object-contain bg-white p-4"
              style="max-height: 24rem;"
            />
            <div v-else class="w-full h-96 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 p-4">
              <IconImageOff class="w-12 h-12 text-gray-300" />
              <span class="text-lg text-center">Sin imagen disponible</span>
            </div>
          </div>
        </div>
        
        <!-- Thumbnail Images -->
        <div v-if="property.images && property.images.length > 1" class="grid grid-cols-4 gap-2">
          <div
            v-for="(image, index) in property.images.slice(1, 5)"
            :key="index"
            class="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 flex items-center justify-center"
            @click="currentImage = image"
          >
            <img
              :src="image"
              :alt="`${property.title} - imagen ${index + 2}`"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <!-- Property Information -->
      <div>
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ property.title }}</h1>
            <div class="flex items-center gap-2 mb-4">
              <span
                :class="transactionTypeClass"
                class="px-3 py-1 rounded-full text-sm font-medium text-white"
              >
                {{ property.transaction_type === 'venta' ? 'Venta' : 'Alquiler' }}
              </span>
              <span v-if="property.featured" class="bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <IconStar class="w-3 h-3" />
                Destacado
              </span>
              <button 
                @click="toggleFavorite"
                class="ml-2 p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                :title="isFavoriteProperty ? 'Quitar de favoritos' : 'Agregar a favoritos'"
              >
                <IconHeart 
                  :class="{ 'text-red-500 fill-current': isFavoriteProperty, 'text-gray-400': !isFavoriteProperty }" 
                  class="w-5 h-5" 
                />
              </button>
            </div>
          </div>
          
          <div class="text-right">
            <div class="text-3xl font-bold text-primary-600 mb-2">
              ${{ formatPrice(property.price) }}
            </div>
            <div class="flex items-center gap-1 text-sm text-gray-600">
              <IconMapPin class="w-4 h-4" />
              <span>{{ property.location }}</span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
          <p class="text-gray-700 whitespace-pre-line">{{ property.description }}</p>
        </div>

        <!-- Property Details -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Detalles de la Propiedad</h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600">Tipo:</span>
              <span class="font-medium text-gray-900 ml-2">{{ propertyTypeText }}</span>
            </div>
            <div>
              <span class="text-gray-600">Transacción:</span>
              <span class="font-medium text-gray-900 ml-2">{{ property.transaction_type === 'venta' ? 'Venta' : 'Alquiler' }}</span>
            </div>
            <div v-if="property.bedrooms">
              <span class="text-gray-600">Habitaciones:</span>
              <span class="font-medium text-gray-900 ml-2">{{ property.bedrooms }}</span>
            </div>
            <div v-if="property.bathrooms">
              <span class="text-gray-600">Baños:</span>
              <span class="font-medium text-gray-900 ml-2">{{ property.bathrooms }}</span>
            </div>
            <div v-if="property.parking_spaces">
              <span class="text-gray-600">Parqueaderos:</span>
              <span class="font-medium text-gray-900 ml-2">{{ property.parking_spaces }}</span>
            </div>
            <div v-if="property.stratum">
              <span class="text-gray-600">Estrato:</span>
              <span class="font-medium text-gray-900 ml-2">{{ property.stratum }}</span>
            </div>
            <div>
              <span class="text-gray-600">Publicado:</span>
              <span class="font-medium text-gray-900 ml-2">{{ formatDate(property.created_at) }}</span>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Información del Propietario</h3>
          
          <div class="flex items-center gap-4 mb-4">
            <IconUser class="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center" />
            <div>
              <div class="flex items-center gap-2">
                <h4 class="font-semibold text-gray-900">{{ property.profiles?.full_name }}</h4>
                <span
                  v-if="property.profiles?.badge"
                  :class="badgeClass"
                  class="px-2 py-1 rounded-full text-xs font-medium text-white"
                >
                  {{ badgeText }}
                </span>
              </div>
              <div class="flex items-center gap-1 text-sm text-gray-600">
                <IconStar class="w-4 h-4 text-yellow-400 mr-1" />
                <span>5.0</span>
              </div>
            </div>
          </div>

          <!-- Contact Buttons -->
          <div class="space-y-3">
            <button
              v-if="property.profiles?.phone"
              @click="callOwner"
              class="w-full btn-primary justify-center"
            >
              <IconPhone class="w-4 h-4" />
              Llamar al Propietario
            </button>
            
            <button
              v-if="property.profiles?.phone"
              @click="openWhatsApp"
              class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 justify-center"
            >
              <IconMessageCircle class="w-4 h-4 text-gray-400 mr-1" />
              Contactar por WhatsApp
            </button>
            
            <button
              @click="showMessageModal = true"
              class="w-full btn-outline justify-center"
            >
              <IconMessageCircle class="w-4 h-4 text-gray-400 mr-1" />
              Enviar Mensaje
            </button>
            
            <button
              @click="showReportModal = true"
              class="w-full text-red-600 hover:bg-red-50 border border-red-200 font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 justify-center mt-2"
            >
              <IconFlag class="w-4 h-4" />
              Reportar esta propiedad
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Properties -->
    <div class="mt-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Propiedades Relacionadas</h2>
      
      <div v-if="relatedProperties.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Related properties would go here -->
      </div>
      
      <div v-else class="text-center py-8">
        <p class="text-gray-600">No hay propiedades relacionadas disponibles</p>
      </div>
    </div>
    
    <!-- Report Modal -->
    <ReportModal
      v-if="property"
      :is-open="showReportModal"
      type="property"
      :target-id="property.id"
      :user-id="property.user_id"
      @close="showReportModal = false"
      @reported="handleReported"
    />
    
    <!-- Message Modal -->
    <MessageModal
      v-if="property && property.profiles"
      :is-open="showMessageModal"
      :recipient-id="property.user_id"
      :recipient-name="property.profiles.full_name"
      item-type="property"
      :item-id="property.id"
      :item-title="property.title"
      @close="showMessageModal = false"
      @sent="() => showMessageModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFavorites } from '@/composables/useFavorites'
import MessageModal from '@/components/MessageModal.vue'
import { 
  Star as IconStar, 
  MapPin as IconMapPin, 
  User as IconUser, 
  Phone as IconPhone, 
  MessageCircle as IconMessageCircle, 
  ChevronRight as IconChevronRight, 
  AlertCircle as IconAlertCircle, 
  ImageOff as IconImageOff, 
  Flag as IconFlag, 
  Heart as IconHeart
} from 'lucide-vue-next'
import ReportModal from '@/components/ReportModal.vue'
import { supabase } from '../lib/supabase'

const route = useRoute()

const property = ref<any>(null)
const relatedProperties = ref<any[]>([])
const loading = ref(true)
const currentImage = ref('')
const { 
  addToFavorites, 
  removeFromFavorites, 
  isFavorite: checkIfFavorite, 
  loadFavorites, 
  favorites
} = useFavorites()
const isFavoriteProperty = ref(false)

// Update favorite status when property or favorites change
const updateFavoriteStatus = () => {
  if (property.value) {
    isFavoriteProperty.value = checkIfFavorite('property', property.value.id)
  }
}

// Call updateFavoriteStatus initially and when property changes
onMounted(() => {
  updateFavoriteStatus()
  loadFavorites()
})

watch(() => property.value, updateFavoriteStatus)

// Watch for changes in favorites and update the local state
watch(() => favorites.value, updateFavoriteStatus)

const showReportModal = ref(false)
const showMessageModal = ref(false)

const transactionTypeClass = computed(() => {
  return property.value?.transaction_type === 'venta' ? 'bg-green-500' : 'bg-blue-500'
})

const propertyTypeText = computed(() => {
  switch (property.value?.property_type) {
    case 'casa':
      return 'Casa'
    case 'apartamento':
      return 'Apartamento'
    case 'local':
      return 'Local Comercial'
    case 'oficina':
      return 'Oficina'
    case 'lote':
      return 'Lote'
    default:
      return 'N/A'
  }
})

const badgeClass = computed(() => {
  switch (property.value?.profiles?.badge) {
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
})

const badgeText = computed(() => {
  switch (property.value?.profiles?.badge) {
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
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO').format(price)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-CO')
}

const callOwner = () => {
  if (property.value?.profiles?.phone) {
    window.open(`tel:${property.value.profiles.phone}`)
  }
}

const openWhatsApp = () => {
  if (property.value?.profiles?.phone) {
    const message = `Hola, estoy interesado en tu propiedad "${property.value.title}" publicada en Kroma.`
    const phone = property.value.profiles.phone.replace(/\D/g, '')
    window.open(`https://wa.me/57${phone}?text=${encodeURIComponent(message)}`)
  }
}

const toggleFavorite = async () => {
  if (!property.value) return
  
  try {
    if (isFavoriteProperty.value) {
      // Find the favorite to remove it
      const favorite = favorites.value.find(fav => fav.property_id === property.value.id)
      if (favorite) {
        await removeFromFavorites(favorite.id)
      }
    } else {
      await addToFavorites('property', property.value.id)
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
  }
}

const handleReported = () => {
  // Handle report
  console.log('Property reported')
}

const getProperty = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url,
          badge,
          phone,
          email
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    return data
  } catch (error: any) {
    console.error('Error loading property:', error)
    return null
  }
}

onMounted(async () => {
  const propertyId = route.params.id as string
  currentImage.value = ''
  
  try {
    await loadFavorites()
  } catch (error) {
    console.error('Error loading favorites:', error)
  }
  
  try {
    property.value = await getProperty(propertyId)
    
    // TODO: Load related properties
    relatedProperties.value = []
  } catch (error) {
    console.error('Error loading property:', error)
  } finally {
    loading.value = false
  }
})
</script>