import config from '../Config/config.js';
import {  S3Client ,PutObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import logger from "./logger.js";
const getUrlinS3=(keyy)=>{
        const newurl=String(config.AWS_CLOUDFRONT_DOMAIN_NAME)+String(keyy);
        return newurl;
}
const putObjectinS3=async(filename,username,contentType,type)=>{
    try{
        const client = new S3Client({
            region:'ap-south-1',
            credentials:{
                accessKeyId:config.AWS_ACCESS_KEY,
                secretAccessKey:config.AWS_SECRET_KEY
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
        return {status:true,url:url,key:config.AWS_CLOUDFRONT_DOMAIN_NAME+keyy};

    }
    catch(err){
        logger.error(err.message);
        return {status:false,error:err.message};
    }

}
export {getUrlinS3,putObjectinS3};