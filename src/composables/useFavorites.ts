import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { useToast } from 'vue-toastification'

const favorites = ref<any[]>([])
const loading = ref(false)

export const useFavorites = () => {
  const { user } = useAuth()
  const toast = useToast()

  const userFavorites = computed(() => favorites.value)

  const loadFavorites = async () => {
    if (!user.value) return

    loading.value = true
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          products:product_id (*),
          properties:property_id (*),
          services:service_id (*)
        `)
        .eq('user_id', user.value.id)

      if (error) throw error

      favorites.value = data || []
    } catch (error: any) {
      toast.error(error.message || 'Error al cargar favoritos')
    } finally {
      loading.value = false
    }
  }

  const addToFavorites = async (type: 'product' | 'property' | 'service', id: string) => {
    if (!user.value) {
      toast.error('Debes iniciar sesión para agregar favoritos')
      return false
    }

    try {
      const favoriteData: any = {
        user_id: user.value.id
      }

      if (type === 'product') favoriteData.product_id = id
      else if (type === 'property') favoriteData.property_id = id
      else if (type === 'service') favoriteData.service_id = id

      const { error } = await supabase
        .from('favorites')
        .insert(favoriteData)

      if (error) throw error

      toast.success('Agregado a favoritos')
      await loadFavorites()
      return true
    } catch (error: any) {
      toast.error(error.message || 'Error al agregar a favoritos')
      return false
    }
  }

  const removeFromFavorites = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId)

      if (error) throw error

      toast.success('Eliminado de favoritos')
      await loadFavorites()
      return true
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar de favoritos')
      return false
    }
  }

  const isFavorite = (type: 'product' | 'property' | 'service', id: string) => {
    return favorites.value.some(fav => {
      if (type === 'product') return fav.product_id === id
      if (type === 'property') return fav.property_id === id
      if (type === 'service') return fav.service_id === id
      return false
    })
  }

  return {
    favorites: userFavorites,
    loading: computed(() => loading.value),
    loadFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  }
}