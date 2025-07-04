<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="messages.length === 0" class="text-center py-8">
      <Inbox class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-600">No tienes mensajes</p>
    </div>

    <div v-else class="space-y-3">
      <div 
        v-for="message in messages" 
        :key="message.id"
        @click="openMessage(message)"
        :class="[ 
          'border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md',
          !message.read ? 'border-primary-300 bg-primary-50' : 'border-gray-200'
        ]"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-medium text-gray-900 truncate">
                {{ message.sender?.full_name || 'Usuario' }}
              </h3>
              <span class="text-xs text-gray-500">
                {{ formatDate(message.created_at) }}
              </span>
            </div>
            <p class="text-sm font-medium text-gray-900 mt-1">
              {{ message.subject }}
            </p>
            <p class="text-sm text-gray-500 mt-1 line-clamp-2">
              {{ message.content }}
            </p>
            
            <div v-if="message.product || message.property || message.service" class="mt-2">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ getItemType(message) }}
              </span>
              <span class="ml-2 text-sm text-gray-600">
                {{ getItemTitle(message) }}
              </span>
            </div>
          </div>
          
          <div v-if="!message.read" class="ml-2">
            <span class="inline-flex items-center justify-center w-2 h-2 rounded-full bg-primary-600"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMessages } from '../composables/useMessages'
import { useToast } from 'vue-toastification'
import { Inbox } from 'lucide-vue-next'

// Props are defined but not used in this version
// Keeping the props for future use

const toast = useToast()
const { messages, loading, loadMessages, markAsRead } = useMessages()

const getItemType = (message: any) => {
  if (message.product_id) return 'Producto'
  if (message.property_id) return 'Propiedad'
  if (message.service_id) return 'Servicio'
  return ''
}

const getItemTitle = (message: any) => {
  if (message.products) return message.products.title
  if (message.properties) return message.properties.title
  if (message.services) return message.services.title
  return ''
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const openMessage = async (message: any) => {
  try {
    if (!message.read && message.recipient_id) {
      await markAsRead(message.id)
    }
    
    // Aquí podrías navegar a una vista detallada del mensaje
    // o mostrar un modal con el contenido completo
    console.log('Abrir mensaje:', message)
    
  } catch (error: any) {
    toast.error(error.message || 'Error al abrir el mensaje')
  }
}

// Cargar mensajes al montar el componente
onMounted(() => {
  loadMessages()
})
</script>
