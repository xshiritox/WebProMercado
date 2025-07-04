<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
      <p class="text-gray-600">Gestiona usuarios, productos, propiedades, servicios y contenido de la plataforma</p>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Home class="w-6 h-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Propiedades</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalProperties }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Wrench class="w-6 h-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Servicios</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totalServices }}</p>
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
                      v-if="user.badge"
                      :class="getBadgeClass(user.badge)"
                      class="px-2 py-1 rounded-full text-xs font-medium text-white"
                    >
                      {{ getBadgeText(user.badge) }}
                    </span>
                    <span v-else class="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      Sin rol
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
              class="border border-gray-200 rounded-lg p-4"
            >
              <img
                :src="product.images?.[0]"
                :alt="product.title"
                class="w-full h-32 object-cover rounded-lg mb-3"
                v-if="product.images?.[0]"
              />
              <div v-else class="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                <ImageOff class="w-8 h-8" />
              </div>
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

        <!-- Properties Tab -->
        <div v-if="activeTab === 'properties'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Gestión de Propiedades</h2>
            <div class="flex gap-2">
              <select
                v-model="propertyStatusFilter"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todos los estados</option>
                <option value="active">Activas</option>
                <option value="sold">Vendidas</option>
                <option value="rented">Alquiladas</option>
                <option value="inactive">Inactivas</option>
              </select>
              <input
                v-model="propertySearch"
                type="text"
                placeholder="Buscar propiedades..."
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="property in filteredProperties"
              :key="property.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <img
                :src="property.images?.[0]"
                :alt="property.title"
                class="w-full h-32 object-cover rounded-lg mb-3"
                v-if="property.images?.[0]"
              />
              <div v-else class="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                <ImageOff class="w-8 h-8" />
              </div>
              <h3 class="font-semibold text-gray-900 mb-1 truncate">{{ property.title }}</h3>
              <p class="text-primary-600 font-bold mb-2">${{ formatPrice(property.price) }}</p>
              <div class="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>{{ property.property_type }}</span>
                <span :class="getStatusClass(property.status)">
                  {{ getStatusText(property.status) }}
                </span>
              </div>
              <div class="flex gap-2">
                <button
                  @click="editProperty(property)"
                  class="flex-1 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
                >
                  Editar
                </button>
                <button
                  @click="deleteProperty(property.id)"
                  class="flex-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Services Tab -->
        <div v-if="activeTab === 'services'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Gestión de Servicios</h2>
            <div class="flex gap-2">
              <select
                v-model="serviceStatusFilter"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
              <input
                v-model="serviceSearch"
                type="text"
                placeholder="Buscar servicios..."
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="service in filteredServices"
              :key="service.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <img
                :src="service.images?.[0]"
                :alt="service.title"
                class="w-full h-32 object-cover rounded-lg mb-3"
                v-if="service.images?.[0]"
              />
              <div v-else class="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                <ImageOff class="w-8 h-8" />
              </div>
              <h3 class="font-semibold text-gray-900 mb-1 truncate">{{ service.title }}</h3>
              <p class="text-primary-600 font-bold mb-2">Desde ${{ formatPrice(service.price_from) }}</p>
              <div class="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>{{ service.category }}</span>
                <span :class="getStatusClass(service.status)">
                  {{ getStatusText(service.status) }}
                </span>
              </div>
              <div class="flex gap-2">
                <button
                  @click="editService(service)"
                  class="flex-1 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
                >
                  Editar
                </button>
                <button
                  @click="deleteService(service.id)"
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

          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div class="flex-1">
                <label for="report-type-filter" class="block text-sm font-medium text-gray-700 mb-1">Tipo de Reporte</label>
                <select
                  id="report-type-filter"
                  v-model="reportTypeFilter"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="all">Todos los tipos</option>
                  <option value="spam">Spam</option>
                  <option value="inappropriate">Contenido inapropiado</option>
                  <option value="scam">Estafa</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              <div class="flex-1">
                <label for="report-status-filter" class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  id="report-status-filter"
                  v-model="reportStatusFilter"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="pending">Pendientes</option>
                  <option value="resolved">Resueltos</option>
                  <option value="all">Todos</option>
                </select>
              </div>
            </div>

            <div v-if="filteredReports.length > 0" class="space-y-4">
              <div 
                v-for="report in filteredReports" 
                :key="report.id"
                class="border rounded-lg p-4"
                :class="{
                  'border-red-200 bg-red-50': report.status === 'pending',
                  'border-green-200 bg-green-50': report.status === 'resolved'
                }"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="font-medium text-gray-900">
                        {{ getReportTypeText(report.reason) }}
                      </h3>
                      <span 
                        class="px-2 py-0.5 rounded-full text-xs font-medium"
                        :class="{
                          'bg-red-100 text-red-800': report.status === 'pending',
                          'bg-green-100 text-green-800': report.status === 'resolved'
                        }"
                      >
                        {{ report.status === 'resolved' ? 'Resuelto' : 'Pendiente' }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mt-1">
                      Reportado por: {{ report.reporter?.full_name || 'Usuario eliminado' }}
                    </p>
                    <p class="text-sm text-gray-600">
                      Fecha: {{ formatDate(report.created_at) }}
                    </p>
                  </div>
                  <div class="flex gap-2">
                    <button
                      v-if="report.status !== 'resolved'"
                      @click="resolveReport(report.id)"
                      class="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Marcar como resuelto
                    </button>
                    <button
                      @click="deleteReport(report.id)"
                      class="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                
                <div class="mt-3 p-3 bg-white rounded border border-gray-200">
                  <p class="text-sm font-medium text-gray-900">Descripción:</p>
                  <p class="text-sm text-gray-700 mt-1">{{ report.description || 'Sin descripción adicional' }}</p>
                </div>

                <div v-if="report.products" class="mt-3 p-3 bg-gray-50 rounded">
                  <p class="text-sm font-medium text-gray-900">Producto reportado:</p>
                  <div class="flex items-center gap-3 mt-2">
                    <img 
                      :src="report.products.images?.[0]" 
                      :alt="report.products.title"
                      class="w-12 h-12 object-cover rounded"
                      v-if="report.products.images?.[0]"
                    />
                    <div>
                      <p class="text-sm font-medium">{{ report.products.title }}</p>
                      <p class="text-sm text-gray-600">${{ formatPrice(report.products.price) }}</p>
                    </div>
                  </div>
                </div>

                <div v-if="report.properties" class="mt-3 p-3 bg-gray-50 rounded">
                  <p class="text-sm font-medium text-gray-900">Propiedad reportada:</p>
                  <div class="flex items-center gap-3 mt-2">
                    <img 
                      :src="report.properties.images?.[0]" 
                      :alt="report.properties.title"
                      class="w-12 h-12 object-cover rounded"
                      v-if="report.properties.images?.[0]"
                    />
                    <div>
                      <p class="text-sm font-medium">{{ report.properties.title }}</p>
                      <p class="text-sm text-gray-600">${{ formatPrice(report.properties.price) }}</p>
                    </div>
                  </div>
                </div>

                <div v-if="report.services" class="mt-3 p-3 bg-gray-50 rounded">
                  <p class="text-sm font-medium text-gray-900">Servicio reportado:</p>
                  <div class="flex items-center gap-3 mt-2">
                    <img 
                      :src="report.services.images?.[0]" 
                      :alt="report.services.title"
                      class="w-12 h-12 object-cover rounded"
                      v-if="report.services.images?.[0]"
                    />
                    <div>
                      <p class="text-sm font-medium">{{ report.services.title }}</p>
                      <p class="text-sm text-gray-600">Desde ${{ formatPrice(report.services.price_from) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="bg-gray-50 rounded-lg p-8 text-center">
              <AlertTriangle class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 class="text-lg font-semibold text-gray-900 mb-2">No hay reportes</h3>
              <p class="text-gray-600">No se encontraron reportes con los filtros seleccionados</p>
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
  Users, Package, DollarSign, AlertTriangle, Search, User, Settings, ImageOff, Home, Wrench
} from 'lucide-vue-next'
import { supabase } from '../lib/supabase'
import { useToast } from 'vue-toastification'

interface User {
  id: string
  email: string
  full_name: string
  created_at: string
  product_count?: number
  badge?: string
}

interface Product {
  id: string
  title: string
  price: number
  category: string
  status: string
  images?: string[]
  created_at: string
}

interface Property {
  id: string
  title: string
  price: number
  property_type: string
  status: string
  images?: string[]
  created_at: string
}

interface Service {
  id: string
  title: string
  price_from: number
  category: string
  status: string
  images?: string[]
  created_at: string
}

interface Report {
  id: string
  reason: string
  status: 'pending' | 'resolved'
  description: string
  created_at: string
  reporter?: {
    id: string
    full_name: string
  }
  products?: Product
  properties?: Property
  services?: Service
  resolved_at?: string
}

const toast = useToast()

const activeTab = ref('users')
const userSearch = ref('')
const productSearch = ref('')
const propertySearch = ref('')
const serviceSearch = ref('')
const productStatusFilter = ref('')
const propertyStatusFilter = ref('')
const serviceStatusFilter = ref('')
const reportStatusFilter = ref('pending')
const reportTypeFilter = ref('all')

const stats = ref({
  totalUsers: 0,
  totalProducts: 0,
  totalProperties: 0,
  totalServices: 0,
  pendingReports: 0
})

const users = ref<User[]>([])
const products = ref<Product[]>([])
const properties = ref<Property[]>([])
const services = ref<Service[]>([])
const reports = ref<Report[]>([])

const tabs = [
  { id: 'users', name: 'Usuarios', icon: Users },
  { id: 'products', name: 'Productos', icon: Package },
  { id: 'properties', name: 'Propiedades', icon: Home },
  { id: 'services', name: 'Servicios', icon: Wrench },
  { id: 'reports', name: 'Reportes', icon: AlertTriangle },
  { id: 'settings', name: 'Configuración', icon: Settings }
]

const filteredUsers = computed(() => {
  if (!userSearch.value) return users.value
  
  const query = userSearch.value.toLowerCase()
  return users.value.filter(user =>
    (user.full_name?.toLowerCase().includes(query) || '') ||
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
      (p.category?.toLowerCase().includes(query) || '')
    )
  }

  return filtered
})

const filteredProperties = computed(() => {
  let filtered = properties.value

  if (propertyStatusFilter.value) {
    filtered = filtered.filter(p => p.status === propertyStatusFilter.value)
  }

  if (propertySearch.value) {
    const query = propertySearch.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(query) ||
      (p.property_type?.toLowerCase().includes(query) || '')
    )
  }

  return filtered
})

