import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { useToast } from 'vue-toastification'

const isConnected = ref(false)
const connectionError = ref<string | null>(null)

export const useSupabase = () => {
  const toast = useToast()

  const checkConnection = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)

      if (error) {
        connectionError.value = error.message
        isConnected.value = false
        toast.error('Error de conexión con Supabase')
      } else {
        isConnected.value = true
        connectionError.value = null
      }
    } catch (error: any) {
      connectionError.value = error.message
      isConnected.value = false
      toast.error('No se pudo conectar con la base de datos')
    }
  }

  const initializeDatabase = async () => {
    try {
      // Check if tables exist by trying to query them
      await checkConnection()
      
      if (isConnected.value) {
        toast.success('Conexión con Supabase establecida')
      }
    } catch (error: any) {
      console.error('Database initialization error:', error)
      toast.error('Error al inicializar la base de datos')
    }
  }

  return {
    isConnected: computed(() => isConnected.value),
    connectionError: computed(() => connectionError.value),
    checkConnection,
    initializeDatabase
  }
}