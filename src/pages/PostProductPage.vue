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
                @click="$refs.fileInput.click()"
              >
                selecciona archivos
              </button>
            </p>
            <p class="text-sm text-gray-500 mb-4">
              Máximo 5 imágenes. Formatos: JPG, PNG, WebP (máx. 5MB cada una)
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
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <p v-if="uploading" class="mt-2 text-sm text-gray-500">
                Comprimiendo y subiendo imágenes...
              </p>
            </div>
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
                placeholder="Número de teléfono"
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
import { reactive, computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Package, ImageIcon, Loader2 } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'
import { useProducts } from '../composables/useProducts'
import { useToast } from 'vue-toastification'
import imageCompression from 'browser-image-compression'
import { supabase } from '../lib/supabase'

const router = useRouter()
const toast = useToast()
const { profile } = useAuth()
const { createProduct, categories } = useProducts()
const loading = ref(false)

const fileInput = ref<HTMLInputElement | null>(null)
const dragOver = ref(false)
const previewImages = ref<Array<{ file: File, preview: string }>>([])
const uploading = ref(false)

const form = reactive({
  title: '',
  price: null as number | null,
  category: '',
  condition: '',
  location: '',
  description: '',
  contact_name: '',
  contact_phone: '',
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
    form.category &&
    form.condition &&
    form.location &&
    form.description.trim()
  )
})

const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 0.1, // 100KB
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
    target.value = '' // Reset input para permitir cargar la misma imagen otra vez
  }
}

const processFiles = async (files: File[]) => {
  const validFiles = files.filter(file => 
    file.type.startsWith('image/') && 
    ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) &&
    file.size <= 5 * 1024 * 1024 // 5MB
  )

  if (validFiles.length === 0) {
    alert('Por favor, sube solo imágenes (JPG, PNG, WebP) de menos de 5MB')
    return
  }

  const filesToProcess = validFiles.slice(0, 5 - previewImages.value.length)
  
  if (filesToProcess.length < validFiles.length) {
    alert(`Solo puedes subir hasta 5 imágenes. Se procesarán ${filesToProcess.length} de ${validFiles.length} archivos.`)
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
  console.log('Iniciando envío del formulario...')
  
  if (!isFormValid.value) {
    console.error('Formulario no válido')
    return
  }
  
  if (!profile.value) {
    console.error('No hay usuario autenticado')
    toast.error('Debes iniciar sesión para publicar un producto')
    return
  }
  
  if (form.images.length === 0) {
    if (!confirm('¿Estás seguro de publicar el producto sin imágenes?')) {
      return
    }
  }

  try {
    console.log('Iniciando carga de imágenes...')
    loading.value = true
    
    // Subir imágenes primero
    const imageUrls = []
    for (const file of form.images) {
      try {
        console.log('Procesando imagen:', file.name)
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
        const filePath = `products/${fileName}`
        
        console.log('Subiendo a Supabase Storage...')
        const { data, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (uploadError) {
          if (uploadError.message.includes('Bucket not found')) {
            console.error('Error: El bucket no existe. Por favor crea un bucket llamado "product-images" en Supabase Storage.')
            toast.error('Error de configuración: El almacenamiento de imágenes no está configurado correctamente.')
          } else {
            console.error('Error de Supabase Storage:', uploadError)
            toast.error(`Error al subir la imagen: ${uploadError.message}`)
          }
          throw uploadError
        }
        
        // Obtener URL pública
        console.log('Obteniendo URL pública...')
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)
        
        if (!publicUrl) {
          console.error('No se pudo obtener la URL pública de la imagen')
          toast.error('Error al obtener la URL de la imagen')
          return
        }
        
        console.log('Imagen subida correctamente:', publicUrl)
        imageUrls.push(publicUrl)
      } catch (error) {
        console.error('Error subiendo imagen:', error)
        toast.error('Error al subir una o más imágenes')
        loading.value = false
        return
      }
    }

    console.log('Preparando datos del producto...')
    const productData = {
      title: form.title,
      description: form.description,
      price: form.price!,
      category: form.category,
      condition: form.condition as 'nuevo' | 'usado' | 'reacondicionado',
      location: form.location,
      user_id: profile.value.id,
      featured: form.featured,
      images: imageUrls,
      contact_name: form.contact_name,
      contact_phone: form.contact_phone
    }

    console.log('Creando producto...', productData)
    const result = await createProduct(productData)
    
    if (result) {
      console.log('Producto creado exitosamente:', result)
      // Limpiar vistas previas
      previewImages.value.forEach(img => URL.revokeObjectURL(img.preview))
      toast.success('¡Producto publicado exitosamente!')
      router.push('/products')
    } else {
      console.error('No se pudo crear el producto')
      toast.error('No se pudo publicar el producto. Inténtalo de nuevo.')
    }
  } catch (error) {
    console.error('Error en handleSubmit:', error)
    toast.error('Error al publicar el producto. Por favor, inténtalo de nuevo.')
  } finally {
    console.log('Finalizando proceso de envío...')
    loading.value = false
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