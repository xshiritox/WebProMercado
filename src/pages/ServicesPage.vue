<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Servicios Profesionales</h1>
      <p class="text-gray-600">Encuentra profesionales y servicios especializados en tu área</p>
    </div>

    <!-- Service Categories -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="category in serviceCategories"
        :key="category.name"
        class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
        @click="filterByCategory(category.name)"
      >
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <component :is="category.icon" class="w-6 h-6 text-primary-600" />
        </div>
        <h3 class="font-semibold text-gray-900 mb-2">{{ category.name }}</h3>
        <p class="text-sm text-gray-600">{{ category.count }}+ profesionales</p>
      </div>
    </div>

    <!-- Featured Services -->
    <div class="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-8 mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Servicios Destacados</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="service in featuredServices"
          :key="service.id"
          class="bg-white rounded-lg shadow-md p-6 card-hover"
        >
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
              <User class="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ service.professional_name }}</h3>
              <p class="text-sm text-gray-600">{{ service.category }}</p>
            </div>
          </div>
          
          <h4 class="font-medium text-gray-900 mb-2">{{ service.title }}</h4>
          <p class="text-gray-600 text-sm mb-4">{{ service.description }}</p>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1">
              <Star class="w-4 h-4 text-yellow-500" />
              <span class="text-sm font-medium">{{ service.rating }}</span>
              <span class="text-sm text-gray-600">({{ service.reviews }} reseñas)</span>
            </div>
            <span class="text-lg font-bold text-primary-600">
              Desde ${{ formatPrice(service.price) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- How It Works -->
    <div class="bg-white rounded-lg shadow-md p-8 mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">¿Cómo Funciona?</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search class="w-8 h-8 text-primary-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">1. Busca</h3>
          <p class="text-gray-600">
            Explora nuestra amplia gama de profesionales y servicios especializados
          </p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle class="w-8 h-8 text-secondary-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">2. Contacta</h3>
          <p class="text-gray-600">
            Comunícate directamente con los profesionales para discutir tu proyecto
          </p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle class="w-8 h-8 text-accent-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">3. Contrata</h3>
          <p class="text-gray-600">
            Elige al profesional ideal y disfruta de un servicio de calidad
          </p>
        </div>
      </div>
    </div>

    <!-- Professional Registration CTA -->
    <div class="bg-gradient-to-r from-primary-600 to-secondary-500 rounded-lg p-8 text-white text-center">
      <h2 class="text-2xl font-bold mb-4">¿Eres un Profesional?</h2>
      <p class="text-lg mb-6 text-primary-100">
        Únete a nuestra plataforma y conecta con miles de clientes potenciales
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link
          v-if="!isAuthenticated"
          to="/register"
          class="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-all duration-200 flex items-center gap-2 justify-center"
        >
          <UserPlus class="w-5 h-5" />
          Registrarse como Profesional
        </router-link>
        <router-link
          v-else
          to="/post-service"
          class="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-all duration-200 flex items-center gap-2 justify-center"
        >
          <Plus class="w-5 h-5" />
          Publicar Servicio
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  Search, MessageCircle, CheckCircle, User, Star, UserPlus, Plus,
  Wrench, Palette, Camera, Car, Home, Briefcase, Heart, GraduationCap
} from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'

const { isAuthenticated } = useAuth()

const serviceCategories = [
  { name: 'Reparaciones', icon: Wrench, count: 150 },
  { name: 'Diseño', icon: Palette, count: 80 },
  { name: 'Fotografía', icon: Camera, count: 45 },
  { name: 'Automotriz', icon: Car, count: 120 },
  { name: 'Hogar', icon: Home, count: 200 },
  { name: 'Negocios', icon: Briefcase, count: 90 },
  { name: 'Salud', icon: Heart, count: 65 },
  { name: 'Educación', icon: GraduationCap, count: 55 }
]

const featuredServices = ref([
  {
    id: 1,
    professional_name: 'Carlos Mendoza',
    category: 'Reparaciones',
    title: 'Servicio de Plomería Residencial',
    description: 'Reparación de tuberías, instalación de grifos y mantenimiento general.',
    rating: 4.9,
    reviews: 127,
    price: 80000
  },
  {
    id: 2,
    professional_name: 'María González',
    category: 'Diseño',
    title: 'Diseño Gráfico y Branding',
    description: 'Creación de logos, identidad corporativa y material publicitario.',
    rating: 4.8,
    reviews: 89,
    price: 150000
  },
  {
    id: 3,
    professional_name: 'Juan Pérez',
    category: 'Fotografía',
    title: 'Fotografía de Eventos',
    description: 'Cobertura fotográfica para bodas, cumpleaños y eventos corporativos.',
    rating: 4.9,
    reviews: 156,
    price: 300000
  }
])

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CO').format(price)
}

const filterByCategory = (category: string) => {
  // TODO: Implement category filtering
  console.log('Filter by category:', category)
}
</script>