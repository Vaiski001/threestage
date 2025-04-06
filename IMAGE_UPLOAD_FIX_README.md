# Image Upload Fix

## Issue

Users were experiencing issues when trying to upload company logo and banner images in the Company Portal:

1. Uploads were failing with RLS (Row-Level Security) policy errors
2. Error messages showed: "new row violates row-level security policy"
3. Some uploads resulted in JSON syntax errors or 403 Unauthorized errors

## Root Causes

1. **Supabase Storage RLS Permissions**: The Row-Level Security policies for the storage bucket were not properly configured to allow authenticated users to upload files.

2. **File Size Limits**: The limit was set universally to 5MB, but our UI indicates different limits for logos (2MB) and banners (5MB).

3. **Error Handling**: The previous implementation was throwing raw error objects instead of formatted messages, causing poor error display.

4. **Missing Authentication Checks**: The code didn't verify if the user was still authenticated before attempting uploads.

## Solutions Implemented

### 1. SQL Fixes

Created a new SQL script `fix_storage_permissions.sql` that:
- Enables RLS on storage objects
- Creates more permissive policies for authenticated users
- Adds specific policies for company profile images
- Provides better error logging

### 2. Component Improvements

#### Fixed the ImageUploader Component:
- Added proper size checking based on image type (logo vs banner)
- Improved error handling and user feedback
- Added proper cache control and options for uploads

#### Created Enhanced ImageUploader:
- Added bucket availability checking
- Implemented authentication verification
- Added retry logic for failed uploads
- Added debug information display for troubleshooting
- Added toast notifications for better user feedback
- Added refresh authentication option for expired sessions

### How to Apply the Fix

1. **Run the SQL script:**
   - Log into your Supabase dashboard
   - Navigate to the SQL Editor
   - Paste and run the contents of `fix_storage_permissions.sql`

2. **Deploy the updated components:**
   - Either use the fixed `ImageUploader.tsx` 
   - Or use the enhanced `ImageUploaderEnhanced.tsx` for better error handling and debugging

## Testing

After applying these fixes:
1. Test uploading a small image (<2MB) as company logo
2. Test uploading a larger image (2-5MB) as company banner
3. Test uploading an oversized image (>5MB) to verify error handling
4. Test with a logged-out user to verify authentication error handling

## Technical Details

The fix addresses:
- Row-level security policy violations in Supabase storage
- Proper file size verification
- Better error messaging and debugging
- Authentication session validation 