import { GetObjectCommand, S3Client ,PutObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import moment from "moment";
dotenv.config();
const getUrlinS3=async(keyy)=>{
    try{
        const client = new S3Client({
            region:'ap-south-1',
            credentials:{
                accessKeyId:process.env.AWS_ACCESS_KEY,
                secretAccessKey:process.env.AWS_SECRET_KEY
            }
        });
        
      
        const command=new GetObjectCommand({
            Bucket:"netthreads",
            Key:keyy
        });
        const url=await getSignedUrl(client,command);
        return {url:url,status:true};

    }
    catch(err){
        return {status:false,error:"Invalid keyy"};
    }
}
const putObjectinS3=async(filename,username,contentType)=>{
    try{
        const client = new S3Client({
            region:'ap-south-1',
            credentials:{
                accessKeyId:process.env.AWS_ACCESS_KEY,
                secretAccessKey:process.env.AWS_SECRET_KEY
            }
        });
        
        let datetime=moment().format('YYYY-MM-DD HH:mm:ss');
        let keyy
        if(contentType.startsWith("image/")){
            keyy=`${username}/images/${filename}_${datetime}` 
        }
        else if(contentType.startsWith("video/")){
            keyy=`${username}/videos/${filename}_${datetime}` 

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
        return {status:true,url:url,key:keyy};

    }
    catch(err){
        return {status:false,error:err.message};
    }

}
export {getUrlinS3,putObjectinS3};