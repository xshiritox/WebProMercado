import { supabase } from '../lib/supabase'

type Bucket = 'property-images' | 'service-images' | 'product-images'

export const uploadFile = async (
  bucket: Bucket,
  file: File,
  path: string = '',
  fileName?: string
): Promise<string> => {
  const fileExt = file.name.split('.').pop()
  const finalFileName = fileName || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
  const filePath = path ? `${path}/${finalFileName}` : finalFileName

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) {
    console.error(`Error subiendo a ${bucket}:`, uploadError)
    throw uploadError
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  if (!publicUrl) {
    throw new Error('No se pudo obtener la URL pública del archivo')
  }

  return publicUrl
}

export const deleteFile = async (bucket: Bucket, filePath: string) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath])

  if (error) {
    console.error(`Error eliminando archivo de ${bucket}:`, error)
    throw error
  }
}
