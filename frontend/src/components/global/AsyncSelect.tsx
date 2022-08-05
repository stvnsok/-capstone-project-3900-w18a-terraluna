import React from 'react'
import AsyncSelect from 'react-select/async'
import Select from 'react-select';

const TLSelect = <T extends { id: number, name: string }, IsMulti extends boolean = false, IsAsync extends boolean = false>({
    value,
    onChange,
    multi,
    name,
    excludeHeader,
    defaultValue,
    header,
    menuText = (value: T) => value.name,
    isAsync,
    options,
    apiCall,
    apiCallKey,
    placeholder
}: {
    value?: IsMulti extends true ? T[] : T;
    defaultValue?: IsMulti extends true ? T[] : T;
    onChange: (val: IsMulti extends true ? T[] : T) => void;
    multi? : IsMulti;
    name?: string;
    excludeHeader?: boolean | undefined;
    header?: string;
    menuText?: (value: T) => string;
    isAsync?: IsAsync;
    options?: IsAsync extends false ? T[] : undefined;
    apiCall?: (query: string) => Promise<{[key: string] : T[]}>
    apiCallKey?: string
    placeholder?: string
}) => {
    const promiseOptions = (query: string, callback: (options: T[]) => void) => {
        if (apiCall && apiCallKey) {
            apiCall(query).then(res => {
                callback(res[apiCallKey]);
            })
        }
    }


    return <div className='w-full'>
        {!excludeHeader && <label className='text-md font-medium mb-2'>{header}{multi ? 's' : ''}</label>}
        {isAsync ? 
        <AsyncSelect
            name={"select"+header+name}
            isMulti={multi}
            value={value}
            styles={{
                multiValueRemove: (styles) => {
                    return {
                        ...styles,
                        ":hover": {
                            background: '#4BB03A'
                        }
                    }
                },
                multiValue: (styles) => {
                    return {
                        ...styles,
                        color: '#FFF',
                        background: '#A8F59B'
                    }
                },
                container: (styles) => {
                    return {
                        ...styles,
                        marginTop: "8px"
                    }
                }
            }}
            loadOptions={promiseOptions}
            getOptionLabel={e => menuText(e)}
            getOptionValue={e => `${e.id}`}
            onChange={(e) => {
                onChange(e as IsMulti extends true ? T[] : T);
            }}
            placeholder={placeholder ? placeholder : header ? header+"..." : undefined}
        /> : 
        <Select
            name={"select"+header+name}
            isMulti={multi}
            value={value}
            defaultValue={defaultValue}
            styles={
                {multiValueRemove: (styles) => {
                    return {
                        ...styles,
                        ":hover": {
                            background: '#85f772',
                            opacity: '80%'
                        }
                    }
                },
                multiValue: (styles) => {
                    return {
                        ...styles,
                        color: '#FFF',
                        background: '#A8F59B'
                    }
                },
                container: (styles) => {
                    return {
                        ...styles,
                        marginTop: "8px"
                    }
                }
            }}
            options={options as T[]}
            getOptionLabel={e => menuText(e)}
            getOptionValue={e => `${e.id}`}
            onChange={(e) => {
                onChange(e as IsMulti extends true ? T[] : T);
            }}
            placeholder={placeholder ? placeholder :header ? header+"..." : undefined}
        />}
    </div>
}

export default TLSelect;