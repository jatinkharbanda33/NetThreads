import  {useState } from "react";
 const useFileUpload = ()=>{
    const [file,setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const handleFileChange = (e)=>{
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFilePreview(URL.createObjectURL(selectedFile)); 
    };
    const clearFile = ()=>{
        setFile(null);
        setFilePreview(null);
    }
    return {file,filePreview,handleFileChange,clearFile,setFilePreview};
}
export default useFileUpload;