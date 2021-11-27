import React, { useState, useContext } from 'react';
import ContentWrapper from '../../components/ContentWrapper';
import AdminMenuReports from '../../components/AdminMenuReports';
import { SessionContext } from '../../store';
import ApiRequest from '../../util/ApiRequest';
import FilterNav from '../../components/FilterNav';
const items = [
	'Métricas de Usuarios',
	'Métricas de Grupos',
	'Métricas de Propiedades',
	'Métricas de Paquetes Contratados',
	'Métricas de Publicidades'
];
const MetricsAdmin = () => {
	const [ metric, setMetric ] = useState(null);
	const { state } = useContext(SessionContext);
	const breadscrumb = [ { Métricas: '/reports-admin' } ];

	const handleSearch = async (dates) => {
		const allData = true;
		const [ from, to ] = dates.map((f) => f.split('T')[0]);
		const body = { allData, from, to };
		const allProm = await Promise.all([
			ApiRequest.post(`metrics/users`, body),
			ApiRequest.post(`metrics/groups`, body),
			ApiRequest.post(`metrics/properties`, body),
			ApiRequest.post(`metrics/package_purchases`, body),
			ApiRequest.post(`metrics/ads`, body)
		]);
		const data = allProm.map((prom) => prom.data);
		setMetric(data);
	};

	return (
		<ContentWrapper topNav breadscrumb={breadscrumb}>
			<div className="page reports-admin">
				<FilterNav onSearch={handleSearch} />
				<AdminMenuReports data={metric} items={items} />
			</div>
		</ContentWrapper>
	);
};

export default MetricsAdmin;
