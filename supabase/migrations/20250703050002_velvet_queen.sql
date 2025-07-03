/*
  # Funciones para manejo de eliminación de imágenes

  1. Funciones
    - `delete_property_images()` - Elimina imágenes cuando se borra una propiedad
    - `delete_service_images()` - Elimina imágenes cuando se borra un servicio
    - Triggers para ejecutar automáticamente estas funciones

  2. Seguridad
    - Las funciones se ejecutan con privilegios de SECURITY DEFINER
    - Solo se activan en eliminaciones reales de registros
*/

-- Función para eliminar imágenes de propiedades
CREATE OR REPLACE FUNCTION delete_property_images()
RETURNS TRIGGER AS $$
DECLARE
  image_url TEXT;
  file_path TEXT;
BEGIN
  -- Solo procesar si hay imágenes
  IF OLD.images IS NOT NULL AND array_length(OLD.images, 1) > 0 THEN
    -- Iterar sobre cada imagen
    FOREACH image_url IN ARRAY OLD.images
    LOOP
      -- Extraer la ruta del archivo de la URL
      IF image_url LIKE '%/storage/v1/object/public/property-images/%' THEN
        file_path := substring(image_url from '.*/property-images/(.*)$');
        
        -- Eliminar el archivo del storage (esto se maneja desde el cliente)
        -- La función del trigger solo registra que se debe eliminar
        RAISE NOTICE 'Property image to delete: %', file_path;
      END IF;
    END LOOP;
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para eliminar imágenes de servicios
CREATE OR REPLACE FUNCTION delete_service_images()
RETURNS TRIGGER AS $$
DECLARE
  image_url TEXT;
  file_path TEXT;
BEGIN
  -- Solo procesar si hay imágenes
  IF OLD.images IS NOT NULL AND array_length(OLD.images, 1) > 0 THEN
    -- Iterar sobre cada imagen
    FOREACH image_url IN ARRAY OLD.images
    LOOP
      -- Extraer la ruta del archivo de la URL
      IF image_url LIKE '%/storage/v1/object/public/service-images/%' THEN
        file_path := substring(image_url from '.*/service-images/(.*)$');
        
        -- Eliminar el archivo del storage (esto se maneja desde el cliente)
        -- La función del trigger solo registra que se debe eliminar
        RAISE NOTICE 'Service image to delete: %', file_path;
      END IF;
    END LOOP;
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear triggers si no existen
DROP TRIGGER IF EXISTS before_delete_property ON properties;
CREATE TRIGGER before_delete_property
  BEFORE DELETE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION delete_property_images();

DROP TRIGGER IF EXISTS before_delete_service ON services;
CREATE TRIGGER before_delete_service
  BEFORE DELETE ON services
  FOR EACH ROW
  EXECUTE FUNCTION delete_service_images();

-- Verificar que las políticas RLS permitan eliminación
-- Las políticas ya están configuradas correctamente en la migración principal

-- Función auxiliar para verificar permisos de eliminación
CREATE OR REPLACE FUNCTION can_delete_property(property_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM properties 
    WHERE id = property_id 
    AND (
      user_id = auth.uid() OR 
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND badge IN ('admin', 'moderador')
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION can_delete_service(service_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM services 
    WHERE id = service_id 
    AND (
      user_id = auth.uid() OR 
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND badge IN ('admin', 'moderador')
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;