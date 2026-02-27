# Profile Photo Upload - Setup Instructions

## Overview
The LitLens profile photo upload feature has been successfully implemented! Users can now upload profile photos directly from their device.

## What Was Implemented

### 1. **Backend Services** (`/lib/supabase-services.ts`)
- `uploadProfilePhoto()` - Handles file uploads to Supabase Storage
- `updateUserProfile()` - Extended to support avatar URL updates
- `deleteProfilePhoto()` - Removes old profile photos from storage
- File validation (type, size limits)

### 2. **User Interface** (`/components/UserProfile.tsx`)
- Clickable avatar with upload button
- Hidden file input for device photo selection
- Loading states during upload
- Success/error toast notifications
- Immediate photo display after upload

### 3. **Storage Setup** (`/components/StorageMigrationBanner.tsx`)
- One-click storage bucket creation
- Automatic setup from the UI
- Clear user guidance

## How to Set Up Storage

### Option 1: Automatic Setup (Recommended)
1. Log in to your LitLens account
2. Go to your Profile page
3. Click "Edit Profile"
4. You'll see a banner saying "Storage Setup Required"
5. Click "Setup Storage Now"
6. Wait for confirmation (2-3 seconds)
7. You're ready to upload photos!

### Option 2: Manual Setup (Advanced Users)

If you prefer to set up the storage bucket manually in Supabase:

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click "Create a new bucket"
4. Enter these settings:
   - **Bucket Name**: `profile-photos`
   - **Public**: ✅ Enabled
   - **File Size Limit**: 5 MB
   - **Allowed MIME types**: image/jpeg, image/jpg, image/png, image/webp
5. Click "Create bucket"

The storage policies are already handled in the migration file.

## Features

### ✅ What Works
- **File Upload**: Click avatar to select and upload photos
- **File Validation**: 
  - Only JPG, PNG, and WebP formats accepted
  - Maximum file size: 5MB
- **Instant Updates**: Photos display immediately after upload
- **Secure Storage**: Files stored in Supabase Storage with proper access control
- **User-Friendly**: Clear error messages and loading states

### 🔒 Security
- Row Level Security (RLS) policies protect user data
- Users can only upload/update/delete their own photos
- Public read access for displaying avatars
- File size and type validation

### 📱 User Experience
- No drag-and-drop needed - just click and select
- Visual loading indicator during upload
- Toast notifications for success/errors
- Photos stored permanently in Supabase Storage
- Automatic URL generation for uploaded images

## Technical Details

### Storage Structure
```
profile-photos/
└── avatars/
    ├── user-id-1-timestamp.jpg
    ├── user-id-2-timestamp.png
    └── user-id-3-timestamp.webp
```

### File Naming Convention
Files are named using the pattern: `{userId}-{timestamp}.{extension}`

This ensures:
- Unique filenames for each upload
- Easy identification of photo ownership
- Prevention of filename conflicts

### Database Updates
When a user uploads a photo:
1. File is uploaded to Supabase Storage
2. Public URL is generated
3. User's `avatar` field in `profiles` table is updated with the URL
4. Old photo remains in storage (can be cleaned up later)

## Troubleshooting

### "Bucket not found" Error
- **Solution**: Run the automatic setup from the Edit Profile dialog
- The banner will guide you through the process

### "Failed to upload photo"
- Check file size (must be under 5MB)
- Verify file type (JPG, PNG, or WebP only)
- Ensure you're logged in

### Photo doesn't display
- Check browser console for errors
- Verify Supabase connection is active
- Ensure the `profile-photos` bucket exists and is public

## Future Enhancements

Possible improvements for later:
- Photo cropping/editing before upload
- Multiple photo sizes (thumbnails, etc.)
- Old photo cleanup (delete previous photos)
- Photo gallery/history
- Avatar selection from preset options

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify Supabase connection in the app
3. Ensure storage bucket is created and public
4. Review RLS policies in Supabase Dashboard

---

**Status**: ✅ Feature Complete & Ready to Use
