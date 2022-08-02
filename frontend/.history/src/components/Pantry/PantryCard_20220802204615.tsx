import React from 'react'
import Button from '../global/Button';
import IngredientSearchResult from './IngredientSearchResult';

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
                <IngredientSearchResult />
            </div>
            
        </React.Fragment>
    )
}