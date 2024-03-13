import { GetObjectCommand, S3Client ,PutObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import moment from "moment";
dotenv.config();
const client = new S3Client({
    region:'ap-south-1',
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY,
        secretAccessKey:process.env.AWS_SECRET_KEY
    }
});

exports.getUrlinS3=async(keyy)=>{
    try{
      
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
exports.putObjectinS3=async(filename,username,contentType)=>{
    try{
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
        const object=new GetObjectCommand({
            Bucket:"netthreads",
            Key:keyy,
            ContentType:contentType
            
        });
        let url=await getSignedUrl(S3Client,object);
        return {status:true,url:url,key:keyy};

    }
    catch(err){
        return {status:false,error:err.message};
    }

}
