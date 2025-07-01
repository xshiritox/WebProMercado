import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import { useToast } from 'vue-toastification'

const user = ref<User | null>(null)
const profile = ref<any>(null)
const loading = ref(false)

export const useAuth = () => {
  const toast = useToast()

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => profile.value?.badge === 'admin')
  const isModerator = computed(() => profile.value?.badge === 'moderador' || profile.value?.badge === 'admin')

  const signUp = async (email: string, password: string, fullName: string) => {
    loading.value = true
    try {
      // Primero verificamos si el usuario ya existe
      const { data: existingUser } = await supabase.auth.admin.getUserById(email)
      
      if (existingUser) {
        toast.warning('Ya existe una cuenta con este correo electrónico. Por favor inicia sesión.')
        return { data: null, error: { message: 'El usuario ya existe' } }
      }

      // Si no existe, procedemos con el registro
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      if (error) throw error

      if (data.user) {
        // Verificamos si el perfil ya existe
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single()

        if (existingProfile) {
          toast.warning('Ya existe un perfil con este correo electrónico. Por favor inicia sesión.')
          return { data: null, error: { message: 'El perfil ya existe' } }
        }

        // Si no existe, creamos el perfil
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: fullName,
            badge: 'colaborador'
          })

        if (profileError) throw profileError

        toast.success('¡Cuenta creada exitosamente!')
        return { data, error: null }
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al crear la cuenta')
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email: string, password: string) => {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      toast.success('¡Bienvenido de vuelta!')
      return { data, error: null }
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión')
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      user.value = null
      profile.value = null
      toast.success('Sesión cerrada exitosamente')
    } catch (error: any) {
      toast.error(error.message || 'Error al cerrar sesión')
    } finally {
      loading.value = false
    }
  }

  const getProfile = async () => {
    if (!user.value) return null

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

      if (error) throw error

      profile.value = data
      return data
    } catch (error: any) {
      console.error('Error getting profile:', error.message)
      return null
    }
  }

  const updateProfile = async (updates: any) => {
    if (!user.value) return null

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.value.id)
        .select()
        .single()

      if (error) throw error

      profile.value = data
      toast.success('Perfil actualizado exitosamente')
      return data
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar el perfil')
      return null
    }
  }

  // Initialize auth state
  const initialize = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      user.value = session.user
      await getProfile()
    }

    supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        user.value = session.user
        await getProfile()
      } else {
        user.value = null
        profile.value = null
      }
    })
  }

  return {
    user: computed(() => user.value),
    profile: computed(() => profile.value),
    loading: computed(() => loading.value),
    isAuthenticated,
    isAdmin,
    isModerator,
    signUp,
    signIn,
    signOut,
    getProfile,
    updateProfile,
    initialize
  }
}