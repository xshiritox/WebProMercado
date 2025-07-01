<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
      <p class="text-gray-600">Gestiona usuarios, productos y contenido de la plataforma</p>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <Users class="w-6 h-6 text-primary-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Usuarios</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalUsers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
            <Package class="w-6 h-6 text-secondary-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Productos</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalProducts }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <DollarSign class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Productos Activos</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.activeProducts }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle class="w-6 h-6 text-red-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Reportes Pendientes</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.pendingReports }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Tabs -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="border-b border-gray-200">
        <nav class="flex">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <component :is="tab.icon" class="w-4 h-4 mr-2 inline" />
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <div class="p-6">
        <!-- Users Tab -->
        <div v-if="activeTab === 'users'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Gestión de Usuarios</h2>
            <div class="flex gap-2">
              <input
                v-model="userSearch"
                type="text"
                placeholder="Buscar usuarios..."
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button class="btn-primary">
                <Search class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Insignia
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Productos
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <User class="w-4 h-4 text-white" />
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">{{ user.full_name }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ user.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="getBadgeClass(user.badge)"
                      class="px-2 py-1 rounded-full text-xs font-medium text-white"
                    >
                      {{ getBadgeText(user.badge) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ user.product_count || 0 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(user.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button
                        @click="editUser(user)"
                        class="text-primary-600 hover:text-primary-900"
                      >
                        Edit
                      </button>
                      <button
                        @click="deleteUser(user.id)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Products Tab -->
        <div v-if="activeTab === 'products'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Gestión de Productos</h2>
            <div class="flex gap-2">
              <select
                v-model="productStatusFilter"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="sold">Vendidos</option>
                <option value="inactive">Inactivos</option>
              </select>
              <input
                v-model="productSearch"
                type="text"
                placeholder="Buscar productos..."
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="bg-white border border-gray-200 rounded-lg p-4"
            >
              <img
                :src="product.images?.[0] || 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg'"
                :alt="product.title"
                class="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h3 class="font-semibold text-gray-900 mb-1 truncate">{{ product.title }}</h3>
              <p class="text-primary-600 font-bold mb-2">${{ formatPrice(product.price) }}</p>
              <div class="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>{{ product.category }}</span>
                <span :class="getStatusClass(product.status)">
                  {{ getStatusText(product.status) }}
                </span>
              </div>
              <div class="flex gap-2">
                <button
                  @click="editProduct(product)"
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

        <!-- Reports Tab -->
        <div v-if="activeTab === 'reports'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Reportes y Moderación</h2>
          </div>

          <div class="bg-gray-50 rounded-lg p-8 text-center">
            <AlertTriangle class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No hay reportes pendientes</h3>
            <p class="text-gray-600">Los reportes de usuarios aparecerán aquí para su revisión</p>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Configuración del Sistema</h2>
          </div>

          <div class="space-y-6">
            <div class="bg-gray-50 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Configuración General</h3>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium text-gray-900">Modo Mantenimiento</h4>
                    <p class="text-sm text-gray-600">Deshabilita el acceso público a la plataforma</p>
                  </div>
                  <input
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium text-gray-900">Registro de Usuarios</h4>
                    <p class="text-sm text-gray-600">Permite que nuevos usuarios se registren</p>
                  </div>
                  <input
                    type="checkbox"
                    checked
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium text-gray-900">Moderación de Productos</h4>
                    <p class="text-sm text-gray-600">Requiere aprobación para nuevos productos</p>
                  </div>
                  <input
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Users, Package, DollarSign, AlertTriangle, Search, User, Settings
} from 'lucide-vue-next'
import { supabase } from '../lib/supabase'

const activeTab = ref('users')
const userSearch = ref('')
const productSearch = ref('')
const productStatusFilter = ref('')

const stats = ref({
  totalUsers: 0,
  totalProducts: 0,
  activeProducts: 0,
  pendingReports: 0
})

const users = ref<any[]>([])
const products = ref<any[]>([])

const tabs = [
  { id: 'users', name: 'Usuarios', icon: Users },
  { id: 'products', name: 'Productos', icon: Package },
  { id: 'reports', name: 'Reportes', icon: AlertTriangle },
  { id: 'settings', name: 'Configuración', icon: Settings }
]

const filteredUsers = computed(() => {
  if (!userSearch.value) return users.value
  
  const query = userSearch.value.toLowerCase()
  return users.value.filter(user =>
    user.full_name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  )
})

const filteredProducts = computed(() => {
  let filtered = products.value

  if (productStatusFilter.value) {
    filtered = filtered.filter(p => p.status === productStatusFilter.value)
  }

  if (productSearch.value) {
    const query = productSearch.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    )
  }

  return filtered
})

const getBadgeClass = (badge: string) => {
  switch (badge) {
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
}

const getBadgeText = (badge: string) => {
  switch (badge) {
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
      return 'Usuario'
  }
}

const getStatusClass = (status: string) => {
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

const getStatusText = (status: string) => {
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

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO').format(price)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-CO')
}

const editUser = (user: any) => {
  // TODO: Implement user editing
  console.log('Edit user:', user)
}

const deleteUser = async (userId: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
    // TODO: Implement user deletion
    console.log('Delete user:', userId)
  }
}

const editProduct = (product: any) => {
  // TODO: Implement product editing
  console.log('Edit product:', product)
}

const deleteProduct = async (productId: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    // TODO: Implement product deletion
    console.log('Delete product:', productId)
  }
}

const loadStats = async () => {
  try {
    // Load users count
    const { count: usersCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // Load products count
    const { count: productsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    // Load active products count
    const { count: activeProductsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    stats.value = {
      totalUsers: usersCount || 0,
      totalProducts: productsCount || 0,
      activeProducts: activeProductsCount || 0,
      pendingReports: 0
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

const loadUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    users.value = data || []
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

const loadProducts = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    products.value = data || []
  } catch (error) {
    console.error('Error loading products:', error)
  }
}

onMounted(async () => {
  await Promise.all([
    loadStats(),
    loadUsers(),
    loadProducts()
  ])
})
</script>