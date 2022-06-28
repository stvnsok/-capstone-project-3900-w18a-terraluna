import React from "react"

interface TextInputProps {
    value: string;
    onValueChange: (value: string) => void
    className?: string;
    title?: string;
    spellcheck?: boolean;
    placeholder?: string;
    password?: boolean;
    addClassName?: string;
} 

const TextInput = ({
    value,
    onValueChange,
    className,
    title,
    spellcheck,
    placeholder,
    password,
    addClassName
}: TextInputProps) => {

    return (
        <React.Fragment>
            <label 
                htmlFor={title ? title+'-input' : undefined}
                className=" w-full mx-auto h-5"
            >
                <span className="cursor-text">{title}</span>
            </label>
            <input
                id={title ? title+'-input' : undefined}
                type={password ? 'password' : 'text'}
                onChange={(e) => {
                    onValueChange(e.target.value);
                }}
                value={value}
                spellCheck={spellcheck ?? false}
                className={className ?? `w-full shadow-md mx-auto p-3 outline-none cursor-text ${title ? 'mt-2' : ''}  ` + addClassName ?? ''}
                placeholder={placeholder ?? title + '...' ?? ''}
            >
            </input>
        </React.Fragment>
    )
}

export default TextInput