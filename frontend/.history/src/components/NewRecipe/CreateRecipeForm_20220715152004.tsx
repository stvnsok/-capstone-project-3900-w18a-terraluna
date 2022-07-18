import React from 'react'
import CreateRecipeCard from './CreateRecipeCard';
//import { HiX } from 'react-icons/hi';
import Button from '../global/Button';

const RecipeForm = ({
    //recipe,
    onClose
}: {
    //recipe?: Recipe;
    onClose: () => void
}) => {

    return <div className=" bg-tl-inactive-white min-h-full absolute top-0 right-0 border-l border-solid border-tl-inactive-grey" style={{
        transition: '0.7s',
        width: '90%',
        marginRight:'-90vw'

    }}>
        {/* <div><HiX className='ml-4 cursor-pointer text-tl-inactive-grey' size={50} onClick={onClose}/></div> */}
        <div className='justify-between flex'>
            <CreateRecipeCard/>
        </div>


        <div>
        <Button
            onClick={() => {
                onClose();
            }}
            text={"Cancel"}
            className="mr-4 border border-solid border-tl-active-black bg-tl-inactive-white px-6 py-3 rounded-md"
        />

        <Button
            onClick={() => {
                // TODO: create recipe
            }}
            text={"Create"}
            className="mr-16 border border-solid border-tl-active-red bg-tl-inactive-green px-6 py-3 rounded-md"
        />
        </div>
    </div>
}

export default RecipeForm;