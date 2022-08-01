import React from 'react'
import CreateRecipeCard from './CreateRecipeCard';
//import { HiX } from 'react-icons/hi';
import Button from '../global/Button';

const RecipeForm = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void
}) => {

    return <div
        className=" bg-tl-inactive-brown min-h-full absolute top-0 right-0 border-l border-solid border-tl-inactive-grey" 
        style={{
            transition: '0.7s',
            width: '90%',
            marginRight: isOpen ? '0' : '-90vw'
        }}>
        <div className='w-full content-center'>
            <CreateRecipeCard/>
        </div>


        <div>
        <Button
            onClick={() => {
                onClose();
            }}
            text={"Go Back"}
            className="mr-8 border border-solid border-tl-active-black bg-tl-inactive-brown px-6 py-3 rounded-md"
        />

        <Button
            onClick={() => {
                // TODO: create recipe
            }}
            text={"Create"}
            className="mr-18 border border-solid border-tl-active-red bg-tl-inactive-green px-6 py-3 rounded-md"
        />
        </div>
    </div>
}

export default RecipeForm;