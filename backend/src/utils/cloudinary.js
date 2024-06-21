import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_NAME, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const UploadOnCloudinary = async (localFilePath)=> {
    try {
        if(!localFilePath) return null;
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })

        // console.log(uploadResult);
        console.log(`File Uploaded at Cloudinary ${uploadResult.url}`);
        return uploadResult
    }
    catch (error) {
        console.log("cloudinary uploading error", error);
    }
    finally {
        fs.unlinkSync(localFilePath); // remove the locally saved temp file as the upload operation got either success or not.
    }
}

export const DeleteFromCloudinary = async (cloudURL)=> {
    try {
        if(!cloudURL) return null;

        let dotIndex= cloudURL.lastIndexOf(".");
        let slashIndex= cloudURL.lastIndexOf("/");
        let cloudId= cloudURL.slice(slashIndex+1, dotIndex);
        if(!cloudId || cloudId == "") {
            console.log("slicing error");
        }

        await cloudinary.uploader.destroy(cloudId, function(res) {
            console.log("res ", res);
        })

        console.log(cloudURL, " URL deleted.");

    } catch (error) {
        console.log("cloudinary deletion error ", error);
    }
}