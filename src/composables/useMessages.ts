import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { useToast } from 'vue-toastification'

const messages = ref<any[]>([])
const conversations = ref<any[]>([])
const loading = ref(false)

export const useMessages = () => {
  const { user } = useAuth()
  const toast = useToast()

  const userMessages = computed(() => messages.value)
  const userConversations = computed(() => conversations.value)
  const unreadCount = computed(() => 
    messages.value.filter(msg => !msg.read && msg.recipient_id === user.value?.id).length
  )

  const loadMessages = async () => {
    if (!user.value) return

    loading.value = true
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id (full_name, avatar_url),
          recipient:recipient_id (full_name, avatar_url),
          products:product_id (title),
          properties:property_id (title),
          services:service_id (title)
        `)
        .or(`sender_id.eq.${user.value.id},recipient_id.eq.${user.value.id}`)
        .order('created_at', { ascending: false })

      if (error) throw error

      messages.value = data || []
    } catch (error: any) {
      toast.error(error.message || 'Error al cargar mensajes')
    } finally {
      loading.value = false
    }
  }

  const sendMessage = async (messageData: {
    recipient_id: string
    subject?: string
    content: string
    product_id?: string
    property_id?: string
    service_id?: string
  }) => {
    if (!user.value) {
      toast.error('Debes iniciar sesión para enviar mensajes')
      return false
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.value.id,
          ...messageData
        })

      if (error) throw error

      toast.success('Mensaje enviado')
      await loadMessages()
      return true
    } catch (error: any) {
      toast.error(error.message || 'Error al enviar mensaje')
      return false
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId)
        .eq('recipient_id', user.value?.id)

      if (error) throw error

      await loadMessages()
    } catch (error: any) {
      console.error('Error marking message as read:', error)
    }
  }

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .or(`sender_id.eq.${user.value?.id},recipient_id.eq.${user.value?.id}`)

      if (error) throw error

      toast.success('Mensaje eliminado')
      await loadMessages()
      return true
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar mensaje')
      return false
    }
  }

  return {
    messages: userMessages,
    conversations: userConversations,
    unreadCount,
    loading: computed(() => loading.value),
    loadMessages,
    sendMessage,
    markAsRead,
    deleteMessage
  }
}