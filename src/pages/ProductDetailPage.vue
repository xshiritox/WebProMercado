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

  <div v-else-if="!product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center py-12">
      <AlertCircle class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Producto no encontrado</h2>
      <p class="text-gray-600 mb-6">El producto que buscas no existe o ha sido eliminado</p>
      <router-link to="/products" class="btn-primary">
        Ver Productos
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
          <ChevronRight class="w-4 h-4 text-gray-500" />
        </li>
        <li>
          <router-link to="/products" class="text-gray-500 hover:text-primary-600">Productos</router-link>
        </li>
        <li>
          <ChevronRight class="w-4 h-4 text-gray-500" />
        </li>
        <li>
          <span class="text-gray-900">{{ product.title }}</span>
        </li>
      </ol>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Product Images -->
      <div>
        <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img
            :src="product.images?.[0] || 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg'"
            :alt="product.title"
            class="w-full h-full object-cover"
          />
        </div>
        
        <!-- Thumbnail Images -->
        <div v-if="product.images && product.images.length > 1" class="grid grid-cols-4 gap-2">
          <div
            v-for="(image, index) in product.images.slice(1, 5)"
            :key="index"
            class="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80"
          >
            <img
              :src="image"
              :alt="`${product.title} - imagen ${index + 2}`"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <!-- Product Information -->
      <div>
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.title }}</h1>
            <div class="flex items-center gap-2 mb-4">
              <span
                :class="conditionClass"
                class="px-3 py-1 rounded-full text-sm font-medium text-white"
              >
                {{ conditionText }}
              </span>
              <span v-if="product.featured" class="bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Star class="w-3 h-3" />
                Destacado
              </span>
            </div>
          </div>
          
          <div class="text-right">
            <div class="text-3xl font-bold text-primary-600 mb-2">
              ${{ formatPrice(product.price) }}
            </div>
            <div class="flex items-center gap-1 text-sm text-gray-600">
              <MapPin class="w-4 h-4" />
              <span>{{ product.location }}</span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
          <p class="text-gray-700 whitespace-pre-line">{{ product.description }}</p>
        </div>

        <!-- Product Details -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Detalles del Producto</h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600">Categoría:</span>
              <span class="font-medium text-gray-900 ml-2">{{ product.category }}</span>
            </div>
            <div>
              <span class="text-gray-600">Estado:</span>
              <span class="font-medium text-gray-900 ml-2">{{ conditionText }}</span>
            </div>
            <div>
              <span class="text-gray-600">Ubicación:</span>
              <span class="font-medium text-gray-900 ml-2">{{ product.location }}</span>
            </div>
            <div>
              <span class="text-gray-600">Publicado:</span>
              <span class="font-medium text-gray-900 ml-2">{{ formatDate(product.created_at) }}</span>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Información del Vendedor</h3>
          
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
              <User class="w-6 h-6 text-white" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h4 class="font-semibold text-gray-900">{{ product.profiles?.full_name }}</h4>
                <span
                  v-if="product.profiles?.badge"
                  :class="badgeClass"
                  class="px-2 py-1 rounded-full text-xs font-medium text-white"
                >
                  {{ badgeText }}
                </span>
              </div>
              <div class="flex items-center gap-1 text-sm text-gray-600">
                <Star class="w-4 h-4 text-yellow-500" />
                <span>4.8 (23 reseñas)</span>
              </div>
            </div>
          </div>

          <!-- Contact Buttons -->
          <div class="space-y-3">
            <button
              v-if="product.profiles?.phone"
              @click="callSeller"
              class="w-full btn-primary justify-center"
            >
              <Phone class="w-4 h-4" />
              Llamar al Vendedor
            </button>
            
            <button
              v-if="product.profiles?.phone"
              @click="openWhatsApp"
              class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 justify-center"
            >
              <MessageCircle class="w-4 h-4" />
              Contactar por WhatsApp
            </button>
            
            <button
              @click="sendEmail"
              class="w-full btn-outline justify-center"
            >
              <Mail class="w-4 h-4" />
              Enviar Email
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Products -->
    <div class="mt-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Productos Relacionados</h2>
      
      <div v-if="relatedProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="relatedProduct in relatedProducts"
          :key="relatedProduct.id"
          :product="relatedProduct"
        />
      </div>
      
      <div v-else class="text-center py-8">
        <p class="text-gray-600">No hay productos relacionados disponibles</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Star, MapPin, User, Phone, MessageCircle, Mail, ChevronRight, AlertCircle 
} from 'lucide-vue-next'
import ProductCard from '../components/ProductCard.vue'
import { useProducts } from '../composables/useProducts'

const route = useRoute()
const { getProduct } = useProducts()

const product = ref<any>(null)
const relatedProducts = ref<any[]>([])
const loading = ref(true)

const conditionClass = computed(() => {
  switch (product.value?.condition) {
    case 'nuevo':
      return 'bg-green-500'
    case 'usado':
      return 'bg-yellow-500'
    case 'reacondicionado':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
})

const conditionText = computed(() => {
  switch (product.value?.condition) {
    case 'nuevo':
      return 'Nuevo'
    case 'usado':
      return 'Usado'
    case 'reacondicionado':
      return 'Reacondicionado'
    default:
      return 'N/A'
  }
})

const badgeClass = computed(() => {
  switch (product.value?.profiles?.badge) {
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
  switch (product.value?.profiles?.badge) {
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

const callSeller = () => {
  if (product.value?.profiles?.phone) {
    window.open(`tel:${product.value.profiles.phone}`)
  }
}

const openWhatsApp = () => {
  if (product.value?.profiles?.phone) {
    const message = `Hola, estoy interesado en tu producto "${product.value.title}" publicado en WebProMercado.`
    const phone = product.value.profiles.phone.replace(/\D/g, '')
    window.open(`https://wa.me/57${phone}?text=${encodeURIComponent(message)}`)
  }
}

const sendEmail = () => {
  if (product.value?.profiles?.email) {
    const subject = `Interés en: ${product.value.title}`
    const body = `Hola,\n\nEstoy interesado en tu producto "${product.value.title}" publicado en WebProMercado.\n\nPor favor, contáctame para más información.\n\nGracias.`
    window.open(`mailto:${product.value.profiles.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
  }
}

onMounted(async () => {
  const productId = route.params.id as string
  
  try {
    product.value = await getProduct(productId)
    
    // TODO: Load related products
    relatedProducts.value = []
  } catch (error) {
    console.error('Error loading product:', error)
  } finally {
    loading.value = false
  }
})
</script>