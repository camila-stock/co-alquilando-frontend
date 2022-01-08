import axios from 'axios';
import hostname from './getHostName';

export default axios.create({
    baseURL: hostname,
    headers:{
        'Content-Type':'application/json'
    }
})

