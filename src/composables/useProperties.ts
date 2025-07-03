import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useToast } from 'vue-toastification'

const properties = ref<any[]>([])
const loading = ref(false)
const searchQuery = ref('')
// Removed unused selectedCategory
const sortBy = ref('created_at')
const filters = ref({
  transaction_type: '',
  property_type: '',
  min_price: null as number | null,
  max_price: null as number | null,
  bedrooms: null as number | null,
  bathrooms: null as number | null,
  location: ''
})

export const useProperties = () => {
  const toast = useToast()
  const router = useRouter()

  const propertyTypes = [
    'Casa',
    'Apartamento',
    'Local Comercial',
    'Oficina',
    'Terreno',
    'Cabaña',
    'Otro'
  ]

  const transactionTypes = [
    { value: 'venta', label: 'Venta' },
    { value: 'alquiler', label: 'Alquiler' }
  ]

  const filteredProperties = computed(() => {
    let filtered = [...properties.value]

    // Aplicar búsqueda
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query)
      )
    }

    // Aplicar filtros
    if (filters.value.transaction_type) {
      filtered = filtered.filter(property => 
        property.transaction_type === filters.value.transaction_type
      )
    }

    if (filters.value.property_type) {
      filtered = filtered.filter(property => 
        property.property_type === filters.value.property_type
      )
    }

    if (filters.value.min_price) {
      filtered = filtered.filter(property => 
        property.price >= (filters.value.min_price as number)
      )
    }

    if (filters.value.max_price) {
      filtered = filtered.filter(property => 
        property.price <= (filters.value.max_price as number)
      )
    }

    if (filters.value.bedrooms) {
      filtered = filtered.filter(property => 
        property.bedrooms >= (filters.value.bedrooms as number)
      )
    }

    if (filters.value.bathrooms) {
      filtered = filtered.filter(property => 
        property.bathrooms >= (filters.value.bathrooms as number)
      )
    }

    if (filters.value.location) {
      filtered = filtered.filter(property =>
        property.location.toLowerCase().includes(filters.value.location.toLowerCase())
      )
    }

    // Ordenar
    filtered.sort((a, b) => {
      if (sortBy.value === 'price_asc') return a.price - b.price
      if (sortBy.value === 'price_desc') return b.price - a.price
      if (sortBy.value === 'created_at') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      return 0
    })

    return filtered
  })

  const getProperties = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url,
            badge,
            phone
          )
        `)
        .eq('status', 'active')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error

      properties.value = data || []
      return data
    } catch (error: any) {
      toast.error(error.message || 'Error al cargar las propiedades')
      return []
    } finally {
      loading.value = false
    }
  }

  const getProperty = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url,
            badge,
            phone,
            email
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error: any) {
      toast.error(error.message || 'Error al cargar la propiedad')
      return null
    }
  }

  const createProperty = async (propertyData: any) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert(propertyData)
        .select()
        .single()

      if (error) throw error

      toast.success('¡Propiedad publicada exitosamente!')
      await getProperties()
      return data
    } catch (error: any) {
      toast.error(error.message || 'Error al publicar la propiedad')
      return null
    } finally {
      loading.value = false
    }
  }

  const updateProperty = async (id: string, updates: any) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('properties')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      toast.success('Propiedad actualizada exitosamente')
      await getProperties()
      return data
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar la propiedad')
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteProperty = async (id: string) => {
    loading.value = true
    try {
      // Primero, obtener la propiedad para acceder a sus imágenes
      const { data: property, error: fetchError } = await supabase
        .from('properties')
        .select('images')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      // Eliminar la propiedad de la base de datos
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Eliminar imágenes asociadas si existen
      if (property?.images?.length > 0) {
        try {
          const imageUrls = property.images as string[]
          const pathsToDelete = imageUrls.map(url => {
            try {
              if (url.startsWith('http')) {
                const urlObj = new URL(url)
                const pathParts = urlObj.pathname.split('/')
                const bucketIndex = pathParts.indexOf('property-images')
                if (bucketIndex !== -1) {
                  return pathParts.slice(bucketIndex + 1).join('/')
                }
                const match = urlObj.pathname.match(/property-images\/(.+)$/)
                return match ? match[1] : ''
              } else {
                return url.replace(/^property-images\//, '')
              }
            } catch (e) {
              console.error('Error procesando la URL de la imagen:', url, e)
              return ''
            }
          }).filter(Boolean)

          if (pathsToDelete.length > 0) {
            const { error: storageError } = await supabase.storage
              .from('property-images')
              .remove(pathsToDelete)

            if (storageError) {
              console.error('Error eliminando imágenes del almacenamiento:', storageError)
            }
          }
        } catch (e) {
          console.error('Error durante la eliminación de imágenes:', e)
        }
      }

      toast.success('Propiedad y sus imágenes eliminadas exitosamente')
      await getProperties()
      return true
    } catch (error: any) {
      console.error('Error eliminando propiedad:', error)
      toast.error(error.message || 'Error al eliminar la propiedad')
      return false
    } finally {
      loading.value = false
    }
  }

  const searchProperties = (query: string) => {
    searchQuery.value = query
  }

  const setFilters = (newFilters: any) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const resetFilters = () => {
    filters.value = {
      transaction_type: '',
      property_type: '',
      min_price: null,
      max_price: null,
      bedrooms: null,
      bathrooms: null,
      location: ''
    }
  }

  const setSortBy = (sort: string) => {
    sortBy.value = sort
  }

  const viewProperty = (propertyId: string | number) => {
    router.push(`/property/${propertyId}`)
  }

  return {
    properties: computed(() => properties.value),
    filteredProperties,
    loading: computed(() => loading.value),
    propertyTypes,
    transactionTypes,
    filters: computed(() => filters.value),
    searchQuery: computed(() => searchQuery.value),
    sortBy: computed(() => sortBy.value),
    getProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    searchProperties,
    setFilters,
    resetFilters,
    setSortBy,
    viewProperty
  }
}