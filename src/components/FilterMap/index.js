import React, { useState, useCallback, useEffect } from 'react';
import './FilterMap.scss';
import MapMultiple from '../MapMultiple';
import Spin from '../Spin';

const FilterMap = ({properties, selected, onFilter, seeOnMap}) => {
    const [ currentPosition, setCurrentPosition ] = useState({ lat: null, lng:null});
    const [ loadingMap, setLoadingMap ] = useState(false);

	const getCurrentPosition = useCallback(() => {
        setLoadingMap(true)
        if (currentPosition.lat && currentPosition.lng ) {
            setCurrentPosition({ lat: null, lng:null})
            setLoadingMap(false);
            return
        }
        navigator.geolocation.getCurrentPosition(({ coords }) => {
            console.log(coords);
            setCurrentPosition({ lat: coords.latitude, lng: coords.longitude });
            setLoadingMap(false);
            onFilter({ lat: (coords.latitude).toFixed(2) });
        });
    }, [currentPosition, onFilter])

    useEffect(()=> {
        if (currentPosition.lat) return
        getCurrentPosition()
    },[currentPosition, getCurrentPosition])
    

	return (
        <>
		<div className="filter-map-wrapper">

            {loadingMap ? (
                <div className='spin-filter-map'>
                    <Spin />
                </div>) 
            : null }
            
			{currentPosition.lat && currentPosition.lng ? (
                <div className="map-wrapper">
                    <MapMultiple
                        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDzoLTHAJKj5xymA3iBqJxxQl-MYG9R_ag"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `auto`, width: `auto` }} />}
                        mapElement={<div style={{ height: `auto` }} />}
                        zoomLevel={10}
                        currentPosition={currentPosition}
                        properties={properties}
                        selected={selected}
                        seeOnMap={seeOnMap}
                    />
                </div>
			) : null}
		</div>
        </>
	);
};

export default FilterMap;
