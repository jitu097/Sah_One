# Cloudinary Setup Guide for Sah One

## Step 1: Create Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a **FREE** account
3. Verify your email

## Step 2: Get Your Credentials

1. Log in to Cloudinary Dashboard
2. You'll see your **Dashboard** with credentials:
   - **Cloud Name** (e.g., `dxxxxxx`)
   - **API Key**
   - **API Secret**

## Step 3: Create Upload Preset

1. Click on **Settings** (gear icon) in top right
2. Go to **Upload** tab
3. Scroll down to **Upload presets**
4. Click **Add upload preset**
5. Set the following:
   - **Preset name**: `sah-one-menu` (or any name)
   - **Signing mode**: Select **"Unsigned"** (important!)
   - **Folder**: `sah-one-menu`
6. Click **Save**
7. **Copy the preset name** (you'll need this)

## Step 4: Configure Environment Variables

1. Create `.env` file in `client/` folder (if not exists)
2. Add these variables:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=sah-one-menu
```

**Replace:**
- `your_cloud_name_here` with your actual Cloud Name from Step 2
- `sah-one-menu` with your upload preset name from Step 3

## Step 5: Install Dependencies

Run this command in the `client/` folder:

```bash
npm install
```

## Step 6: Restart Development Server

Stop the current dev server (Ctrl+C) and restart:

```bash
npm run dev
```

## Step 7: Test Upload

1. Go to Admin Panel → Menu → Add New Item
2. Click "Upload New Image"
3. Select an image
4. You should see upload progress
5. Image URL will be automatically saved to database

## Cloudinary Free Tier Limits

✅ **25 GB Storage**
✅ **25 GB Bandwidth per month**
✅ **Unlimited transformations**
✅ Perfect for 300+ food images!

## Folder Structure in Cloudinary

Your images will be organized like this:
```
Cloudinary Media Library/
└── sah-one-menu/
    ├── rolls_paneer.jpg
    ├── chowmein_veg.jpg
    └── ... (all your food images)
```

## Image Optimization

Images are automatically optimized:
- Compressed for web
- Max size: 800x800px
- Quality: auto (smart optimization)
- Format: auto (WebP when supported)

## Security Notes

- ✅ Unsigned uploads are safe for menu items (admin-only in your app)
- ✅ You control who can access the admin panel
- ✅ No API secret exposed in frontend
- ✅ Folder-based organization

## Troubleshooting

**Error: "Cloudinary is not configured"**
- Check `.env` file exists in `client/` folder
- Verify variable names start with `VITE_`
- Restart dev server after adding .env

**Error: "Upload failed"**
- Verify upload preset is set to "Unsigned"
- Check cloud name is correct
- Ensure file is under 5MB

**Image not showing**
- Check browser console for errors
- Verify URL is returned from Cloudinary
- Check image URL in database

## Need Help?

- Cloudinary Docs: https://cloudinary.com/documentation
- Support: support@cloudinary.com
