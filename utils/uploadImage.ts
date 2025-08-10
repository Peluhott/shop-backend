import cloudinary from '../utils/cloudinary';

export async function uploadProductImage(file: Express.Multer.File){
    const result =  await cloudinary.uploader.upload(file.path, {
        Folder: 'ShopProducts' 
    });
    return result.secure_url;
}