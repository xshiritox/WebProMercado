<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Publicar Servicio</h1>
        <p class="text-gray-600">Ofrece tus servicios profesionales y conecta con clientes potenciales</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Information -->
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
              placeholder="Ejemplo: Reparación de electrodomésticos a domicilio"
            />
          </div>

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
              <option v-for="category in serviceCategories" :key="category" :value="category">
                {{ category }}
              </option>
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
            Descripción del servicio *
          </label>
          <textarea
            id="description"
            v-model="form.description"
            required
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Describe tu servicio en detalle. Incluye experiencia, metodología, qué incluye el servicio, etc."
          ></textarea>
        </div>

        <!-- Pricing -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Precios</h3>
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label for="price_type" class="block text-sm font-medium text-gray-700 mb-2">
                Tipo de precio *
              </label>
              <select
                id="price_type"
                v-model="form.price_type"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Selecciona el tipo</option>
                <option value="fixed">Precio fijo</option>
                <option value="hourly">Por hora</option>
                <option value="project">Por proyecto</option>
                <option value="negotiable">Negociable</option>
              </select>
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
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label for="price_to" class="block text-sm font-medium text-gray-700 mb-2">
                Precio hasta (COP)
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2.5 text-gray-500">$</span>
                <input
                  id="price_to"
                  v-model="form.price_to"
                  type="number"
                  min="0"
                  step="1000"
                  class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Availability -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Disponibilidad
          </label>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <div v-for="day in daysOfWeek" :key="day" class="flex items-center">
              <input
                :id="day"
                v-model="form.availability"
                :value="day"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label :for="day" class="ml-2 text-sm text-gray-700">{{ day }}</label>
            </div>
          </div>
        </div>

        <div>
          <label for="response_time" class="block text-sm font-medium text-gray-700 mb-2">
            Tiempo de respuesta
          </label>
          <select
            id="response_time"
            v-model="form.response_time"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="1h">Menos de 1 hora</option>
            <option value="24h">Dentro de 24 horas</option>
            <option value="48h">Dentro de 48 horas</option>
            <option value="72h">Dentro de 3 días</option>
            <option value="week">Dentro de una semana</option>
          </select>
        </div>

        <!-- Images -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Imágenes del servicio
          </label>
          <div 
            class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-300 transition-colors"
            @dragover.prevent="dragOver = true"
            @dragleave="dragOver = false"
            @drop.prevent="handleDrop"
            :class="{ 'border-primary-500 bg-primary-50': dragOver }"
          >
            <input 
              type="file" 
              ref="fileInput"
              class="hidden" 
              multiple 
              accept="image/*"
              @change="handleFileSelect"
            >
            <ImageIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600 mb-4">
              Arrastra y suelta imágenes aquí o 
              <button 
                type="button" 
                class="text-primary-600 hover:text-primary-700"
                @click="fileInput?.click()"
              >
                selecciona archivos
              </button>
            </p>
            <p class="text-sm text-gray-500 mb-4">
              Máximo 8 imágenes. Formatos: JPG, PNG, WebP (máx. 5MB cada una)
            </p>
            
            <!-- Vista previa de imágenes -->
            <div v-if="previewImages.length > 0" class="mt-4">
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div v-for="(image, index) in previewImages" :key="index" class="relative group">
                  <img :src="image.preview" class="w-full h-32 object-cover rounded-lg" />
                  <button 
                    @click="removeImage(index)"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X class="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p v-if="uploading" class="mt-2 text-sm text-gray-500">
                Comprimiendo y subiendo imágenes...
              </p>
            </div>
          </div>
        </div>

        <!-- Premium Options -->
        <div class="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Opciones Premium</h3>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-medium text-gray-900">Servicio Destacado</h4>
                <p class="text-sm text-gray-600">Tu servicio aparecerá en la parte superior</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-lg font-semibold text-secondary-600">$20,000</span>
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
            <Wrench v-else class="w-4 h-4" />
            {{ loading ? 'Publicando...' : 'Publicar Servicio' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Wrench, ImageIcon, Loader2, X } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'
import { useToast } from 'vue-toastification'
import imageCompression from 'browser-image-compression'
import { supabase } from '../lib/supabase'

const fileInput = ref<HTMLInputElement | null>(null)
const dragOver = ref(false)

const router = useRouter()
const toast = useToast()
const { profile } = useAuth()
const loading = ref(false)
const previewImages = ref<Array<{ file: File, preview: string }>>([])
const uploading = ref(false)

const form = reactive({
  title: '',
  category: '',
  location: '',
  description: '',
  price_type: 'fixed',
  price_from: null as number | null,
  price_to: null as number | null,
  availability: [] as string[],
  response_time: '24h',
  featured: false,
  images: [] as File[]
})

const serviceCategories = [
  'Reparaciones y Mantenimiento',
  'Limpieza y Aseo',
  'Construcción y Reformas',
  'Jardinería y Paisajismo',
  'Electricidad y Plomería',
  'Pintura y Decoración',
  'Tecnología e Informática',
  'Diseño Gráfico',
  'Fotografía y Video',
  'Educación y Tutorías',
  'Salud y Bienestar',
  'Belleza y Estética',
  'Transporte y Mudanzas',
  'Eventos y Catering',
  'Consultoría y Negocios',
  'Traducción e Idiomas',
  'Música y Arte',
  'Deportes y Fitness',
  'Mascotas y Veterinaria',
  'Otros Servicios'
]

const colombianCities = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta',
  'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué', 'Pasto', 'Manizales',
  'Neiva', 'Soledad', 'Armenia', 'Villavicencio', 'Montería', 'Valledupar', 'Granada'
]

