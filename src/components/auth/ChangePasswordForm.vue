<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Cambiar contraseña
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Crea una nueva contraseña segura para tu cuenta
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">
          <div class="relative">
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Nueva contraseña
            </label>
            <div class="relative">
              <input
                id="newPassword"
                v-model="form.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                required
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Mínimo 8 caracteres"
                :disabled="loading"
              >
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                @click="showNewPassword = !showNewPassword"
                :disabled="loading"
              >
                <Eye v-if="!showNewPassword" class="h-5 w-5 text-gray-500" />
                <EyeOff v-else class="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div class="relative">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
              Confirmar nueva contraseña
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Vuelve a escribir la contraseña"
                :disabled="loading"
              >
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                @click="showConfirmPassword = !showConfirmPassword"
                :disabled="loading"
              >
                <Eye v-if="!showConfirmPassword" class="h-5 w-5 text-gray-500" />
                <EyeOff v-else class="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <div v-if="errorMessage" class="p-4 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm animate-fade-in">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="font-medium">Error</p>
              <p class="mt-1">{{ errorMessage }}</p>
              <p v-if="errorMessage.includes('enlace de recuperación')" class="mt-2">
                <router-link to="/forgot-password" class="font-medium text-red-700 hover:text-red-600">
                  ¿Solicitar un nuevo enlace?
                </router-link>
              </p>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span v-else class="absolute left-0 inset-y-0 flex items-center pl-3">
              <Lock class="h-5 w-5 text-indigo-200 group-hover:text-indigo-100" />
            </span>
            {{ loading ? 'Actualizando contraseña...' : 'Cambiar contraseña' }}
          </button>
        </div>
      </form>
      
      <div class="text-center text-sm">
        <router-link 
          to="/login" 
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← Volver al inicio de sesión
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabase';
import { useToast } from 'vue-toastification';
import { Lock, Eye, EyeOff } from 'lucide-vue-next';

const router = useRouter();
const toast = useToast();

// Estado del formulario
const form = ref({
  newPassword: '',
  confirmPassword: ''
});

// Estado de la UI
const loading = ref(false);
const errorMessage = ref('');
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const isAuthenticated = ref(false);

// Función para extraer parámetros del hash de la URL
const getHashParams = () => {
  console.log('Hash actual:', window.location.hash);
  
  // Intentar primero con el hash completo
  let hash = window.location.hash.substring(1);
  
  // Si el hash contiene 'access_token=', extraer los parámetros manualmente
  if (hash.includes('access_token=')) {
    console.log('Procesando hash con parámetros de autenticación');
    const params: Record<string, string> = {};
    
    // Dividir los parámetros por '&'
    const paramPairs = hash.split('&');
    
    for (const pair of paramPairs) {
      // Manejar correctamente el primer parámetro que puede empezar con #
      const cleanPair = pair.startsWith('#') ? pair.substring(1) : pair;
      const [key, value] = cleanPair.split('=');
      
      if (key && value) {
        // Decodificar los valores codificados en URL
        params[key] = decodeURIComponent(value);
      }
    }
    
    console.log('Parámetros extraídos del hash:', params);
    return {
      access_token: params.access_token || '',
      refresh_token: params.refresh_token || '',
      type: params.type || 'recovery',
      expires_at: params.expires_at,
      expires_in: params.expires_in,
      token_type: params.token_type
    };
  }
  
  // Si no hay parámetros en el hash, verificar si hay parámetros de búsqueda
  if (window.location.search) {
    console.log('Usando parámetros de búsqueda');
    const params = new URLSearchParams(window.location.search);
    const result: Record<string, string> = {};
    
    // Extraer parámetros importantes
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const type = params.get('type');
    
    if (accessToken) result.access_token = accessToken;
    if (refreshToken) result.refresh_token = refreshToken;
    if (type) result.type = type;
    
    console.log('Parámetros extraídos de la búsqueda:', result);
    return result;
  }
  
  console.log('No se encontraron parámetros de autenticación');
  return {};
};

