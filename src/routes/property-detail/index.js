import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApiRequest from '../../util/ApiRequest';
import ContentWrapper from '../../components/ContentWrapper';
import PropertyDetail from '../../components/PropertyDetail';
import Property from '../../classes/Property';

const PropertyDetailRoute = () => {
	let { idProperty } = useParams();
	const [ property, setProperty ] = useState(null);
	let breadscrumb = [
		{ "Listado de Propiedades": "/properties" },
		{ [property?.title] : [property?.id] }
	]

	useEffect(() => {
			let asyncGetUser = async () => {
				let { data } = await ApiRequest.get(`/property/${idProperty}`);
				let formatedProperty = new Property(data).mapResponseToJson();
				setProperty(formatedProperty);
			};
			asyncGetUser();
		},[ idProperty ]);

	return (
			<ContentWrapper topNav breadscrumb={breadscrumb} footer>
				<PropertyDetail {...property} />
			</ContentWrapper>
	);
};

export default PropertyDetailRoute;