const daysOfWeek = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
]

const isFormValid = computed(() => {
  return (
    form.title.trim() &&
    form.category &&
    form.location &&
    form.description.trim() &&
    form.price_type &&
    form.price_from
  )
})

const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    maxIteration: 10
  }

  try {
    return await imageCompression(file, options)
  } catch (error) {
    console.error('Error comprimiendo la imagen:', error)
    throw error
  }
}

const handleDrop = async (e: DragEvent) => {
  dragOver.value = false
  const files = e.dataTransfer?.files
  if (files) {
    await processFiles(Array.from(files))
  }
}

const handleFileSelect = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    await processFiles(Array.from(target.files))
    target.value = ''
  }
}

const processFiles = async (files: File[]) => {
  const validFiles = files.filter(file => 
    file.type.startsWith('image/') && 
    ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) &&
    file.size <= 5 * 1024 * 1024
  )

  if (validFiles.length === 0) {
    alert('Por favor, sube solo imágenes (JPG, PNG, WebP) de menos de 5MB')
    return
  }

  const filesToProcess = validFiles.slice(0, 8 - previewImages.value.length)
  
  if (filesToProcess.length < validFiles.length) {
    alert(`Solo puedes subir hasta 8 imágenes. Se procesarán ${filesToProcess.length} de ${validFiles.length} archivos.`)
  }

  uploading.value = true
  
  try {
    for (const file of filesToProcess) {
      const compressedFile = await compressImage(file)
      const previewUrl = URL.createObjectURL(compressedFile)
      previewImages.value.push({
        file: compressedFile,
        preview: previewUrl
      })
      form.images.push(compressedFile)
    }
  } catch (error) {
    console.error('Error procesando imágenes:', error)
    alert('Ocurrió un error al procesar las imágenes. Por favor, inténtalo de nuevo.')
  } finally {
    uploading.value = false
  }
}

const removeImage = (index: number) => {
  URL.revokeObjectURL(previewImages.value[index].preview)
  previewImages.value.splice(index, 1)
  form.images.splice(index, 1)
}

const handleSubmit = async () => {
  if (!isFormValid.value) {
    return
  }
  
  if (!profile.value) {
    toast.error('Debes iniciar sesión para publicar un servicio')
    return
  }

  try {
    loading.value = true
    
    // Subir imágenes
    const imageUrls = []
    for (const file of form.images) {
      try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
        const filePath = `services/${fileName}`
        
        const { error: uploadError } = await supabase.storage
          .from('service-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (uploadError) {
          console.error('Error de Supabase Storage:', uploadError)
          toast.error(`Error al subir la imagen: ${uploadError.message}`)
          throw uploadError
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('service-images')
          .getPublicUrl(filePath)
        
        if (!publicUrl) {
          toast.error('Error al obtener la URL de la imagen')
          return
        }
        
        imageUrls.push(publicUrl)
      } catch (error) {
        console.error('Error subiendo imagen:', error)
        toast.error('Error al subir una o más imágenes')
        loading.value = false
        return
      }
    }

    const serviceData = {
      title: form.title,
      description: form.description,
      category: form.category,
      location: form.location,
      price_type: form.price_type,
      price_from: form.price_from!,
      price_to: form.price_to,
      availability: form.availability,
      response_time: form.response_time,
      user_id: profile.value.id,
      featured: form.featured,
      images: imageUrls
    }

    const { data, error } = await supabase
      .from('services')
      .insert(serviceData)
      .select()
      .single()

    if (error) throw error

    // Limpiar vistas previas
    previewImages.value.forEach(img => URL.revokeObjectURL(img.preview))
    toast.success('¡Servicio publicado exitosamente!')
    router.push('/services')
  } catch (error: any) {
    console.error('Error en handleSubmit:', error)
    toast.error('Error al publicar el servicio. Por favor, inténtalo de nuevo.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (profile.value) {
    form.location = profile.value.location || ''
  }
})
</script>