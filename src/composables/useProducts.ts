import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { useToast } from 'vue-toastification'

const products = ref<any[]>([])
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('created_at')

export const useProducts = () => {
  const toast = useToast()

  const categories = [
    'Electrónicos',
    'Vehículos',
    'Hogar y Jardín',
    'Moda y Belleza',
    'Deportes',
    'Libros y Música',
    'Inmuebles',
    'Servicios',
    'Otros'
  ]

  const filteredProducts = computed(() => {
    let filtered = products.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.location.toLowerCase().includes(query)
      )
    }

    if (selectedCategory.value) {
      filtered = filtered.filter(product => product.category === selectedCategory.value)
    }

    // Sort products
    filtered.sort((a, b) => {
      if (sortBy.value === 'price_asc') return a.price - b.price
      if (sortBy.value === 'price_desc') return b.price - a.price
      if (sortBy.value === 'created_at') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      return 0
    })

    return filtered
  })

  const getProducts = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url,
            badge
          )
        `)
        .eq('status', 'active')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error

      products.value = data || []
      return data
    } catch (error: any) {
      toast.error(error.message || 'Error al cargar productos')
      return []
    } finally {
      loading.value = false
    }
  }

  const getProduct = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
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
      toast.error(error.message || 'Error al cargar el producto')
      return null
    }
  }

  const createProduct = async (productData: any) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single()

      if (error) throw error

      toast.success('¡Producto publicado exitosamente!')
      await getProducts() // Refresh products list
      return data
    } catch (error: any) {
      toast.error(error.message || 'Error al publicar el producto')
      return null
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (id: string, updates: any) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      toast.success('Producto actualizado exitosamente')
      await getProducts() // Refresh products list
      return data
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar el producto')
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (id: string) => {
    loading.value = true
    try {
      // First, get the product to access its images
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('images')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      // Delete the product from the database
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Delete associated images from storage if they exist
      if (product?.images?.length > 0) {
        try {
          const imageUrls = product.images as string[]
          const pathsToDelete = imageUrls.map(url => {
            try {
              // Handle both full URLs and paths
              if (url.startsWith('http')) {
                const urlObj = new URL(url)
                // Extract the path after the bucket name
                const pathParts = urlObj.pathname.split('/')
                const bucketIndex = pathParts.indexOf('product-images')
                if (bucketIndex !== -1) {
                  return pathParts.slice(bucketIndex + 1).join('/')
                }
                // Fallback to the old method if the URL format is different
                const match = urlObj.pathname.match(/product-images\/(.+)$/)
                return match ? match[1] : ''
              } else {
                // If it's already a path, just return it
                return url.replace(/^product-images\//, '')
              }
            } catch (e) {
              console.error('Error processing image URL:', url, e)
              return ''
            }
          }).filter(Boolean) // Remove any empty strings

          if (pathsToDelete.length > 0) {
            // Delete each image from storage
            const { error: storageError } = await supabase.storage
              .from('product-images')
              .remove(pathsToDelete)

            if (storageError) {
              console.error('Error deleting images from storage:', storageError)
              // Don't throw here as the product was already deleted
            }
          }
        } catch (e) {
          console.error('Error during image deletion:', e)
          // Continue even if image deletion fails
        }
      }

      toast.success('Producto y sus imágenes eliminados exitosamente')
      await getProducts() // Refresh products list
      return true
    } catch (error: any) {
      console.error('Error deleting product:', error)
      toast.error(error.message || 'Error al eliminar el producto')
      return false
    } finally {
      loading.value = false
    }
  }

  const searchProducts = (query: string) => {
    searchQuery.value = query
  }

  const filterByCategory = (category: string) => {
    selectedCategory.value = category
  }

  const setSortBy = (sort: string) => {
    sortBy.value = sort
  }

  return {
    products: computed(() => products.value),
    filteredProducts,
    loading: computed(() => loading.value),
    categories,
    searchQuery: computed(() => searchQuery.value),
    selectedCategory: computed(() => selectedCategory.value),
    sortBy: computed(() => sortBy.value),
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterByCategory,
    setSortBy
  }
}