const filteredServices = computed(() => {
  let filtered = services.value

  if (serviceStatusFilter.value) {
    filtered = filtered.filter(s => s.status === serviceStatusFilter.value)
  }

  if (serviceSearch.value) {
    const query = serviceSearch.value.toLowerCase()
    filtered = filtered.filter(s =>
      s.title.toLowerCase().includes(query) ||
      (s.category?.toLowerCase().includes(query) || '')
    )
  }

  return filtered
})

const filteredReports = computed(() => {
  let filtered = reports.value

  if (reportStatusFilter.value && reportStatusFilter.value !== 'all') {
    filtered = filtered.filter(r => r.status === reportStatusFilter.value)
  }

  if (reportTypeFilter.value && reportTypeFilter.value !== 'all') {
    filtered = filtered.filter(r => r.reason === reportTypeFilter.value)
  }

  return filtered
})

const loadStats = async () => {
  try {
    // Fetch user count
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // Fetch product counts
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    // Fetch property counts
    const { count: propertyCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })

    // Fetch service counts
    const { count: serviceCount } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })

    // Fetch pending reports count
    const { count: pendingReportsCount } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    stats.value = {
      totalUsers: userCount || 0,
      totalProducts: productCount || 0,
      totalProperties: propertyCount || 0,
      totalServices: serviceCount || 0,
      pendingReports: pendingReportsCount || 0
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

const loadReports = async () => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        reporter:reporter_id (id, full_name),
        products:product_id (*),
        properties:property_id (*),
        services:service_id (*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    reports.value = data || []
    
    // Update stats after loading reports
    stats.value.pendingReports = data?.filter((r: any) => r.status === 'pending').length || 0
  } catch (error) {
    console.error('Error loading reports:', error)
  }
}

