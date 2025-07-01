import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { useToast } from 'vue-toastification'

const reports = ref<any[]>([])
const loading = ref(false)

export const useReports = () => {
  const { user, isAdmin, isModerator } = useAuth()
  const toast = useToast()

  const userReports = computed(() => reports.value)
  const pendingReports = computed(() => 
    reports.value.filter(report => report.status === 'pending')
  )

  const loadReports = async () => {
    if (!user.value) return

    loading.value = true
    try {
      let query = supabase
        .from('reports')
        .select(`
          *,
          reporter:reporter_id (full_name),
          reported_user:reported_user_id (full_name),
          products:product_id (title),
          properties:property_id (title),
          services:service_id (title),
          reviewer:reviewed_by (full_name)
        `)

      // If user is admin/moderator, load all reports
      // Otherwise, load only user's reports
      if (!isAdmin.value && !isModerator.value) {
        query = query.eq('reporter_id', user.value.id)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      reports.value = data || []
    } catch (error: any) {
      toast.error(error.message || 'Error al cargar reportes')
    } finally {
      loading.value = false
    }
  }

  const createReport = async (reportData: {
    reported_user_id?: string
    product_id?: string
    property_id?: string
    service_id?: string
    reason: string
    description?: string
  }) => {
    if (!user.value) {
      toast.error('Debes iniciar sesión para reportar')
      return false
    }

    try {
      const { error } = await supabase
        .from('reports')
        .insert({
          reporter_id: user.value.id,
          ...reportData
        })

      if (error) throw error

      toast.success('Reporte enviado. Será revisado por nuestro equipo.')
      await loadReports()
      return true
    } catch (error: any) {
      toast.error(error.message || 'Error al enviar reporte')
      return false
    }
  }

  const updateReportStatus = async (
    reportId: string, 
    status: 'reviewed' | 'resolved' | 'dismissed'
  ) => {
    if (!isAdmin.value && !isModerator.value) {
      toast.error('No tienes permisos para esta acción')
      return false
    }

    try {
      const { error } = await supabase
        .from('reports')
        .update({
          status,
          reviewed_by: user.value?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', reportId)

      if (error) throw error

      toast.success('Estado del reporte actualizado')
      await loadReports()
      return true
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar reporte')
      return false
    }
  }

  return {
    reports: userReports,
    pendingReports,
    loading: computed(() => loading.value),
    loadReports,
    createReport,
    updateReportStatus
  }
}