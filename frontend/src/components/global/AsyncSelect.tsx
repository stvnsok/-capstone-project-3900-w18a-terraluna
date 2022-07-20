import React from 'react'
import AsyncSelect from 'react-select/async'
import Select from 'react-select';

const TLSelect = <T extends { id: number, name: string }, IsMulti extends boolean = false, IsAsync extends boolean = false>({
    value,
    onChange,
    multi,
    excludeHeader,
    header,
    menuText = (value: T) => value.name,
    isAsync,
    options,
    apiCall,
}: {
    value: IsMulti extends true ? T[] : T;
    onChange: (val: IsMulti extends true ? T[] : T) => void;
    multi? : IsMulti;
    excludeHeader?: boolean | undefined;
    header?: string;
    menuText?: (value: T) => string;
    isAsync?: IsAsync;
    options?: IsAsync extends false ? T[] : undefined;
    apiCall?: (query: string) => Promise<T[]>
}) => {
    const promiseOptions = (query: string, callback: (options: T[]) => void) => {
        if (apiCall) {
            apiCall(query).then(res => {
                callback(res);
            })
        }
    }

    return <div>
        {!excludeHeader && <label className='text-md font-medium'>{header}{multi ? 's' : ''}</label>}
        {isAsync ? 
        <AsyncSelect
            isMulti={multi}
            value={value}
            styles={{
                multiValue: (styles) => {
                    return {
                        ...styles,
                        color: '#FFF',
                        background: '#A8F59B'
                    }
                }
            }}
            loadOptions={promiseOptions}
            getOptionLabel={e => menuText(e)}
            getOptionValue={e => `${e.id}`}
            onChange={(e) => {
                onChange(e as IsMulti extends true ? T[] : T);
            }}
        /> : 
        <Select
                isMulti={multi}
                value={value}
                styles={{
                    multiValue: (styles) => {
                        return {
                            ...styles,
                            color: '#FFF',
                            background: '#A8F59B'
                        }
                    }
                }}
                options={options as T[]}
                getOptionLabel={e => menuText(e)}
                getOptionValue={e => `${e.id}`}
                onChange={(e) => {
                    onChange(e as IsMulti extends true ? T[] : T);
                }}
        />}
    </div>
}

export default TLSelect;