const resolveReport = async (reportId: string) => {
  if (!confirm('¿Marcar este reporte como resuelto?')) return

  try {
    const { error } = await supabase
      .from('reports')
      .update({ status: 'resolved', resolved_at: new Date().toISOString() })
      .eq('id', reportId)
    
    if (error) throw error
    
    // Update local state
    const index = reports.value.findIndex(r => r.id === reportId)
    if (index !== -1) {
      reports.value[index].status = 'resolved'
      stats.value.pendingReports = Math.max(0, stats.value.pendingReports - 1)
    }
    
    toast.success('Reporte marcado como resuelto')
  } catch (error) {
    console.error('Error resolving report:', error)
    toast.error('Error al marcar el reporte como resuelto')
  }
}

const deleteReport = async (reportId: string) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este reporte?')) return

  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', reportId)
    
    if (error) throw error
    
    // Update local state
    const wasPending = reports.value.find(r => r.id === reportId)?.status === 'pending'
    reports.value = reports.value.filter(r => r.id !== reportId)
    
    if (wasPending) {
      stats.value.pendingReports = Math.max(0, stats.value.pendingReports - 1)
    }
    
    toast.success('Reporte eliminado correctamente')
  } catch (error) {
    console.error('Error deleting report:', error)
    toast.error('Error al eliminar el reporte')
  }
}

