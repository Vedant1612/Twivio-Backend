import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
  
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});



// here we are trying to upload the file from our local server to cloudinary and when uploading is successfull then we just removes or deletes the file from our local server this process in terms of operatig system is called as "unlink" -> term for deleting file in O.S(Operating Systems's file processing/file system).

// this process may result in too many errors or requires reuploading therefore use "try-catch" and also this process may take time so use "async-await"...
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath)return null
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        // file has beeen uploaded successfully  
        // console.log("file is uploaded on cloudinary",response.url);
        fs.unlinkSync(localFilePath)
        return response


    // we know that if file fails to upload on cloudinary, it will still remain on server. So for safe cleaning purpose we must "unlink" that file from our server in catch part because it might be malicious or corrupted files...

    } catch (error) {
        // here we us "Sync" because this must be executed then only we must procced for further operations..

        fs.unlinkSync(localFilePath) //removes the locally saved temporary file as the upload operation got failed

        return null;
    }
}

const deleteFromCloudinary = async(publicId, resource_type = "image") => {
    try {
      if(!publicId) return null;
  
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: `${resource_type}`
      })
    } catch (error) {
      return error
      console.log("Error while deleting file on cloudinary", error);
    }
  
  }


export {uploadOnCloudinary, deleteFromCloudinary}