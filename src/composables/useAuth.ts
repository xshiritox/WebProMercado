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
  const isVip = computed(() => profile.value?.badge === 'vip')
  const isColaborador = computed(() => profile.value?.badge === 'colaborador')
  const isDestacado = computed(() => profile.value?.badge === 'destacado')
  const hasNoBadge = computed(() => !profile.value?.badge)

  const signUp = async (email: string, password: string, fullName: string) => {
    loading.value = true
    try {
      // Validar los datos de entrada
      if (!email || !password || !fullName) {
        throw new Error('Por favor completa todos los campos')
      }

      const trimmedEmail = email.trim()
      const trimmedPassword = password.trim()
      const trimmedFullName = fullName.trim()

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(trimmedEmail)) {
        throw new Error('Por favor ingresa un correo electrónico válido')
      }

      // Validar longitud de la contraseña
      if (trimmedPassword.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres')
      }

      // Registrar el usuario en Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: trimmedPassword,
        options: {
          data: {
            full_name: trimmedFullName
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (signUpError) {
        // Si el usuario ya está registrado, mostrar mensaje apropiado
        if (signUpError.message?.includes('already registered')) {
          throw new Error('El correo electrónico ya está en uso. Por favor, inicia sesión o utiliza otro correo.')
        }
        throw signUpError
      }

      // Si el registro fue exitoso
      if (data.user) {
        toast.success('¡Cuenta creada exitosamente! Por favor verifica tu correo electrónico.')
        return { data, error: null }
      }
    } catch (error: any) {
      console.error('Error en signUp:', error)
      const errorMessage = error.message || 'Error al crear la cuenta. Por favor inténtalo de nuevo.'
      toast.error(errorMessage)
      return { data: null, error: new Error(errorMessage) }
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email: string, password: string) => {
    loading.value = true
    try {
      // Validación básica
      if (!email || !password) {
        throw new Error('Por favor ingresa tu correo y contraseña')
      }

      const trimmedEmail = email.trim()
      const trimmedPassword = password.trim()

      // Intentamos iniciar sesión directamente
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword
      })

      if (error) {
        // Para errores de credenciales inválidas, mostramos un mensaje genérico
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Correo o contraseña incorrectos')
        }
        
        // Para otros errores, mostramos el mensaje original
        throw error
      }

      // Si el inicio de sesión fue exitoso, actualizamos el perfil
      await getProfile()
      toast.success('¡Bienvenido de vuelta!')
      return { data, error: null }
      
    } catch (error: any) {
      console.error('Error en signIn:', error)
      const errorMessage = error.message || 'Error al iniciar sesión. Por favor inténtalo de nuevo.'
      toast.error(errorMessage)
      return { data: null, error: new Error(errorMessage) }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    try {
      // Limpiar manualmente los datos de autenticación
      user.value = null
      profile.value = null
      
      // Forzar limpieza de la sesión
      await supabase.auth.signOut()
      
      // Limpiar cualquier dato de sesión persistente
      if (typeof window !== 'undefined') {
        // Limpiar localStorage y sessionStorage
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key)
          }
        })
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            sessionStorage.removeItem(key)
          }
        })
        
        // Forzar recarga en dispositivos móviles para limpiar el estado
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          window.location.href = '/'
          return
        }
      }
      
      toast.success('Sesión cerrada exitosamente')
    } catch (error: any) {
      console.error('Error en signOut:', error)
      // Si hay un error, forzar la limpieza de todos modos
      user.value = null
      profile.value = null
      if (typeof window !== 'undefined') {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key)
          }
        })
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            sessionStorage.removeItem(key)
          }
        })
        window.location.href = '/'
      }
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
    try {
      // Primero limpiamos cualquier token corrupto
      if (typeof window !== 'undefined') {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            try {
              const value = localStorage.getItem(key)
              if (value && value.includes('refresh_token')) {
                // Verificar si el token parece válido
                const parsed = JSON.parse(value)
                if (!parsed.refresh_token || parsed.refresh_token === 'null') {
                  localStorage.removeItem(key)
                }
              }
            } catch (e) {
              // Si no se puede parsear, eliminar
              localStorage.removeItem(key)
            }
          }
        })
      }

      // Intentamos obtener la sesión actual
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      // Si hay un error en la sesión, forzamos un cierre de sesión
      if (sessionError) {
        console.error('Error al obtener la sesión:', sessionError)
        await handleInvalidSession()
        return
      }

      // Si hay una sesión válida, actualizamos el estado
      if (session?.user) {
        user.value = session.user
        await getProfile()
      }

      // Configuramos el listener de cambios de autenticación
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event)
        
        if (!session) {
          // Si no hay sesión, limpiamos el estado
          user.value = null
          profile.value = null
          if (typeof window !== 'undefined') {
            Object.keys(localStorage).forEach(key => {
              if (key.startsWith('sb-') || key.includes('supabase')) {
                localStorage.removeItem(key)
              }
            })
            Object.keys(sessionStorage).forEach(key => {
              if (key.startsWith('sb-') || key.includes('supabase')) {
                sessionStorage.removeItem(key)
              }
            })
          }
        } else if (session?.user) {
          user.value = session.user
          await getProfile()
        }
      })

      // Retornamos la función para desuscribirnos cuando sea necesario
      return () => {
        subscription?.unsubscribe()
      }
    } catch (error) {
      console.error('Error en initialize auth:', error)
      await handleInvalidSession()
    }
  }

  // Función para manejar sesión inválida
  const handleInvalidSession = async () => {
    console.log('Manejando sesión inválida...')
    
    // PRIMERO: Limpiamos el estado local inmediatamente
    user.value = null
    profile.value = null
    
    // SEGUNDO: Limpiamos el almacenamiento local inmediatamente
    if (typeof window !== 'undefined') {
      // Limpiamos todas las claves relacionadas con Supabase
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase')) {
          localStorage.removeItem(key)
        }
      })
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase')) {
          sessionStorage.removeItem(key)
        }
      })
    }
    
    // TERCERO: Intentamos cerrar sesión en Supabase (sin bloquear si falla)
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.warn('Error al cerrar sesión en Supabase (ignorado):', error)
      // Ignoramos el error ya que el estado local ya está limpio
    }
    
    // CUARTO: Redirigir a la página de inicio de sesión si no estamos ya ahí
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.href = '/login?session_expired=true'
    }
  }

  // Interceptar errores de autenticación
  const withAuthErrorHandling = async (fn: Function, ...args: any[]) => {
    try {
      return await fn(...args)
    } catch (error: any) {
      console.error('Auth error:', error)
      
      // Manejar específicamente el error de token inválido
      if (error.message?.includes('Invalid Refresh Token') || 
          error.message?.includes('Auth session missing') ||
          error.message?.includes('refresh_token_not_found') ||
          error.status === 401) {
        await handleInvalidSession()
      }
      
      throw error
    }
  }

  return {
    user: computed(() => user.value),
    profile: computed(() => profile.value),
    loading: computed(() => loading.value),
    isAuthenticated,
    isAdmin,
    isModerator,
    isVip,
    isColaborador,
    isDestacado,
    hasNoBadge,
    signUp: async (email: string, password: string, fullName: string) => {
      return withAuthErrorHandling(() => signUp(email, password, fullName))
    },
    signIn: async (email: string, password: string) => {
      return withAuthErrorHandling(() => signIn(email, password))
    },
    signOut: async () => {
      return withAuthErrorHandling(signOut)
    },
    getProfile: async () => {
      return withAuthErrorHandling(getProfile)
    },
    updateProfile: async (updates: any) => {
      return withAuthErrorHandling(() => updateProfile(updates))
    },
    initialize,
    handleInvalidSession
  }
}