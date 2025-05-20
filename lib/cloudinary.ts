import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(imageData: string) {
  try {
    const result = await cloudinary.uploader.upload(imageData, {
      folder: 'menu-items',
      transformation: [
        { width: 1000, crop: 'limit' }, // Original size
      ]
    });

    // Generate thumbnail
    const thumbnail = await cloudinary.uploader.upload(imageData, {
      folder: 'menu-items/thumbnails',
      transformation: [
        { width: 300, height: 300, crop: 'fill', gravity: 'auto' }
      ]
    });

    return {
      image: result.secure_url,
      thumbnail: thumbnail.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
}

export async function deleteImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
    // Also delete the thumbnail if it exists
    await cloudinary.uploader.destroy(`${publicId.split('/')[0]}/thumbnails/${publicId.split('/')[1]}`);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Failed to delete image');
  }
}