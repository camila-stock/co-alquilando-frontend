import React, { useEffect, useState } from 'react';
import { notification, Pagination } from 'antd';
import ApiRequest from '../../util/ApiRequest';
import ContentWrapper from '../../components/ContentWrapper';
import PropertyCard from '../../components/PropertyCard';
import Spin from '../../components/Spin';
import Filters from '../../components/Filters';
import FilterMap from '../../components/FilterMap';
import WaitingSelection from '../../components/WaitingSelection'
import '../../styles/Properties.scss';

const Property = () => {
	const [ datos, setDatos ] = useState(null);
	const [ page, setPage ] = useState(1);
	const [ size ] = useState(9);
	const [params, setParams] = useState();
	const onChange = page => setPage(page);

	useEffect(() => {
			let asyncGet = async () => {
				try {
					let { data } = await ApiRequest.get(`/property/properties`, { page: page -1, size, ...params });
					setDatos(data);
				} catch (e) {
					notification.error({
                        message: `Error al obtener propiedades`,
						placement: 'bottomLeft'
					});
				}
			};
			asyncGet();
		},[ page, size, params ]);

	return (
		<ContentWrapper topNav optionsNav>
			<div className="properties-container">
				<FilterMap />
				<div>
					<div>casa</div>
					<div>casa</div>
					<div>casa</div>
					<div>casa</div>
				</div>
			</div>
		</ContentWrapper>
	);
};

export default Property;
