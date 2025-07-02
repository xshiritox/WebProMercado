<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Editar Propiedad</h1>
        <p class="text-gray-600">Actualiza la información de tu propiedad</p>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Cargando propiedad...</p>
      </div>

      <div v-else-if="!property" class="text-center py-8">
        <p class="text-gray-600">Propiedad no encontrada</p>
        <router-link to="/profile" class="btn-primary mt-4">
          Volver al Perfil
        </router-link>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              Título de la propiedad *
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
            <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
              Precio (COP) *
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2.5 text-gray-500">$</span>
              <input
                id="price"
                v-model="form.price"
                type="number"
                required
                min="0"
                step="1000000"
                class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
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

const property = ref<any>(null)
const loading = ref(true)
const saving = ref(false)

const form = reactive({
  title: '',
  price: null as number | null,
  description: ''
})

const loadProperty = async () => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (error) throw error

    property.value = data
    
    // Precargar formulario
    form.title = data.title
    form.price = data.price
    form.description = data.description
  } catch (error) {
    console.error('Error loading property:', error)
    toast.error('Error al cargar la propiedad')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  try {
    const { error } = await supabase
      .from('properties')
      .update({
        title: form.title,
        price: form.price,
        description: form.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', route.params.id)

    if (error) throw error

    toast.success('Propiedad actualizada exitosamente')
    router.push('/profile')
  } catch (error: any) {
    console.error('Error updating property:', error)
    toast.error('Error al actualizar la propiedad')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadProperty()
})
</script>