import React from 'react';

export default function FileUpload (element: HTMLInputElement) {
    const file = element.files;
    if ( !file ) {
        return; 
    }
    const reader = new FileReader();
    reader.onload = () => {
        setImage(file);
    }
    reader.readAsDataURL(file);
    return 
}