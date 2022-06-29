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

instance.interceptors.request.use( (config) => {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
        const header = { Authorization: 'Bearer ' + localStorage.getItem('access_token') }
        config.headers = { ...config.headers, ...header }
    }
    return config
})

export { instance as api }