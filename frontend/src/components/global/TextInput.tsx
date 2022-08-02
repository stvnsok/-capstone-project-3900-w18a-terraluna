import React from "react"

interface TextInputProps {
    value: string;
    onValueChange: (value: string) => void
    className?: string;
    title?: string;
    name?: string;
    spellcheck?: boolean;
    placeholder?: string;
    password?: boolean;
    addClassName?: string;
    numeric?: boolean;
} 

const TextInput = ({
    value,
    onValueChange,
    className,
    title,
    name,
    spellcheck,
    placeholder,
    password,
    addClassName,
    numeric = false
}: TextInputProps) => {

    return (
        <React.Fragment>
            <label 
                htmlFor={title ? title+'-input'+name : undefined}
                className=" w-full mx-auto h-5"
            >
                <span className="cursor-text">{title}</span>
            </label>
            <input
                id={title ? title+'-input'+name : undefined}
                type={password ? 'password' : 'text'}
                onChange={(e) => {
                    onValueChange(e.target.value);
                }}
                value={value}
                spellCheck={spellcheck ?? false}
                className={className ?? `w-full shadow-md rounded-md mx-auto p-3 py-[6.5px] outline-none cursor-text ${title ? 'mt-2' : ''}  ` + addClassName ?? ''}
                placeholder={placeholder ?? title + '...' ?? ''}
                pattern={numeric ? "[0-9]+" : undefined}
                onKeyDown={(e) => {
                    if (!numeric) return;
                    if (numeric && (!/[0-9]/.test(e.key) && e.key !== "Backspace")) e.preventDefault();
                }}
            >
            </input>
        </React.Fragment>
    )
}

export default TextInput