// Ejecutar la verificación al montar el componente
onMounted(async () => {
  try {
    loading.value = true;
    
    // Extraer parámetros de la URL
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const type = params.get('type');
    
    if (!accessToken || type !== 'recovery') {
      throw new Error('Enlace de recuperación inválido');
    }
    
    // Extraer el email del token JWT
    let email = '';
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      email = payload.email || '';
      console.log('Email extraído del token:', email);
    } catch (e) {
      console.error('Error al extraer el email del token:', e);
      throw new Error('Token inválido');
    }
    
    // Verificar el token OTP
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: accessToken,
      type: 'recovery'
    });
    
    if (error) throw error;
    
    // Si llegamos aquí, el token es válido
    isAuthenticated.value = true;
    console.log('Token de recuperación verificado correctamente');
    
    // Limpiar la URL para evitar problemas
    window.history.replaceState({}, document.title, window.location.pathname);
    
  } catch (error) {
    console.error('Error al verificar el enlace de recuperación:', error);
    errorMessage.value = 'El enlace de recuperación no es válido o ha expirado. Por favor, solicita un nuevo enlace.';
  } finally {
    loading.value = false;
  }
});

const isFormValid = computed(() => {
  return (
    form.value.newPassword.length >= 8 &&
    form.value.newPassword === form.value.confirmPassword
  );
});

