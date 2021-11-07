import axios from 'axios';

const url = {
    local: "http://localhost:8080",
    pwa: "http://192.168.0.5:8080",
    aws: "https://ec2-34-219-1-255.us-west-2.compute.amazonaws.com:8080",
}

export default axios.create({
    baseURL: url.local,
    headers:{
        'Content-Type':'application/json'
    }
})

