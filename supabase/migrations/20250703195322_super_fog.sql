/*
  # Fix Storage RLS Policies for Property Images

  1. Storage Policies
    - Enable RLS on storage.objects and storage.buckets
    - Create policies for property-images bucket
    - Allow authenticated users to upload to their own folders
    - Allow public read access to property images

  2. Security
    - Users can only upload to their own property folders
    - Public read access for displaying images
    - Proper folder structure enforcement
*/

-- Enable RLS on storage tables
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Create bucket policy for property-images (allow public read)
CREATE POLICY "Public read access for property images" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-images');

-- Create policy for authenticated users to upload to their own property folder
CREATE POLICY "Authenticated users can upload property images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'property-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = 'properties'
    AND (storage.foldername(name))[2]::uuid = auth.uid()
  );

-- Create policy for users to update their own property images
CREATE POLICY "Users can update their own property images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'property-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = 'properties'
    AND (storage.foldername(name))[2]::uuid = auth.uid()
  );

-- Create policy for users to delete their own property images
CREATE POLICY "Users can delete their own property images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'property-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = 'properties'
    AND (storage.foldername(name))[2]::uuid = auth.uid()
  );

-- Allow public access to buckets (needed for reading bucket info)
CREATE POLICY "Public bucket access" ON storage.buckets
  FOR SELECT USING (true);

-- Ensure the property-images bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];