import React from 'react';

interface ImageProps {
    src:string
}

export default function FileUpload({src}:ImageProps) {
    return (
        <div>
            <img src={src}/>
        </div>
    )
}
