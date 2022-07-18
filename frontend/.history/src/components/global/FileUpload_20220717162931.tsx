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
    const dataURLPromise = new Promise ((resolve, reject) => {
        reader.onerror = reject; 
        reader.onload = () => resolve(reader.result);
    })
    reader.readAsDataURL(file);
    return dataURLPromise;
}