import axios from 'axios';
import qs from 'qs';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:5000',
    headers: {
        'content-type': 'application/json',
        accept: 'application/json',
    },
    paramsSerializer: (parameters) => 
        qs.stringify(parameters, { arrayFormat: 'brackets' })
})

export { instance as api }
