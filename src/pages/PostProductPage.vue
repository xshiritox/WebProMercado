<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Publicar Producto</h1>
        <p class="text-gray-600">Completa la información de tu producto para comenzar a vender</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              Título del producto *
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ejemplo: iPhone 14 Pro Max 256GB"
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
                step="1000"
                class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              id="category"
              v-model="form.category"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Selecciona una categoría</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>

          <div>
            <label for="condition" class="block text-sm font-medium text-gray-700 mb-2">
              Estado *
            </label>
            <select
              id="condition"
              v-model="form.condition"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Selecciona el estado</option>
              <option value="nuevo">Nuevo</option>
              <option value="usado">Usado</option>
              <option value="reacondicionado">Reacondicionado</option>
            </select>
          </div>
        </div>

        <div>
          <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
            Ubicación *
          </label>
          <select
            id="location"
            v-model="form.location"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Selecciona tu ciudad</option>
            <option v-for="city in colombianCities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
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
            placeholder="Describe tu producto en detalle. Incluye características, estado, motivo de venta, etc."
          ></textarea>
        </div>

        <!-- Images -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Imágenes del producto
          </label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <ImageIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600 mb-4">
              Arrastra y suelta imágenes aquí o 
              <button type="button" class="text-primary-600 hover:text-primary-700">
                selecciona archivos
              </button>
            </p>
            <p class="text-sm text-gray-500">
              Máximo 5 imágenes. Formatos: JPG, PNG, WebP (máx. 5MB cada una)
            </p>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label for="contact_name" class="block text-sm font-medium text-gray-700 mb-2">
                Nombre de contacto
              </label>
              <input
                id="contact_name"
                v-model="form.contact_name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                :placeholder="profile?.full_name || 'Tu nombre'"
              />
            </div>

            <div>
              <label for="contact_phone" class="block text-sm font-medium text-gray-700 mb-2">
                Teléfono de contacto
              </label>
              <input
                id="contact_phone"
                v-model="form.contact_phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="+57 300 123 4567"
              />
            </div>
          </div>
        </div>

        <!-- Premium Options -->
        <div class="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Opciones Premium</h3>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-medium text-gray-900">Producto Destacado</h4>
                <p class="text-sm text-gray-600">Tu producto aparecerá en la parte superior</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-lg font-semibold text-secondary-600">$15,000</span>
                <input
                  id="featured"
                  v-model="form.featured"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="button"
            @click="router.back()"
            class="btn-outline"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="btn-primary"
          >
            <Loader2 v-if="loading" class="animate-spin w-4 h-4" />
            <Package v-else class="w-4 h-4" />
            {{ loading ? 'Publicando...' : 'Publicar Producto' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Package, ImageIcon, Loader2 } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'
import { useProducts } from '../composables/useProducts'

const router = useRouter()
const { profile } = useAuth()
const { createProduct, categories, loading } = useProducts()

const form = reactive({
  title: '',
  price: null as number | null,
  category: '',
  condition: '',
  location: '',
  description: '',
  contact_name: '',
  contact_phone: '',
  featured: false
})

const colombianCities = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta',
  'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué', 'Pasto', 'Manizales',
  'Neiva', 'Soledad', 'Armenia', 'Villavicencio', 'Montería', 'Valledupar'
]

const isFormValid = computed(() => {
  return (
    form.title.trim() &&
    form.price &&
    form.category &&
    form.condition &&
    form.location &&
    form.description.trim()
  )
})

const handleSubmit = async () => {
  if (!isFormValid.value || !profile.value) return

  const productData = {
    title: form.title,
    description: form.description,
    price: form.price!,
    category: form.category,
    condition: form.condition as 'nuevo' | 'usado' | 'reacondicionado',
    location: form.location,
    user_id: profile.value.id,
    featured: form.featured,
    images: [] // TODO: Implement image upload
  }

  const result = await createProduct(productData)
  
  if (result) {
    router.push('/products')
  }
}

onMounted(() => {
  if (profile.value) {
    form.contact_name = profile.value.full_name || ''
    form.contact_phone = profile.value.phone || ''
    form.location = profile.value.location || ''
  }
})
</script>