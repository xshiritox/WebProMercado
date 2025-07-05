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

  const receivedMessages = computed(() => 
    messages.value.filter(msg => 
      msg.recipient_id === user.value?.id && 
      !msg.deleted_by_recipient
    )
  )
  
  const sentMessages = computed(() => 
    messages.value.filter(msg => 
      msg.sender_id === user.value?.id && 
      !msg.deleted_by_sender
    )
  )
  
  const userMessages = computed(() => 
    activeMessageType.value === 'inbox' ? receivedMessages.value : sentMessages.value
  )
  
  const userConversations = computed(() => conversations.value)
  const unreadCount = computed(() => 
    messages.value.filter(msg => !msg.read && msg.recipient_id === user.value?.id).length
  )
  
  const activeMessageType = ref<'inbox' | 'sent'>('inbox')
  
  const setActiveMessageType = (type: 'inbox' | 'sent') => {
    activeMessageType.value = type
  }

  const loadMessages = async () => {
    if (!user.value) return

    loading.value = true
    try {
      // Primero, obtenemos todos los mensajes donde el usuario es el remitente o el destinatario
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
        .or(`and(sender_id.eq.${user.value.id},deleted_by_sender.is.false),and(recipient_id.eq.${user.value.id},deleted_by_recipient.is.false)`)
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
    // parent_message_id?: string // Comentado ya que no existe en la base de datos
  }) => {
    if (!user.value) {
      toast.error('Debes iniciar sesión para enviar mensajes')
      return false
    }

    // Validar que el contenido no esté vacío
    if (!messageData.content || !messageData.content.trim()) {
      toast.error('El mensaje no puede estar vacío')
      return false
    }

    // Validar que se proporcione un destinatario
    if (!messageData.recipient_id) {
      toast.error('Debes especificar un destinatario')
      return false
    }

    // Crear el objeto de mensaje con solo los campos necesarios
    const messageToSend: Record<string, any> = {
      sender_id: user.value.id,
      recipient_id: messageData.recipient_id,
      content: messageData.content.trim(),
      read: false,
      deleted_by_sender: false,
      deleted_by_recipient: false
    }

    // Agregar campos opcionales solo si están presentes
    if (messageData.subject) messageToSend.subject = messageData.subject
    if (messageData.product_id) messageToSend.product_id = messageData.product_id
    if (messageData.property_id) messageToSend.property_id = messageData.property_id
    if (messageData.service_id) messageToSend.service_id = messageData.service_id
    // Nota: La columna parent_message_id no existe en la base de datos
    // Si necesitas esta funcionalidad, debes agregar la columna a la tabla messages

    try {
      console.log('Enviando mensaje:', messageToSend)
      
      const { data, error } = await supabase
        .from('messages')
        .insert(messageToSend)
        .select()

      if (error) {
        console.error('Error al enviar mensaje:', error)
        throw new Error(error.message || 'Error al enviar el mensaje')
      }

      console.log('Mensaje enviado correctamente:', data)
      toast.success('Mensaje enviado correctamente')
      await loadMessages()
      return true
    } catch (error: any) {
      console.error('Error en sendMessage:', error)
      toast.error(error.message || 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.')
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
      console.log('Intentando eliminar mensaje con ID:', messageId);
      
      // Verificar que el usuario esté autenticado
      if (!user.value) {
        throw new Error('Debes iniciar sesión para eliminar mensajes');
      }
      
      // Verificar si el mensaje existe y el usuario tiene permiso
      console.log('Buscando mensaje en la base de datos...');
      const { data: messageData, error: fetchError } = await supabase
        .from('messages')
        .select('id, sender_id, recipient_id')
        .eq('id', messageId)
        .or(`sender_id.eq.${user.value.id},recipient_id.eq.${user.value.id}`)
        .single();

      if (fetchError || !messageData) {
        console.error('Error al buscar el mensaje:', fetchError);
        throw new Error('No se pudo encontrar el mensaje o no tienes permiso para eliminarlo');
      }

      // Verificar si el usuario es el remitente o el destinatario
      const isSender = messageData.sender_id === user.value.id;
      const isRecipient = messageData.recipient_id === user.value.id;

      if (!isSender && !isRecipient) {
        throw new Error('No tienes permiso para eliminar este mensaje');
      }

      console.log('Eliminando mensaje...');
      const { error: deleteError } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .or(`sender_id.eq.${user.value.id},recipient_id.eq.${user.value.id}`);

      if (deleteError) {
        console.error('Error al eliminar el mensaje:', deleteError);
        throw new Error('No se pudo eliminar el mensaje: ' + deleteError.message);
      }

      console.log('Mensaje eliminado correctamente');
      
      // Actualizar la lista localmente
      messages.value = messages.value.filter(msg => msg.id !== messageId);
      
      // Recargar los mensajes para asegurar que todo esté sincronizado
      await loadMessages();
      
      return true;
    } catch (error: any) {
      console.error('Error en deleteMessage:', error);
      throw error; // Re-lanzar el error para que pueda ser manejado por el componente
    }
  }

  return {
    messages: userMessages,
    receivedMessages,
    sentMessages,
    conversations: userConversations,
    unreadCount,
    loading,
    loadMessages,
    sendMessage,
    markAsRead,
    deleteMessage,
    activeMessageType,
    setActiveMessageType
  }
}