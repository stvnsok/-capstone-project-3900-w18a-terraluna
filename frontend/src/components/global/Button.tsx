import React from "react";

interface ButtonProps {
    className?: string;
    onClick: () => void;
    text?: string;
}

const Button =  ({
    className,
    onClick,
    text
}: ButtonProps) => {
    return (<button
        className={className + ' hover:opacity-75'}
        onClick={onClick}
    >
        {text ?? ''}
    </button>)
}

export default Button