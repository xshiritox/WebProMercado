import { createClient } from '@supabase/supabase-js'

// Configuración directa de Supabase
const supabaseUrl = 'https://xnzkzdbgmrdinsojqedw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhuemt6ZGJnbXJkaW5zb2pxZWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzE3MTksImV4cCI6MjA2Njk0NzcxOX0.ImzeMJv49i5sE1osP-TrHvTi8tf2Z37r7ltTX97TuzA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url?: string
          phone?: string
          location?: string
          badge?: 'destacado' | 'colaborador' | 'vip' | 'moderador' | 'admin' | null
          bio?: string
          website?: string
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string
          phone?: string
          location?: string
          badge?: 'destacado' | 'colaborador' | 'vip' | 'moderador' | 'admin' | null
          bio?: string
          website?: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string
          phone?: string
          location?: string
          badge?: 'destacado' | 'colaborador' | 'vip' | 'moderador' | 'admin' | null
          bio?: string
          website?: string
          verified?: boolean
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description?: string
          icon?: string
          parent_id?: string
          sort_order: number
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          icon?: string
          parent_id?: string
          sort_order?: number
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon?: string
          parent_id?: string
          sort_order?: number
          active?: boolean
        }
      }
      products: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          category: string
          condition: 'nuevo' | 'usado' | 'reacondicionado'
          images: string[]
          location: string
          user_id: string
          status: 'active' | 'sold' | 'inactive' | 'pending'
          featured: boolean
          featured_until?: string
          views: number
          contact_name?: string
          contact_phone?: string
          contact_email?: string
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          category: string
          condition: 'nuevo' | 'usado' | 'reacondicionado'
          images?: string[]
          location: string
          user_id: string
          status?: 'active' | 'sold' | 'inactive' | 'pending'
          featured?: boolean
          featured_until?: string
          views?: number
          contact_name?: string
          contact_phone?: string
          contact_email?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          category?: string
          condition?: 'nuevo' | 'usado' | 'reacondicionado'
          images?: string[]
          location?: string
          user_id?: string
          status?: 'active' | 'sold' | 'inactive' | 'pending'
          featured?: boolean
          featured_until?: string
          views?: number
          contact_name?: string
          contact_phone?: string
          contact_email?: string
          tags?: string[]
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          property_type: 'casa' | 'apartamento' | 'local' | 'oficina' | 'lote'
          transaction_type: 'venta' | 'alquiler'
          bedrooms?: number
          bathrooms?: number
          area: number
          images: string[]
          location: string
          address: string
          latitude?: number
          longitude?: number
          user_id: string
          status: 'active' | 'rented' | 'sold' | 'inactive'
          featured: boolean
          featured_until?: string
          views: number
          amenities: string[]
          parking_spaces: number
          year_built?: number
          stratum?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          property_type: 'casa' | 'apartamento' | 'local' | 'oficina' | 'lote'
          transaction_type: 'venta' | 'alquiler'
          bedrooms?: number
          bathrooms?: number
          area: number
          images?: string[]
          location: string
          address: string
          latitude?: number
          longitude?: number
          user_id: string
          status?: 'active' | 'rented' | 'sold' | 'inactive'
          featured?: boolean
          featured_until?: string
          views?: number
          amenities?: string[]
          parking_spaces?: number
          year_built?: number
          stratum?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          property_type?: 'casa' | 'apartamento' | 'local' | 'oficina' | 'lote'
          transaction_type?: 'venta' | 'alquiler'
          bedrooms?: number
          bathrooms?: number
          area?: number
          images?: string[]
          location?: string
          address?: string
          latitude?: number
          longitude?: number
          user_id?: string
          status?: 'active' | 'rented' | 'sold' | 'inactive'
          featured?: boolean
          featured_until?: string
          views?: number
          amenities?: string[]
          parking_spaces?: number
          year_built?: number
          stratum?: number
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          price_from?: number
          price_to?: number
          price_type: string
          images: string[]
          location: string
          user_id: string
          status: string
          featured: boolean
          featured_until?: string
          views: number
          rating: number
          reviews_count: number
          availability: string[]
          response_time: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          price_from?: number
          price_to?: number
          price_type?: string
          images?: string[]
          location: string
          user_id: string
          status?: string
          featured?: boolean
          featured_until?: string
          views?: number
          rating?: number
          reviews_count?: number
          availability?: string[]
          response_time?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          price_from?: number
          price_to?: number
          price_type?: string
          images?: string[]
          location?: string
          user_id?: string
          status?: string
          featured?: boolean
          featured_until?: string
          views?: number
          rating?: number
          reviews_count?: number
          availability?: string[]
          response_time?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          product_id?: string
          property_id?: string
          service_id?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id?: string
          property_id?: string
          service_id?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          property_id?: string
          service_id?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          subject?: string
          content: string
          product_id?: string
          property_id?: string
          service_id?: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          subject?: string
          content: string
          product_id?: string
          property_id?: string
          service_id?: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          subject?: string
          content?: string
          product_id?: string
          property_id?: string
          service_id?: string
          read?: boolean
        }
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          reported_user_id?: string
          product_id?: string
          property_id?: string
          service_id?: string
          reason: string
          description?: string
          status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
          reviewed_by?: string
          reviewed_at?: string
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          reported_user_id?: string
          product_id?: string
          property_id?: string
          service_id?: string
          reason: string
          description?: string
          status?: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
          reviewed_by?: string
          reviewed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          reported_user_id?: string
          product_id?: string
          property_id?: string
          service_id?: string
          reason?: string
          description?: string
          status?: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
          reviewed_by?: string
          reviewed_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          reviewer_id: string
          reviewed_user_id: string
          service_id?: string
          rating: number
          comment?: string
          created_at: string
        }
        Insert: {
          id?: string
          reviewer_id: string
          reviewed_user_id: string
          service_id?: string
          rating: number
          comment?: string
          created_at?: string
        }
        Update: {
          id?: string
          reviewer_id?: string
          reviewed_user_id?: string
          service_id?: string
          rating?: number
          comment?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_views: {
        Args: {
          table_name: string
          record_id: string
        }
        Returns: void
      }
    }
    Enums: {
      user_badge: 'destacado' | 'colaborador' | 'vip' | 'moderador' | 'admin'
      product_condition: 'nuevo' | 'usado' | 'reacondicionado'
      product_status: 'active' | 'sold' | 'inactive' | 'pending'
      property_type: 'casa' | 'apartamento' | 'local' | 'oficina' | 'lote'
      transaction_type: 'venta' | 'alquiler'
      property_status: 'active' | 'rented' | 'sold' | 'inactive'
      report_status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper functions for common operations
export const incrementViews = async (tableName: string, recordId: string) => {
  const { error } = await supabase.rpc('increment_views', {
    table_name: tableName,
    record_id: recordId
  })
  
  if (error) {
    console.error('Error incrementing views:', error)
  }
}

// Storage helpers
export const uploadImage = async (file: File, bucket: string, path: string) => {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file)
  
  if (error) {
    throw error
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return publicUrl
}

export const deleteImage = async (bucket: string, path: string) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])
  
  if (error) {
    throw error
  }
}