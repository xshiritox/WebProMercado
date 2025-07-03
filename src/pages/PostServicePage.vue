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
              Máximo 8 imágenes. Formatos: JPG, PNG, WebP 
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
import { uploadFile } from '../utils/storage'
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
    maxSizeMB: 0.1, // 100KB
    maxWidthOrHeight: 1024, // Ancho o alto máximo
    useWebWorker: true,
    maxIteration: 10
  }

  try {
    const compressedBlob = await imageCompression(file, options)
    // Convertir Blob a File
    return new File([compressedBlob], file.name, {
      type: compressedBlob.type,
      lastModified: Date.now()
    })
  } catch (error) {
    console.error('Error comprimiendo la imagen:', error)
    toast.error('Error al procesar la imagen')
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
  // Validar tipos de archivo
  const validFiles = files.filter(file => {
    const isValidType = file.type.startsWith('image/') && 
      ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    
    if (!isValidType) {
      toast.warning(`El archivo ${file.name} no es una imagen válida (solo JPG, PNG, WebP)`)
      return false
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.warning(`La imagen ${file.name} es demasiado grande (máx. 5MB)`)
      return false
    }
    
    return true
  })

  if (validFiles.length === 0) {
    toast.error('No hay imágenes válidas para subir')
    return
  }

  const maxFiles = 8
  const filesToProcess = validFiles.slice(0, maxFiles - previewImages.value.length)
  
  if (filesToProcess.length < validFiles.length) {
    toast.warning(`Solo puedes subir hasta ${maxFiles} imágenes. Se procesarán ${filesToProcess.length} de ${validFiles.length} archivos.`)
  }

  uploading.value = true
  
  try {
    for (const file of filesToProcess) {
      try {
        // Comprimir la imagen
        const compressedFile = await compressImage(file)
        
        // Crear vista previa
        const previewUrl = URL.createObjectURL(compressedFile)
        
        // Agregar a las vistas previas
        previewImages.value.push({
          file: compressedFile,
          preview: previewUrl
        })
        
        // Agregar el archivo comprimido al formulario
        form.images.push(compressedFile)
      } catch (error) {
        console.error('Error procesando imagen:', file.name, error)
        toast.error(`Error al procesar la imagen ${file.name}`)
      }
    }
  } catch (error) {
    console.error('Error inesperado al procesar imágenes:', error)
    toast.error('Ocurrió un error al procesar las imágenes. Por favor, inténtalo de nuevo.')
  } finally {
    uploading.value = false
  }
}

const removeImage = (index: number) => {
  URL.revokeObjectURL(previewImages.value[index].preview)
  previewImages.value.splice(index, 1)
  form.images.splice(index, 1)
}

const validatePrice = (price: number | null): number | null => {
  if (price === null) return null
  // Convertir a número y redondear a 2 decimales
  const num = Number(price)
  if (isNaN(num)) return null
  
  // Asegurarse de que el número no exceda los 12 dígitos en total (incluyendo decimales)
  const maxValue = 9999999999.99 // 10 dígitos enteros + 2 decimales
  if (Math.abs(num) > maxValue) {
    toast.error(`El precio no puede ser mayor a ${maxValue.toLocaleString()}`)
    throw new Error('Precio excede el límite')
  }
  
  return Number(num.toFixed(2))
}

const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  loading.value = true
  
  try {
    // Validar precios
    const priceFrom = validatePrice(form.price_from)
    const priceTo = form.price_to ? validatePrice(form.price_to) : null
    
    if (priceFrom === null) {
      toast.error('Por favor ingresa un precio válido')
      return
    }
    
    if (priceTo !== null && priceTo < priceFrom) {
      toast.error('El precio máximo no puede ser menor que el precio mínimo')
      return
    }

    // Subir las imágenes primero
    const imageUrls: string[] = []
    for (let i = 0; i < form.images.length; i++) {
      const file = form.images[i]
      if (file instanceof File) {
        try {
          toast.info(`Subiendo imagen ${i + 1} de ${form.images.length}...`)
          
          // Subir la imagen usando la utilidad de almacenamiento
          const imageUrl = await uploadFile(
            'service-images',  // bucket
            file,              // archivo
            `services/${profile.value.id}`,  // ruta
            `service_${Date.now()}_${i}.${file.name.split('.').pop()}`  // nombre de archivo
          )
          
          imageUrls[i] = imageUrl
          toast.success(`Imagen ${i + 1} subida correctamente`)
        } catch (error: any) {
          console.error('Error subiendo imagen:', error)
          toast.error(`Error al subir la imagen ${i + 1}: ${error.message || 'Error desconocido'}`)
          loading.value = false
          return
        }
      }
    }
    
    // Crear objeto con las URLs de las imágenes
    const serviceData = {
      ...form,
      images: imageUrls,
      user_id: profile.value.id,
      price_from: priceFrom,
      price_to: priceTo,
    }

    const { error } = await supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single()

    if (error) throw error

    // Limpiar vistas previas si hay imágenes
    if (previewImages.value.length > 0) {
      previewImages.value.forEach(img => URL.revokeObjectURL(img.preview))
    }
    
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