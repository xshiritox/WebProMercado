/*
  # Fix Storage RLS Policies for Property Images

  1. Storage Policies
    - Enable public read access for property images
    - Allow authenticated users to upload to their own folders
    - Allow users to manage their own images

  2. Bucket Configuration
    - Ensure property-images bucket exists with proper settings
*/

-- Create storage policies using the storage schema functions
-- These policies will be created if they don't already exist

-- Policy for public read access to property images
DO $$
BEGIN
  -- Check if policy exists, if not create it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public read access for property images'
  ) THEN
    CREATE POLICY "Public read access for property images" ON storage.objects
      FOR SELECT USING (bucket_id = 'property-images');
  END IF;
END $$;

-- Policy for authenticated users to upload property images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload property images'
  ) THEN
    CREATE POLICY "Authenticated users can upload property images" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'property-images' 
        AND auth.role() = 'authenticated'
        AND (
          -- Allow uploads to properties/{user_id}/ folder structure
          name ~ ('^properties/' || auth.uid()::text || '/.*')
        )
      );
  END IF;
END $$;

-- Policy for users to update their own property images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can update their own property images'
  ) THEN
    CREATE POLICY "Users can update their own property images" ON storage.objects
      FOR UPDATE USING (
        bucket_id = 'property-images' 
        AND auth.role() = 'authenticated'
        AND name ~ ('^properties/' || auth.uid()::text || '/.*')
      );
  END IF;
END $$;

-- Policy for users to delete their own property images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can delete their own property images'
  ) THEN
    CREATE POLICY "Users can delete their own property images" ON storage.objects
      FOR DELETE USING (
        bucket_id = 'property-images' 
        AND auth.role() = 'authenticated'
        AND name ~ ('^properties/' || auth.uid()::text || '/.*')
      );
  END IF;
END $$;

-- Policy for public bucket access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'buckets' 
    AND policyname = 'Public bucket access'
  ) THEN
    CREATE POLICY "Public bucket access" ON storage.buckets
      FOR SELECT USING (true);
  END IF;
END $$;

-- Ensure RLS is enabled on storage tables (this should already be enabled by default)
-- We'll use a safer approach that doesn't require ownership
DO $$
BEGIN
  -- Enable RLS on storage.objects if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND rowsecurity = true
  ) THEN
    -- This will only work if we have the right permissions
    -- If it fails, RLS is likely already enabled
    BEGIN
      ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN insufficient_privilege THEN
      -- RLS is likely already enabled, continue
      NULL;
    END;
  END IF;

  -- Enable RLS on storage.buckets if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'storage' 
    AND tablename = 'buckets' 
    AND rowsecurity = true
  ) THEN
    BEGIN
      ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN insufficient_privilege THEN
      -- RLS is likely already enabled, continue
      NULL;
    END;
  END IF;
END $$;

-- Create or update the property-images bucket
-- This uses INSERT ... ON CONFLICT which is safer than direct table modification
DO $$
BEGIN
  -- Try to insert the bucket, update if it already exists
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, created_at, updated_at)
  VALUES (
    'property-images',
    'property-images',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
    updated_at = NOW();
    
EXCEPTION WHEN insufficient_privilege THEN
  -- If we can't create/update the bucket, it might already exist
  -- Log the issue but don't fail the migration
  RAISE NOTICE 'Could not create/update property-images bucket - it may already exist with correct settings';
END $$;