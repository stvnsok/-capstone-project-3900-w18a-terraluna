import React from 'react';

interface DropdownProps {
    ingredient: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ ingredient }) => { 
    return (
        <div>
            <div>{ingredient}</div>
        </div>
    );
}