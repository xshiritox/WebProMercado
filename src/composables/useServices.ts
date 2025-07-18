import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useToast } from 'vue-toastification'

const services = ref<any[]>([])
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('created_at')
const serviceCounts = ref<Record<string, number>>({})

export const useServices = () => {
  const toast = useToast()
  const router = useRouter()

  const serviceCategories = [
    'Reparaciones y Mantenimiento',
    'Limpieza y Aseo',
    'Construcción y Reformas',
    'Jardinería y Paisajismo',
    'Electricidad y Plomería',
    'Pintura y Decoración',
    'Tecnología e Informática',
    'Diseño Gráfico',
    'Fotografía y Video',
    'Educación y Tutorías',
    'Salud y Bienestar',
    'Belleza y Estética',
    'Transporte y Mudanzas',
    'Eventos y Catering',
    'Consultoría y Negocios',
    'Traducción e Idiomas',
    'Música y Arte',
    'Deportes y Fitness',
    'Mascotas y Veterinaria',
    'Otros Servicios'
  ]

  const priceTypes = [
    { value: 'fixed', label: 'Precio fijo' },
    { value: 'hourly', label: 'Por hora' },
    { value: 'quote', label: 'A convenir' }
  ]

  const priceRange = ref('')

  const filteredServices = computed(() => {
    let filtered = [...services.value]

    // Aplicar búsqueda
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(service =>
        service.title?.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query) ||
        service.location?.toLowerCase().includes(query)
      )
    }

    // Aplicar filtro de categoría
    if (selectedCategory.value) {
      filtered = filtered.filter(service => 
        service.category === selectedCategory.value
      )
    }

    // Aplicar filtro de rango de precios
    if (priceRange.value) {
      const [min, max] = priceRange.value.split('-').map(Number)
      filtered = filtered.filter(service => {
        const price = service.price_from || 0
        return price >= min && (!max || price <= max)
      })
    }

    // Ordenar
    filtered.sort((a, b) => {
      if (sortBy.value === 'price_asc') return (a.price_from || 0) - (b.price_from || 0)
      if (sortBy.value === 'price_desc') return (b.price_from || 0) - (a.price_from || 0)
      if (sortBy.value === 'rating') return (b.rating || 0) - (a.rating || 0)
      if (sortBy.value === 'created_at') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      return 0
    })

    return filtered
  })

  const searchServices = (query: string) => {
    searchQuery.value = query
    return filteredServices.value
  }

  const filterByCategory = (category: string) => {
    selectedCategory.value = category
    return filteredServices.value
  }

  const setSortBy = (sort: string) => {
    sortBy.value = sort
    return filteredServices.value
  }

  const setPriceRange = (range: string) => {
    priceRange.value = range
    return filteredServices.value
  }

  const getServices = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('status', 'active')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error

      // Si necesitas información del perfil, haz una consulta separada
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(service => service.user_id).filter(Boolean))]
        
        if (userIds.length > 0) {
          // Hacer la consulta en lotes más pequeños para evitar errores
          const BATCH_SIZE = 10
          const profilesMap: Record<string, any> = {}
          
          for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
            const batch = userIds.slice(i, i + BATCH_SIZE)
            const { data: profilesData, error: profilesError } = await supabase
              .from('profiles')
              .select('id, full_name, avatar_url, badge')
              .in('id', batch)
            
            if (profilesError) {
              console.error('Error fetching profiles batch:', profilesError)
              continue
            }
            
            if (profilesData) {
              profilesData.forEach(profile => {
                profilesMap[profile.id] = profile
              })
            }
          }
          
          // Combinar datos de servicios con perfiles
          data.forEach(service => {
            if (service.user_id && profilesMap[service.user_id]) {
              service.profile = profilesMap[service.user_id]
            } else {
              service.profile = {
                full_name: 'Usuario desconocido',
                avatar_url: null,
                role: 'user' // Valor por defecto
              }
            }
          })
        } else {
          // Si no hay IDs de usuario válidos, establecer perfiles vacíos
          data.forEach(service => {
            service.profile = {
              full_name: 'Usuario desconocido',
              avatar_url: null,
              rating: null
            }
          })
        }
      }

      services.value = data || []
      return data
    } catch (error: any) {
      console.error('Error loading services:', error)
      toast.error(error.message || 'Error al cargar los servicios')
      return []
    } finally {
      loading.value = false
    }
  }

  const getService = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url,
            badge,
            phone,
            email,
            rating,
            reviews_count
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error: any) {
      toast.error(error.message || 'Error al cargar el servicio')
      return null
    }
  }

  const createService = async (serviceData: any) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('services')
        .insert(serviceData)
        .select()
        .single()

      if (error) throw error

      toast.success('¡Servicio publicado exitosamente!')
      await getServices()
      return data
    } catch (error: any) {
      toast.error(error.message || 'Error al publicar el servicio')
      return null
    } finally {
      loading.value = false
    }
  }

  const updateService = async (id: string, updates: any) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('services')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      toast.success('Servicio actualizado exitosamente')
      await getServices()
      return data
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar el servicio')
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteService = async (id: string) => {
    loading.value = true
    try {
      // Primero, obtener el servicio para acceder a sus imágenes
      const { data: service, error: fetchError } = await supabase
        .from('services')
        .select('images')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      // Eliminar el servicio de la base de datos
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Eliminar imágenes asociadas si existen
      if (service?.images?.length > 0) {
        try {
          const imageUrls = service.images as string[]
          const pathsToDelete = imageUrls.map(url => {
            try {
              if (url.startsWith('http')) {
                const urlObj = new URL(url)
                const pathParts = urlObj.pathname.split('/')
                const bucketIndex = pathParts.indexOf('service-images')
                if (bucketIndex !== -1) {
                  return pathParts.slice(bucketIndex + 1).join('/')
                }
                const match = urlObj.pathname.match(/service-images\/(.+)$/)
                return match ? match[1] : ''
              } else {
                return url.replace(/^service-images\//, '')
              }
            } catch (e) {
              console.error('Error procesando la URL de la imagen:', url, e)
              return ''
            }
          }).filter(Boolean)

          if (pathsToDelete.length > 0) {
            const { error: storageError } = await supabase.storage
              .from('service-images')
              .remove(pathsToDelete)

            if (storageError) {
              console.error('Error eliminando imágenes del almacenamiento:', storageError)
            }
          }
        } catch (e) {
          console.error('Error durante la eliminación de imágenes:', e)
        }
      }

      toast.success('Servicio y sus imágenes eliminados exitosamente')
      await getServices()
      return true
    } catch (error: any) {
      console.error('Error eliminando servicio:', error)
      toast.error(error.message || 'Error al eliminar el servicio')
      return false
    } finally {
      loading.value = false
    }
  }

  const loadServiceCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('category, count')
        .eq('status', 'active')

      if (error) throw error

      // Inicializar contadores en 0 para todas las categorías
      const counts: Record<string, number> = {}
      serviceCategories.forEach(category => {
        counts[category] = 0
      })

      // Actualizar con los datos reales
      data?.forEach(item => {
        if (counts[item.category] !== undefined) {
          counts[item.category] = item.count
        } else {
          counts['Otros'] = (counts['Otros'] || 0) + item.count
        }
      })

      // Asegurar que cada categoría tenga al menos 5 servicios (para demostración)
      Object.keys(counts).forEach(cat => {
        if (counts[cat] === 0) {
          counts[cat] = Math.floor(Math.random() * 20) + 5 // Número aleatorio entre 5 y 25
        }
      })

      serviceCounts.value = counts
    } catch (error) {
      console.error('Error cargando contadores de servicios:', error)
    }
  }

  const viewService = (serviceId: string) => {
    router.push(`/service/${serviceId}`)
  }

  const getPriceType = (type: string) => {
    return priceTypes.find(pt => pt.value === type)?.label || type
  }

  return {
    services,
    loading,
    filteredServices,
    serviceCategories,
    priceTypes,
    searchQuery,
    selectedCategory,
    searchServices,
    filterByCategory,
    setSortBy,
    setPriceRange,
    getServices,
    getService,
    createService,
    updateService,
    deleteService,
    viewService,
    getPriceType,
    loadServiceCounts
  }
}