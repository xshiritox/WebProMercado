<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Profile Header -->
      <div class="bg-gradient-to-r from-primary-600 to-secondary-500 px-6 py-8">
        <div class="flex items-center space-x-4">
          <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <User class="w-10 h-10 text-primary-600" />
          </div>
          <div class="text-white">
            <h1 class="text-2xl font-bold">{{ profile?.full_name }}</h1>
            <p class="text-primary-100">{{ profile?.email }}</p>
            <div class="flex items-center gap-2 mt-2">
              <span
                v-if="profile?.badge"
                :class="badgeClass"
                class="px-3 py-1 rounded-full text-sm font-medium text-white"
              >
                {{ badgeText }}
              </span>
              <span class="text-primary-100 text-sm">
                Miembro desde {{ formatDate(profile?.created_at) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Content -->
      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Profile Form -->
          <div class="lg:col-span-2">
            <div class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">Información Personal</h2>
              
              <form @submit.prevent="handleUpdateProfile" class="space-y-6">
                <div>
                  <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <input
                    id="fullName"
                    v-model="form.full_name"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    disabled
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Número de teléfono"
                  />
                </div>

                <div>
                  <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <select
                    id="location"
                    v-model="form.location"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Selecciona tu ciudad</option>
                    <option v-for="city in colombianCities" :key="city" :value="city">
                      {{ city }}
                    </option>
                  </select>
                </div>

                <div class="flex justify-end">
                  <button
                    type="submit"
                    :disabled="loading"
                    class="btn-primary"
                  >
                    <Loader2 v-if="loading" class="animate-spin w-4 h-4" />
                    {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Statistics -->
          <div>
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Package class="w-4 h-4 text-primary-600" />
                    <span class="text-sm text-gray-600">Productos publicados</span>
                  </div>
                  <span class="font-semibold text-gray-900">{{ userStats.products }}</span>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <ShoppingCart class="w-4 h-4 text-green-600" />
                    <span class="text-sm text-gray-600">Productos vendidos</span>
                  </div>
                  <span class="font-semibold text-gray-900">{{ userStats.sold }}</span>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Star class="w-4 h-4 text-yellow-500" />
                    <span class="text-sm text-gray-600">Calificación</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="font-semibold text-gray-900">{{ userStats.rating }}</span>
                    <Star class="w-3 h-3 text-yellow-500 fill-current" />
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
              
              <div class="space-y-3">
                <router-link
                  to="/post-product"
                  class="w-full btn-primary justify-center"
                >
                  <Plus class="w-4 h-4" />
                  Publicar Producto
                </router-link>

                <button
                  @click="handleSignOut"
                  class="w-full btn-outline justify-center"
                >
                  <LogOut class="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- My Products -->
    <div class="mt-8 bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Mis Productos</h2>
        <router-link
          to="/post-product"
          class="btn-primary"
        >
          <Plus class="w-4 h-4" />
          Nuevo Producto
        </router-link>
      </div>

      <div v-if="userProducts.length === 0" class="text-center py-8">
        <Package class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">No tienes productos publicados</h3>
        <p class="text-gray-600 mb-4">Comienza a vender publicando tu primer producto</p>
        <router-link
          to="/post-product"
          class="btn-primary"
        >
          <Plus class="w-4 h-4" />
          Publicar Producto
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="product in userProducts"
          :key="product.id"
          class="border border-gray-200 rounded-lg p-4"
        >
          <img
            :src="product.images?.[0] || 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg'"
            :alt="product.title"
            class="w-full h-32 object-cover rounded-lg mb-3"
          />
          <h3 class="font-semibold text-gray-900 mb-1">{{ product.title }}</h3>
          <p class="text-primary-600 font-bold mb-2">${{ formatPrice(product.price) }}</p>
          <div class="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <span :class="statusClass(product.status)">{{ statusText(product.status) }}</span>
          </div>
          <div class="flex gap-2">
            <button
              @click="editProduct(product.id)"
              class="flex-1 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
            >
              Editar
            </button>
            <button
              @click="deleteProduct(product.id)"
              class="flex-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  User, Package, ShoppingCart, Star, Plus, LogOut, Loader2 
} from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'
import { useProducts } from '../composables/useProducts'
import { supabase } from '../lib/supabase'

const router = useRouter()
const { profile, loading, updateProfile, signOut } = useAuth()
const { deleteProduct: deleteProductFromStore } = useProducts()

const userProducts = ref<any[]>([])
const userStats = ref({
  products: 0,
  sold: 0,
  rating: 4.8
})

const form = reactive({
  full_name: '',
  email: '',
  phone: '',
  location: ''
})

const colombianCities = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta',
  'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué', 'Pasto', 'Manizales',
  'Neiva', 'Soledad', 'Armenia', 'Villavicencio', 'Montería', 'Valledupar'
]

const badgeClass = computed(() => {
  switch (profile.value?.badge) {
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
  switch (profile.value?.badge) {
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

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-CO', { 
    year: 'numeric', 
    month: 'long' 
  })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO').format(price)
}

const statusClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-100 px-2 py-1 rounded-full'
    case 'sold':
      return 'text-blue-600 bg-blue-100 px-2 py-1 rounded-full'
    case 'inactive':
      return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full'
    default:
      return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full'
  }
}

const statusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'Activo'
    case 'sold':
      return 'Vendido'
    case 'inactive':
      return 'Inactivo'
    default:
      return 'Desconocido'
  }
}

const handleUpdateProfile = async () => {
  await updateProfile(form)
}

const handleSignOut = async () => {
  await signOut()
  router.push('/')
}

const editProduct = (productId: string) => {
  router.push(`/product/${productId}/edit`)
}

const deleteProduct = async (productId: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    await deleteProductFromStore(productId)
    await loadUserProducts()
  }
}

const loadUserProducts = async () => {
  if (!profile.value) return

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', profile.value.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    userProducts.value = data || []
    userStats.value.products = data?.length || 0
    userStats.value.sold = data?.filter(p => p.status === 'sold').length || 0
  } catch (error) {
    console.error('Error loading user products:', error)
  }
}

onMounted(async () => {
  if (profile.value) {
    form.full_name = profile.value.full_name || ''
    form.email = profile.value.email || ''
    form.phone = profile.value.phone || ''
    form.location = profile.value.location || ''
    
    await loadUserProducts()
  }
})
</script>