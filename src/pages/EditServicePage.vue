<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Editar Servicio</h1>
        <p class="text-gray-600">Actualiza la información de tu servicio</p>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Cargando servicio...</p>
      </div>

      <div v-else-if="!service" class="text-center py-8">
        <p class="text-gray-600">Servicio no encontrado</p>
        <router-link to="/profile" class="btn-primary mt-4">
          Volver al Perfil
        </router-link>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              Título del servicio *
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label for="price_from" class="block text-sm font-medium text-gray-700 mb-2">
              Precio desde (COP) *
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-gray-500">$</span>
              <input
                id="price_from"
                v-model="form.price_from"
                type="number"
                required
                min="0"
                step="1000"
                class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Descripción del servicio *
          </label>
          <textarea
            id="description"
            v-model="form.description"
            required
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          ></textarea>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-end">
          <router-link
            to="/profile"
            class="btn-outline"
          >
            Cancelar
          </router-link>
          
          <button
            type="submit"
            :disabled="saving"
            class="btn-primary"
          >
            <Loader2 v-if="saving" class="animate-spin w-4 h-4" />
            {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import { supabase } from '../lib/supabase'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const service = ref<any>(null)
const loading = ref(true)
const saving = ref(false)

const form = reactive({
  title: '',
  price_from: null as number | null,
  description: ''
})

const loadService = async () => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (error) throw error

    service.value = data
    
    // Precargar formulario
    form.title = data.title
    form.price_from = data.price_from
    form.description = data.description
  } catch (error) {
    console.error('Error loading service:', error)
    toast.error('Error al cargar el servicio')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  try {
    const { error } = await supabase
      .from('services')
      .update({
        title: form.title,
        price_from: form.price_from,
        description: form.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', route.params.id)

    if (error) throw error

    toast.success('Servicio actualizado exitosamente')
    router.push('/profile')
  } catch (error: any) {
    console.error('Error updating service:', error)
    toast.error('Error al actualizar el servicio')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadService()
})
</script>