import { toast } from 'react-toastify';


export default function FileUpload (file: File) {
    if ( !file ) {
        return; 
    }
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/mpeg'];
    const valid = validFileTypes.find((type) => type === file.type);
    if (!valid) {
        toast.error("The file type is not supported");
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        return reader.result;
    }
}