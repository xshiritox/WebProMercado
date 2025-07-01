<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo and Description -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center">
              <ShoppingBag class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold">PubliNet</span>
          </div>
          <p class="text-gray-300 mb-4">
            La plataforma líder para comprar y vender productos, propiedades y servicios. 
            Conectamos a compradores y vendedores.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <Facebook class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <Twitter class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <Instagram class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <Linkedin class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/products" class="text-gray-300 hover:text-white transition-colors">
                Productos
              </router-link>
            </li>
            <li>
              <router-link to="/properties" class="text-gray-300 hover:text-white transition-colors">
                Propiedades
              </router-link>
            </li>
            <li>
              <router-link to="/services" class="text-gray-300 hover:text-white transition-colors">
                Servicios
              </router-link>
            </li>
            <li>
              <router-link to="/post-product" class="text-gray-300 hover:text-white transition-colors">
                Publicar Producto
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Soporte</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-300 hover:text-white transition-colors">
                Centro de Ayuda
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-300 hover:text-white transition-colors">
                Términos de Uso
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-300 hover:text-white transition-colors">
                Política de Privacidad
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-300 hover:text-white transition-colors">
                Contacto
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 mt-8 pt-8 text-center">
        <p class="text-gray-400">
          © {{ currentYear }} PubliNet. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ShoppingBag, Facebook, Twitter, Instagram, Linkedin } from 'lucide-vue-next'

const currentYear = computed(() => new Date().getFullYear())
</script>