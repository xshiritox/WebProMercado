<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">
              {{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}
              <span v-if="isEditing && formData.badge === 'admin'" class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <Shield class="w-3 h-3 mr-1" />
                Administrador
              </span>
            </h2>
            <p v-if="isEditing" class="text-sm text-gray-500 mt-1">
              Editando usuario: {{ formData.email }}
            </p>
          </div>
          <button 
            @click="$emit('close')" 
            class="text-gray-500 hover:text-gray-700"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700">Nombre Completo</label>
            <input
              id="fullName"
              v-model="formData.full_name"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
            >
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              required
              :disabled="isEditing"
            >
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              {{ isEditing ? 'Contraseña (solo lectura)' : 'Contraseña' }}
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              :readonly="isEditing"
              :class="[
                'mt-1 block w-full rounded-md shadow-sm focus:ring-primary-500',
                isEditing 
                  ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed' 
                  : 'border-gray-300 focus:border-primary-500'
              ]"
              :required="!isEditing"
              :placeholder="isEditing ? '••••••••' : ''"
            >
            <p v-if="isEditing" class="mt-1 text-xs text-gray-500">
              La contraseña no se puede ver por seguridad. Usa el panel de autenticación para restablecerla si es necesario.
            </p>
          </div>

          <div>
            <label for="badge" class="block text-sm font-medium text-gray-700">Rol</label>
            <select
              id="badge"
              v-model="formData.badge"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Nuevo</option>
              <option value="admin">Administrador</option>
              <option value="moderador">Moderador</option>
              <option value="colaborador">Colaborador</option>
              <option value="vip">VIP</option>
              <option value="destacado">Destacado</option>
            </select>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </span>
              <span v-else>{{ isEditing ? 'Actualizar' : 'Crear' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { X, Shield } from 'lucide-vue-next';
import { supabase } from '../../lib/supabase';
import { useToast } from 'vue-toastification';

const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['saved', 'close']);
const toast = useToast();

const loading = ref(false);
const formData = ref({
  id: '',
  email: '',
  full_name: '',
  password: '',
  badge: ''
});

// Inicializar formulario con datos del usuario si está en modo edición
onMounted(() => {
  if (props.user) {
    formData.value = {
      id: props.user.id || '',
      email: props.user.email || '',
      full_name: props.user.full_name || '',
      password: '',
      badge: props.user.badge || ''
    };
  }
});

const handleSubmit = async () => {
  try {
    loading.value = true;
    
    if (props.isEditing) {
      // Actualizar usuario existente
      const updateData: any = {
        full_name: formData.value.full_name,
        updated_at: new Date().toISOString()
      };

      // Solo incluir el badge si tiene un valor
      if (formData.value.badge) {
        updateData.badge = formData.value.badge;
      } else {
        // Si no hay badge, establecerlo como null
        updateData.badge = null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', formData.value.id)
        .select();

      if (error) throw error;
      
      toast.success('Usuario actualizado correctamente');
    } else {
      // Crear nuevo usuario con autenticación
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.value.email,
        password: formData.value.password,
        email_confirm: true, // Marcar el email como verificado
        user_metadata: {
          full_name: formData.value.full_name,
          badge: formData.value.badge
        }
      });

      if (authError) throw authError;
      
      // Crear perfil del usuario
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email: formData.value.email,
            full_name: formData.value.full_name,
            badge: formData.value.badge
          }
        ]);

      if (profileError) throw profileError;
      
      toast.success('Usuario creado correctamente');
    }
    
    emit('saved');
    emit('close');
  } catch (error) {
    console.error('Error al guardar el usuario:', error);
    toast.error(error.message || 'Error al guardar el usuario');
  } finally {
    loading.value = false;
  }
};
</script>
