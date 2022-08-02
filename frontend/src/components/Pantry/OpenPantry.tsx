import React from 'react'
//import { HiX } from 'react-icons/hi';
import PantryCard from './PantryCard';

const OpenPantry = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void
}) => {

    return <div
        className=" bg-tl-inactive-brown overflow-y-auto min-h-screen fixed top-0 right-0 border-l border-solid border-tl-inactive-grey" 
        style={{
            transition: '0.7s',
            width: '40%',
            marginLeft: isOpen ? '0' : '90vw',
            maxHeight: '100vh'
        }}>
        <div className='w-full content-center max-h-screen overflow-y-auto'
        >
            <PantryCard
                closeFunction={onClose}
            />
        </div>
    </div>
}

export default OpenPantry;