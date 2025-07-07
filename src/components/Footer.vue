<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <!-- Logo and Description -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <img src="/Logo.webp" alt="Kroma Logo" class="h-8 w-auto transition-transform duration-300 hover:scale-105 rounded-lg">
            <span class="text-xl font-bold">Kroma Store</span>
          </div>
          <p class="text-gray-300">
            La plataforma número uno en Colombia para la compra y venta de productos, 
            propiedades y servicios. Conectamos de forma segura y eficiente a compradores 
            y vendedores en todo el país. ¡Publica hoy y haz que te encuentren miles de personas listas para comprar!
          </p>
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
          </ul>
        </div>
      </div>
      
      <!-- Copyright -->
      <div class="border-t border-gray-800 pt-6">
        <p class="text-center text-gray-400 text-sm">
          &copy; 2025 Kroma. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Removed ShoppingBag import since we're now using the actual logo
</script>