import React from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import housePin from '../../assets/Icons/house-pin.svg'

const ClickeableMap = ({google, properties, selected, currentPosition, seeOnMap}) => {

    return (
        <Map 
            initialCenter={currentPosition} 
            google={google} 
            zoom={14} 
            className="map"
                >

                <Marker
                    key='currentPosition' 
                    id='currentPosition'
                    position={currentPosition}
                    />

                {selected ? (
                    <Marker 
                        key={selected.id} 
                        position={ { lat: selected.address.coordinates.latitude, lng: selected.address.coordinates.length } } 
                        />
                ) : (
                    properties?.map( 
                        ({ id, address : { coordinates } }) => (
                            <Marker 
                                key={id} 
                                id={id}
                                position={ { lat: coordinates?.latitude, lng: coordinates?.length } } 
                                onClick={() => seeOnMap(id, false)} 
                                icon={{
                                    url: housePin,
                                    anchor: new google.maps.Point(70 / 4, 94 / 2 - 5),
                                    size: new google.maps.Size(70 / 2, 94 / 2),
                                    scaledSize: new google.maps.Size(70 / 2, 94 / 2),
                                }}
                                />
                    ))
                )}
        </Map>
    )
}


export default GoogleApiWrapper({
    apiKey: ('AIzaSyDzoLTHAJKj5xymA3iBqJxxQl-MYG9R_ag')
})(ClickeableMap)