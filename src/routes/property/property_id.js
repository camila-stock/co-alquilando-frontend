import React from 'react'
import { useParams } from 'react-router-dom';

const PropertyId = props => {
    let {idProperty} = useParams();
    console.log(idProperty);
    return (
        <div>
            Property Update: {idProperty}
        </div>
    )
}

export default PropertyId;