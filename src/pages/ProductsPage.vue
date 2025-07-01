<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Productos</h1>
      <p class="text-gray-600">Encuentra los mejores productos de nuestra comunidad</p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
          <div class="relative">
            <input
              v-model="searchInput"
              @input="handleSearch"
              type="text"
              placeholder="Buscar productos..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <Search class="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <!-- Category Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
          <select
            v-model="selectedCategoryLocal"
            @change="handleCategoryChange"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Todas las categorías</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Price Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Precio</label>
          <select
            v-model="priceRange"
            @change="handlePriceFilter"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Cualquier precio</option>
            <option value="0-100000">Hasta $100,000</option>
            <option value="100000-500000">$100,000 - $500,000</option>
            <option value="500000-1000000">$500,000 - $1,000,000</option>
            <option value="1000000-5000000">$1,000,000 - $5,000,000</option>
            <option value="5000000+">Más de $5,000,000</option>
          </select>
        </div>

        <!-- Sort -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
          <select
            v-model="sortByLocal"
            @change="handleSortChange"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="created_at">Más recientes</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Results Info -->
    <div class="flex justify-between items-center mb-6">
      <p class="text-gray-600">
        Mostrando {{ filteredProducts.length }} productos
        <span v-if="searchQuery">de "{{ searchQuery }}"</span>
        <span v-if="selectedCategory">en {{ selectedCategory }}</span>
      </p>
      
      <router-link
        v-if="isAuthenticated"
        to="/post-product"
        class="btn-primary"
      >
        <Plus class="w-4 h-4" />
        Publicar Producto
      </router-link>
    </div>

    <!-- Products Grid -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="n in 8" :key="n" class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div class="h-48 bg-gray-200"></div>
        <div class="p-4">
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
      <Package class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
      <p class="text-gray-600 mb-6">Intenta ajustar tus filtros de búsqueda</p>
      <router-link
        v-if="isAuthenticated"
        to="/post-product"
        class="btn-primary"
      >
        <Plus class="w-4 h-4" />
        Publicar el Primer Producto
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Search, Package, Plus } from 'lucide-vue-next'
import ProductCard from '../components/ProductCard.vue'
import { useAuth } from '../composables/useAuth'
import { useProducts } from '../composables/useProducts'

const route = useRoute()
const { isAuthenticated } = useAuth()
const { 
  getProducts, 
  filteredProducts, 
  loading, 
  categories, 
  searchQuery, 
  selectedCategory,
  searchProducts, 
  filterByCategory, 
  setSortBy 
} = useProducts()

const searchInput = ref('')
const selectedCategoryLocal = ref('')
const sortByLocal = ref('created_at')
const priceRange = ref('')

const handleSearch = () => {
  searchProducts(searchInput.value)
}

const handleCategoryChange = () => {
  filterByCategory(selectedCategoryLocal.value)
}

const handleSortChange = () => {
  setSortBy(sortByLocal.value)
}

const handlePriceFilter = () => {
  // This would be implemented with more sophisticated filtering
  // For now, we'll keep it simple
}

// Initialize from route params
onMounted(async () => {
  await getProducts()
  
  // Check for search or category from route query
  if (route.query.search) {
    searchInput.value = route.query.search as string
    searchProducts(searchInput.value)
  }
  
  if (route.query.category) {
    selectedCategoryLocal.value = route.query.category as string
    filterByCategory(selectedCategoryLocal.value)
  }
})

// Watch for route changes
watch(() => route.query, (newQuery) => {
  if (newQuery.search) {
    searchInput.value = newQuery.search as string
    searchProducts(searchInput.value)
  }
  
  if (newQuery.category) {
    selectedCategoryLocal.value = newQuery.category as string
    filterByCategory(selectedCategoryLocal.value)
  }
}, { immediate: true })
</script>