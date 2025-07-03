<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Publicar Propiedad</h1>
        <p class="text-gray-600">Completa la información de tu propiedad para comenzar a vender o alquilar</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Information -->
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
              placeholder="Ejemplo: Apartamento 3 habitaciones en Chapinero"
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
            <label for="property_type" class="block text-sm font-medium text-gray-700 mb-2">
              Tipo de propiedad *
            </label>
            <select
              id="property_type"
              v-model="form.property_type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Selecciona el tipo</option>
              <option value="casa">Casa</option>
              <option value="apartamento">Apartamento</option>
              <option value="local">Local Comercial</option>
              <option value="oficina">Oficina</option>
              <option value="lote">Lote</option>
            </select>
          </div>

          <div>
            <label for="transaction_type" class="block text-sm font-medium text-gray-700 mb-2">
              Tipo de transacción *
            </label>
            <select
              id="transaction_type"
              v-model="form.transaction_type"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Selecciona el tipo</option>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label for="bedrooms" class="block text-sm font-medium text-gray-700 mb-2">
              Habitaciones
            </label>
            <input
              id="bedrooms"
              v-model="form.bedrooms"
              type="number"
              min="0"
              max="20"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="0"
            />
          </div>

          <div>
            <label for="bathrooms" class="block text-sm font-medium text-gray-700 mb-2">
              Baños
            </label>
            <input
              id="bathrooms"
              v-model="form.bathrooms"
              type="number"
              min="0"
              max="20"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="0"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
              Ciudad *
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
            <label for="stratum" class="block text-sm font-medium text-gray-700 mb-2">
              Estrato
            </label>
            <select
              id="stratum"
              v-model="form.stratum"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Selecciona el estrato</option>
              <option value="1">Estrato 1</option>
              <option value="2">Estrato 2</option>
              <option value="3">Estrato 3</option>
              <option value="4">Estrato 4</option>
              <option value="5">Estrato 5</option>
              <option value="6">Estrato 6</option>
            </select>
          </div>
        </div>

        <div>
          <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
            Dirección *
          </label>
          <input
            id="address"
            v-model="form.address"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Dirección completa de la propiedad"
          />
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
            placeholder="Describe tu propiedad en detalle. Incluye características especiales, ubicación, servicios cercanos, etc."
          ></textarea>
        </div>

        <!-- Images -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Imágenes de la propiedad
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
              Máximo 10 imágenes. Formatos: JPG, PNG, WebP 
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

        <!-- Additional Details -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Detalles Adicionales</h3>
          
          <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div>
              <label for="parking_spaces" class="block text-sm font-medium text-gray-700 mb-2">
                Espacios de parqueadero
              </label>
              <input
                id="parking_spaces"
                v-model="form.parking_spaces"
                type="number"
                min="0"
                max="20"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0"
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
                <h4 class="font-medium text-gray-900">Propiedad Destacada</h4>
                <p class="text-sm text-gray-600">Tu propiedad aparecerá en la parte superior</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-lg font-semibold text-secondary-600">$25,000</span>
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
            <Home v-else class="w-4 h-4" />
            {{ loading ? 'Publicando...' : 'Publicar Propiedad' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { uploadFile, deleteFile } from '../utils/storage'
import { Home, ImageIcon, Loader2, X } from 'lucide-vue-next'
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
  price: null as number | null,
  property_type: '',
  transaction_type: '',
  bedrooms: null as number | null,
  bathrooms: null as number | null,
  location: '',
  address: '',
  description: '',
  parking_spaces: null as number | null,
  stratum: null as number | null,
  featured: false,
  images: [] as File[]
})

const colombianCities = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta',
  'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué', 'Pasto', 'Manizales',
  'Neiva', 'Soledad', 'Armenia', 'Villavicencio', 'Montería', 'Valledupar', 'Granada'
]

const isFormValid = computed(() => {
  return (
    form.title.trim() &&
    form.price &&
    form.property_type &&
    form.transaction_type &&
    form.location &&
    form.address.trim() &&
    form.description.trim()
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
    const compressedBlob = await imageCompression(file, options)
    // Convert Blob to File
    return new File([compressedBlob], file.name, {
      type: compressedBlob.type,
      lastModified: Date.now()
    })
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

  const filesToProcess = validFiles.slice(0, 10 - previewImages.value.length)
  
  if (filesToProcess.length < validFiles.length) {
    alert(`Solo puedes subir hasta 10 imágenes. Se procesarán ${filesToProcess.length} de ${validFiles.length} archivos.`)
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
    toast.error('Debes iniciar sesión para publicar una propiedad')
    return
  }

  try {
    loading.value = true
    
    // Verificar que hay imágenes para subir
    if (!form.images || form.images.length === 0) {
      throw new Error('Debes subir al menos una imagen de la propiedad')
    }
    
    // Subir imágenes
    const imageUrls: string[] = []
    
    for (let i = 0; i < form.images.length; i++) {
      const file = form.images[i]
      try {
        console.log(`Subiendo imagen ${i + 1} de ${form.images.length}...`)
        
        // Usar la función uploadFile del helper
        const imageUrl = await uploadFile(
          'property-images',  // bucket
          file,               // archivo
          `properties/${profile.value.id}`,  // ruta
          `property_${Date.now()}_${i}.${file.name.split('.').pop()}`  // nombre de archivo
        )
        
        console.log('Imagen subida correctamente:', imageUrl)
        imageUrls.push(imageUrl)
        
      } catch (error: any) {
        console.error('Error subiendo imagen:', error)
        
        // Si hay un error, eliminar las imágenes que ya se subieron
        if (imageUrls.length > 0) {
          console.log('Eliminando imágenes ya subidas debido a un error...')
          for (const url of imageUrls) {
            try {
              const filePath = url.split('/').pop()
              if (filePath) {
                await deleteFile('property-images', filePath)
              }
            } catch (deleteError) {
              console.error('Error eliminando imagen después de fallo:', deleteError)
            }
          }
        }
        
        toast.error(`Error al subir la imagen: ${error.message || 'Error desconocido'}`)
        loading.value = false
        return
      }
    }

    const propertyData = {
      title: form.title,
      description: form.description,
      price: form.price!,
      property_type: form.property_type as 'casa' | 'apartamento' | 'local' | 'oficina' | 'lote',
      transaction_type: form.transaction_type as 'venta' | 'alquiler',
      bedrooms: form.bedrooms,
      bathrooms: form.bathrooms,
      area: 1, // Default value since area is required in the database
      location: form.location,
      address: form.address,
      user_id: profile.value.id,
      featured: form.featured,
      images: imageUrls,
      amenities: [], // Empty array since we removed amenities
      parking_spaces: form.parking_spaces || 0,
      year_built: null, // Removed from form
      stratum: form.stratum
    }

    const { error } = await supabase
      .from('properties')
      .insert(propertyData)
      .select()
      .single()

    if (error) throw error

    // Limpiar vistas previas
    previewImages.value.forEach(img => URL.revokeObjectURL(img.preview))
    toast.success('¡Propiedad publicada exitosamente!')
    router.push('/properties')
  } catch (error: any) {
    console.error('Error en handleSubmit:', error)
    toast.error('Error al publicar la propiedad. Por favor, inténtalo de nuevo.')
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