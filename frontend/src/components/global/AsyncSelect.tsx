import React from 'react'
import AsyncSelect from 'react-select/async'

const TLAsyncSelect = <T extends { id: number, name: string }, IsMulti extends boolean = false>({
    value,
    onChange,
    multi,
    excludeHeader,
    header,
    menuText = (value: T) => value.name,
    apiCall,
}: {
    value: IsMulti extends true ? T[] : T;
    onChange: (val: IsMulti extends true ? T[] : T) => void;
    multi? : IsMulti;
    excludeHeader?: boolean | undefined;
    header?: string;
    menuText: (value: T) => string;
    apiCall: (query: string) => Promise<T[]>
}) => {
    const promiseOptions = (query: string, callback: (options: T[]) => void) => {
        apiCall(query).then(res => {
            callback(res);
        })
    }

    return <div>
        {!excludeHeader && <label className='text-md font-medium'>{header}{multi ? 's' : ''}</label>}
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
        />
    </div>
}

export default TLAsyncSelect;