const getReportTypeText = (type: string) => {
  const types: { [key: string]: string } = {
    spam: 'Spam',
    inappropriate: 'Contenido inapropiado',
    fake: 'Información falsa',
    scam: 'Posible estafa',
    copyright: 'Violación de derechos de autor',
    other: 'Otro problema'
  }
  return types[type] || type
}

const getBadgeClass = (badge?: string) => {
  switch (badge) {
    case 'destacado': return 'bg-yellow-500'
    case 'colaborador': return 'bg-blue-500'
    case 'vip': return 'bg-purple-500'
    case 'moderador': return 'bg-green-500'
    case 'admin': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
}

const getBadgeText = (badge?: string) => {
  switch (badge) {
    case 'destacado': return 'Destacado'
    case 'colaborador': return 'Colaborador'
    case 'vip': return 'VIP'
    case 'moderador': return 'Moderador'
    case 'admin': return 'Admin'
    default: return 'Sin rol'
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs'
    case 'sold': return 'text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs'
    case 'rented': return 'text-purple-600 bg-purple-100 px-2 py-1 rounded-full text-xs'
    case 'inactive': return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs'
    default: return 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'Activo'
    case 'sold': return 'Vendido'
    case 'rented': return 'Alquilado'
    case 'inactive': return 'Inactivo'
    default: return status
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO').format(price)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-CO')
}

const editUser = (user: User) => {
  console.log('Edit user:', user)
}

const deleteUser = async (userId: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
    console.log('Delete user:', userId)
  }
}

const editProduct = (product: Product) => {
  console.log('Edit product:', product)
}

const deleteProduct = async (productId: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
      
      if (error) throw error
      
      products.value = products.value.filter(p => p.id !== productId)
      stats.value.totalProducts = Math.max(0, stats.value.totalProducts - 1)
      toast.success('Producto eliminado correctamente')
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Error al eliminar el producto')
    }
  }
}

const editProperty = (property: Property) => {
  console.log('Edit property:', property)
}

const deleteProperty = async (propertyId: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)
      
      if (error) throw error
      
      properties.value = properties.value.filter(p => p.id !== propertyId)
      stats.value.totalProperties = Math.max(0, stats.value.totalProperties - 1)
      toast.success('Propiedad eliminada correctamente')
    } catch (error) {
      console.error('Error deleting property:', error)
      toast.error('Error al eliminar la propiedad')
    }
  }
}

const editService = (service: Service) => {
  console.log('Edit service:', service)
}

const deleteService = async (serviceId: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)
      
      if (error) throw error
      
      services.value = services.value.filter(s => s.id !== serviceId)
      stats.value.totalServices = Math.max(0, stats.value.totalServices - 1)
      toast.success('Servicio eliminado correctamente')
    } catch (error) {
      console.error('Error deleting service:', error)
      toast.error('Error al eliminar el servicio')
    }
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

const loadProperties = async () => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    properties.value = data || []
  } catch (error) {
    console.error('Error loading properties:', error)
  }
}

const loadServices = async () => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    services.value = data || []
  } catch (error) {
    console.error('Error loading services:', error)
  }
}

onMounted(async () => {
  await Promise.all([
    loadStats(),
    loadUsers(),
    loadProducts(),
    loadProperties(),
    loadServices(),
    loadReports()
  ])
})
</script>