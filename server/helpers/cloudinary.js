const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadMediaToCloudinary = async (filepath)=>{
    try {
        const result = await cloudinary.uploader.upload(filepath,{
            resource_type : 'auto'
        })
        return result
    } catch (error) {
        console.log(error);
        throw new Error('Error while Uploading to cloudinary')
        
    }
}
const deleteMediaFormCloudinary = async (publicId) =>{
    try {
        await cloudinary.uploader.destroy(publicId)
        
    } catch (error) {
        console.log(error);
        throw new Error('failed to delete asset from cloudinary')
        
    }
}

module.exports= {uploadMediaToCloudinary,deleteMediaFormCloudinary}