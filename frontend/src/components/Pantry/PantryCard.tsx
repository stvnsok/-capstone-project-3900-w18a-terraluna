import React from 'react'
import Button from '../global/Button';
import IngredientSearchBar from './IngredientSearchBar';

export default function PantryCard ({closeFunction}: {
    closeFunction: () => void;
}) {
    return (
        <React.Fragment>
            <div className="flex flex-col justify-center items-center"
                style = {{
                    width: 'calc(50vw)'
                }}
                
            >
                <div className = 'my-auto'>
                    <Button
                        text = {'Close'}
                        onClick = {() => {
                            closeFunction();
                        }}
                    />
                </div>



            </div>

            <div>
                <IngredientSearchBar />
            </div>
            
        </React.Fragment>
    )
}