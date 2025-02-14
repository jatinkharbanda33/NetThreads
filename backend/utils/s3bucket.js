import {  S3Client ,PutObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();
const getUrlinS3=(keyy)=>{
        const newurl=String(process.env.AWS_CLOUDFRONT_DOMAIN_NAME)+String(keyy);
        return newurl;
}
const putObjectinS3=async(filename,username,contentType,type)=>{
    try{
        const client = new S3Client({
            region:'ap-south-1',
            credentials:{
                accessKeyId:process.env.AWS_ACCESS_KEY,
                secretAccessKey:process.env.AWS_SECRET_KEY
            }
        });
        let keyy
        if(contentType.startsWith("image/")){
            keyy=`${username}/${type}/images/${filename}` 
        }
        else{
            return {status:false,error:"invalid content-type"};
        }
        const object=new PutObjectCommand({
            Bucket:"netthreads",
            Key:keyy,
            ContentType:contentType
            
        });
        let url=await getSignedUrl(client,object);
        return {status:true,url:url,key:process.env.AWS_CLOUDFRONT_DOMAIN_NAME+keyy};

    }
    catch(err){
        return {status:false,error:err.message};
    }

}
export {getUrlinS3,putObjectinS3};