<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden card-hover">
    <!-- Product Image -->
    <div class="relative">
      <img
        :src="product.images?.[0] || 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg'"
        :alt="product.title"
        class="w-full h-48 object-cover"
      />
      <div v-if="product.featured" class="absolute top-2 left-2">
        <span
          class="bg-secondary-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
        >
          <Star class="w-3 h-3" />
          Destacado
        </span>
      </div>
      <div class="absolute top-2 right-2">
        <span
          :class="conditionClass"
          class="px-2 py-1 rounded-full text-xs font-medium text-white"
        >
          {{ conditionText }}
        </span>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <div class="flex items-start justify-between mb-2">
        <h3 class="font-semibold text-gray-900 truncate">{{ product.title }}</h3>
        <span class="text-lg font-bold text-primary-600">
          ${{ formatPrice(product.price) }}
        </span>
      </div>

      <p class="text-gray-600 text-sm mb-3 line-clamp-2">
        {{ product.description }}
      </p>

      <div class="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div class="flex items-center gap-1">
          <MapPin class="w-4 h-4" />
          <span>{{ product.location }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Clock class="w-4 h-4" />
          <span>{{ formatDate(product.created_at) }}</span>
        </div>
      </div>

      <!-- Seller Info -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
            <User class="w-3 h-3 text-white" />
          </div>
          <span class="text-sm text-gray-600">{{ product.profiles?.full_name }}</span>
        </div>
        
        <div v-if="product.profiles?.badge" class="flex items-center">
          <span
            :class="badgeClass"
            class="px-2 py-1 rounded-full text-xs font-medium text-white"
          >
            {{ badgeText }}
          </span>
        </div>
      </div>

      <!-- Action Button -->
      <div class="mt-4">
        <router-link
          :to="{ name: 'product-detail', params: { id: product.id } }"
          class="w-full btn-primary justify-center"
        >
          Ver Detalles
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Star, MapPin, Clock, User } from 'lucide-vue-next'

interface Props {
  product: any
}

const props = defineProps<Props>()

const conditionClass = computed(() => {
  switch (props.product.condition) {
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
  switch (props.product.condition) {
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
  switch (props.product.profiles?.badge) {
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
  switch (props.product.profiles?.badge) {
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
  return new Date(date).toLocaleDateString('es-CO', { 
    day: 'numeric', 
    month: 'short' 
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>