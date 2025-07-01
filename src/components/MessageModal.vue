<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Enviar Mensaje</h3>
        <button @click="close" class="text-gray-400 hover:text-gray-600">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Para: {{ recipientName }}
          </label>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Asunto
          </label>
          <input
            v-model="form.subject"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            :placeholder="defaultSubject"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Mensaje *
          </label>
          <textarea
            v-model="form.content"
            required
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Escribe tu mensaje aquí..."
          ></textarea>
        </div>

        <div class="flex gap-3 justify-end">
          <button
            type="button"
            @click="close"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading || !form.content.trim()"
            class="btn-primary"
          >
            <Loader2 v-if="loading" class="animate-spin w-4 h-4" />
            <Send v-else class="w-4 h-4" />
            {{ loading ? 'Enviando...' : 'Enviar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { X, Loader2, Send } from 'lucide-vue-next'
import { useMessages } from '../composables/useMessages'

interface Props {
  isOpen: boolean
  recipientId: string
  recipientName: string
  itemType?: 'product' | 'property' | 'service'
  itemId?: string
  itemTitle?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'sent'])

const { sendMessage, loading } = useMessages()

const form = reactive({
  subject: '',
  content: ''
})

const defaultSubject = computed(() => {
  if (props.itemTitle) {
    return `Consulta sobre: ${props.itemTitle}`
  }
  return 'Consulta desde ColombiaMarket'
})

const close = () => {
  form.subject = ''
  form.content = ''
  emit('close')
}

const handleSubmit = async () => {
  const messageData: any = {
    recipient_id: props.recipientId,
    subject: form.subject || defaultSubject.value,
    content: form.content
  }

  if (props.itemType && props.itemId) {
    if (props.itemType === 'product') {
      messageData.product_id = props.itemId
    } else if (props.itemType === 'property') {
      messageData.property_id = props.itemId
    } else if (props.itemType === 'service') {
      messageData.service_id = props.itemId
    }
  }

  const success = await sendMessage(messageData)
  
  if (success) {
    emit('sent')
    close()
  }
}

watch(() => props.isOpen, (newValue) => {
  if (newValue && props.itemTitle) {
    form.subject = defaultSubject.value
  } else if (!newValue) {
    form.subject = ''
    form.content = ''
  }
})
</script>