const handleSubmit = async () => {
  if (!isFormValid.value) return;
  
  try {
    loading.value = true;
    errorMessage.value = '';
    
    console.log('=== INICIANDO PROCESO DE CAMBIO DE CONTRASEÑA ===');
    
    // Verificar autenticación antes de continuar
    if (!isAuthenticated.value) {
      throw new Error('No se pudo autenticar. Por favor, solicita un nuevo enlace de recuperación.');
    }
    
    // Obtener la sesión actual
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('Error al obtener la sesión:', sessionError);
      throw new Error('La sesión ha expirado. Por favor, solicita un nuevo enlace de recuperación.');
    }
    
    console.log('Usuario autenticado:', session.user?.email);
    
    // Si no hay sesión, verificar si hay tokens en el hash
    if (!session) {
      console.log('No hay sesión activa, verificando tokens en el hash...');
      const { access_token, refresh_token } = getHashParams();
      
      if (access_token && refresh_token) {
        console.log('=== INTENTANDO ESTABLECER SESIÓN CON TOKENS ===');
        console.log('Access token:', access_token ? '***presente***' : 'ausente');
        console.log('Refresh token:', refresh_token ? '***presente***' : 'ausente');
        
        try {
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token
          });
          
          console.log('Respuesta de setSession:', {
            session: sessionData?.session ? 'Sesión establecida' : 'No se pudo establecer la sesión',
            error: sessionError || 'Sin errores'
          });
          
          if (sessionError || !sessionData?.session) {
            console.error('Error al establecer la sesión con tokens:', sessionError);
            
            // Intentar con verifyOtp como último recurso
            console.log('Intentando con verifyOtp...');
            const { data: otpData, error: otpError } = await supabase.auth.verifyOtp({
              token_hash: access_token,
              type: 'recovery',
              email: '' // Deberíamos tener el email, pero si no, lo dejamos vacío
            });
            
            if (otpError || !otpData.session) {
              console.error('Error en verifyOtp:', otpError);
              throw new Error('El enlace de recuperación no es válido o ha expirado.');
            }
            
            console.log('Sesión establecida correctamente con verifyOtp');
          } else {
            console.log('Sesión establecida correctamente con setSession');
          }
        } catch (error) {
          console.error('Error en el proceso de autenticación:', error);
          throw new Error('No se pudo autenticar con el enlace proporcionado. Por favor, solicita uno nuevo.');
        }
      } else {
        throw new Error('No se encontró una sesión activa. Por favor, solicita un nuevo enlace de recuperación.');
      }
    }
    
    console.log('Actualizando contraseña...');
    
    try {
      // Asegurarse de que newPassword no esté vacío
      if (!form.value.newPassword.trim()) {
        throw new Error('La contraseña no puede estar vacía');
      }
      // Obtener la sesión actual antes de actualizar
      const { data: { session: currentSession }, error: checkError } = await supabase.auth.getSession();
      
      console.log('Verificando sesión antes de actualizar:', { 
        currentSession: currentSession ? 'Sesión válida' : 'No hay sesión',
        checkError: checkError || 'Sin errores'
      });
      
      if (checkError || !currentSession) {
        console.error('Error de sesión o sesión no encontrada:', checkError);
        throw new Error('La sesión ha expirado. Por favor, solicita un nuevo enlace de recuperación.');
      }
      
      console.log('Sesión activa, intentando actualizar contraseña...');
      
      try {
        // Actualizar la contraseña usando el método de actualización directa
        console.log('Enviando solicitud de actualización de contraseña...');
        
        // Primero, asegurémonos de que el usuario esté autenticado
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('Error al obtener el usuario autenticado:', userError);
          throw new Error('No se pudo verificar tu identidad. Por favor, intenta de nuevo.');
        }
        
        console.log('Usuario autenticado:', user.email);
        
        console.log('Enviando solicitud de actualización de contraseña...');
        
        // Actualizar la contraseña usando el token de recuperación
        const { data: updateData, error: updateError } = await supabase.auth.updateUser({
          password: form.value.newPassword
        });
        
        console.log('Respuesta de actualización de contraseña:', { 
          user: updateData?.user ? 'Usuario actualizado' : 'No se actualizó el usuario',
          error: updateError || 'Sin errores'
        });
        
        console.log('Respuesta de updateUser:', { 
          user: updateData.user ? 'Usuario actualizado' : 'No se actualizó el usuario',
          error: updateError || 'Sin errores'
        });
        
        if (updateError) {
          console.error('Error al actualizar la contraseña:', updateError);
          
          // Manejar errores específicos
          if (updateError.message.toLowerCase().includes('password')) {
            throw new Error('La contraseña no cumple con los requisitos mínimos. Debe tener al menos 6 caracteres.');
          } else if (updateError.message.toLowerCase().includes('session') || 
                    updateError.message.toLowerCase().includes('token') ||
                    updateError.message.toLowerCase().includes('jwt')) {
            throw new Error('La sesión ha expirado. Por favor, solicita un nuevo enlace de recuperación.');
          } else if (updateError.message.toLowerCase().includes('network')) {
            throw new Error('Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo.');
          }
          
          throw updateError;
        }
        
        console.log('Contraseña actualizada exitosamente:', updateData);
      } catch (updateError) {
        console.error('Error en el proceso de actualización de contraseña:', updateError);
        throw updateError; // Re-lanzar para manejo de errores general
      }
    } catch (error) {
      console.error('Error en el proceso de actualización de contraseña:', error);
      throw error; // Re-lanzar para que sea manejado por el bloque catch externo
    }
    
    try {
      console.log('Contraseña actualizada correctamente. Cerrando sesión...');
      
      // Cerrar sesión después de cambiar la contraseña
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        console.error('Error al cerrar sesión:', signOutError);
        // No lanzamos error aquí, ya que el cambio de contraseña fue exitoso
      }
      
      console.log('Redirigiendo a la página de inicio de sesión...');
      // Mostrar mensaje de éxito
      toast.success('¡Contraseña actualizada correctamente! Por favor inicia sesión con tu nueva contraseña.');
      
      // Redirigir a la página de inicio de sesión con un mensaje de éxito
      router.push({ 
        path: '/login',
        query: { password_changed: 'true' } 
      });
    } catch (error) {
      console.error('Error en el proceso de cierre de sesión o redirección:', error);
      // Aunque hubo un error en el cierre de sesión, la contraseña ya fue cambiada
      toast.success('¡Contraseña actualizada correctamente! Sin embargo, hubo un problema al cerrar la sesión.');
      router.push('/login');
    }
    
  } catch (error: any) {
    console.error('Error en handleSubmit:', error);
    errorMessage.value = error.message || 'Ocurrió un error al cambiar la contraseña. Por favor, inténtalo de nuevo.';
    
    // Mostrar error más específico en la consola para depuración
    if (error.status) {
      console.error('Código de estado del error:', error.status);
    }
    if (error.status === 400) {
      errorMessage.value = 'La solicitud no es válida. Por favor, verifica los datos e inténtalo de nuevo.';
    } else if (error.status === 401) {
      errorMessage.value = 'La sesión ha expirado. Por favor, solicita un nuevo enlace de recuperación.';
    } else if (error.status === 500) {
      errorMessage.value = 'Error del servidor. Por favor, inténtalo de nuevo más tarde.';
    }
    
    // Asegurarse de que siempre se desactive el estado de carga
    loading.value = false;
    
    // Forzar actualización de la UI
    await new Promise(resolve => setTimeout(resolve, 0));
  } finally {
    // Garantizar que el estado de carga se desactive incluso si hay errores no capturados
    loading.value = false;
  }
};
</script>

<style scoped>
/* Estilos específicos del componente */
</style>
