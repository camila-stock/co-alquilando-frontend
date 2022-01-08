import { useState, useEffect } from 'react';
import ApiRequest from '../util/ApiRequest';
import { notification } from 'antd';

export const useFetch = ( endpoint, params, dependencies ) => {
    const [ result, setResult] = useState()
    const [ error, setError] = useState()

    useEffect(() => {
        let asyncGet = async () => {
            try {
                let { data: { content } } = await ApiRequest.get(endpoint, params);
                setResult(content);
            } catch (e) {
                setError(e)
                notification.error({
                    message: `Error al obtener propiedades`,
                    placement: 'bottomLeft'
                });
            }
        };
        asyncGet();
    }, [dependencies, endpoint, params]);

    return [result, setResult, error]
}
