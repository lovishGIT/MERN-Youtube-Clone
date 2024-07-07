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
            folder: "Youtube-ChaiAurCode-Backend",
            resource_type: "auto",
        })

        // console.log(uploadResult);
        console.log(`File Uploaded at Cloudinary ${uploadResult.url}`);
        return uploadResult;
    }
    catch (error) {
        console.log("cloudinary uploading error", error);
    }
    finally {
        fs.unlinkSync(localFilePath); 
        // remove the locally saved file.
    }
}

function getPublicId(cloudURL) {
    if(!cloudURL) return null;

    let dotIndex= cloudURL.lastIndexOf(".");
    let slashIndex= cloudURL.lastIndexOf("/");
    if (slashIndex === -1 || dotIndex === -1) {
        console.log("Invalid cloudURL format");
        return null;
    }

    let cloudId= process.env.CLOUDINARY_PATH + '/' + cloudURL.slice(slashIndex+1, dotIndex);
    return cloudId;
}

export const DeleteImageFromCloudinary = async (cloudURL)=> {
    try {
        let cloudId= getPublicId(cloudURL);
        if(!cloudId || cloudId == "") {
            console.log("slicing error");
        }
        const res= await cloudinary.uploader.destroy(cloudId, {
            resource_type: "image",
            // type: "authenticated",
        })
        if(res)
            console.log(cloudURL, "deleted.");
    } catch (error) {
        console.log("cloudinary deletion error ", error);
    }
}

export const DeleteVideoFromCloudinary = async (cloudURL)=> {
    try {
        let cloudId= getPublicId(cloudURL);
        if(!cloudId || cloudId == "") {
            console.log("slicing error");
        }
        const res= await cloudinary.uploader.destroy(cloudId, {
            resource_type: "video", 
            // type : "authenticated"
        })
        if(res)
            console.log(cloudURL, "deleted.");
    } catch (error) {
        console.log("cloudinary deletion error ", error);
    }
}