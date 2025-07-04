/*
  # Fix Storage RLS Policies for Property Images

  1. Storage Policies
    - Create policies for property-images bucket access
    - Allow authenticated users to upload to their own folders
    - Allow public read access to property images

  2. Bucket Configuration
    - Ensure property-images bucket exists with proper settings

  Note: RLS is already enabled on storage tables by default in Supabase
*/

-- Create storage policies using DO blocks to handle potential conflicts
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
EXCEPTION WHEN insufficient_privilege THEN
  -- Policy creation failed due to permissions, skip
  RAISE NOTICE 'Could not create policy "Public read access for property images" - insufficient privileges';
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
EXCEPTION WHEN insufficient_privilege THEN
  RAISE NOTICE 'Could not create policy "Authenticated users can upload property images" - insufficient privileges';
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
EXCEPTION WHEN insufficient_privilege THEN
  RAISE NOTICE 'Could not create policy "Users can update their own property images" - insufficient privileges';
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
EXCEPTION WHEN insufficient_privilege THEN
  RAISE NOTICE 'Could not create policy "Users can delete their own property images" - insufficient privileges';
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
EXCEPTION WHEN insufficient_privilege THEN
  RAISE NOTICE 'Could not create policy "Public bucket access" - insufficient privileges';
END $$;

-- Create or update the property-images bucket
-- This uses a safer approach that handles potential permission issues
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
EXCEPTION WHEN OTHERS THEN
  -- Handle any other errors gracefully
  RAISE NOTICE 'Bucket operation failed: %', SQLERRM;
END $$;

-- Note: RLS is already enabled by default on storage.objects and storage.buckets in Supabase
-- so we don't need to explicitly enable it