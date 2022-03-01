import React, { useState, useEffect } from 'react';
import ContentWrapper from '../../components/ContentWrapper';
import AdminMenuReports from '../../components/AdminMenuReports';
import ApiRequest from '../../util/ApiRequest';
import FilterNav from '../../components/FilterNav';
const items = [
	'Usuarios',
	'Grupos',
	'Propiedades',
	'Paquetes Contratados',
	'Publicidades'
];
const MetricsAdmin = () => {
	const [ metric, setMetric ] = useState(null);
	const [ error, setError ] = useState(null);
	const breadscrumb = [ { Métricas: '/reports-admin' } ];

	useEffect(() => {
		const allData = true;
		const from = new Date().toISOString(2020);
		const to = new Date().toISOString(2022);
		const body = { allData, from, to };
		try {
			const getProm = async () => {
				const allProm = await Promise.all([
					ApiRequest.post(`metrics/users`, body),
					ApiRequest.post(`metrics/groups`, body),
					ApiRequest.post(`metrics/properties`, body),
					ApiRequest.post(`metrics/package_purchases`, body),
					ApiRequest.post(`metrics/ads`, body)
				]);
				return allProm;
			}
			getProm().then(allProm => {
				const data = allProm.map((prom) => prom.data);
				setMetric(data);
			})
		} catch (error) {
			setError('Hubo un error. Intente con otro rango de fechas.');			
		}
	},[])

	const handleSearch = async (dates) => {
		setMetric(null);
		setError(null);
		const allData = false;
		const [ from, to ] = dates.map((f) => f.split('T')[0]);
		const body = { allData, from, to };
		try {
			const allProm = await Promise.all([
				ApiRequest.post(`metrics/users`, body),
				ApiRequest.post(`metrics/groups`, body),
				ApiRequest.post(`metrics/properties`, body),
				ApiRequest.post(`metrics/package_purchases`, body),
				ApiRequest.post(`metrics/ads`, body)
			]);
			const data = allProm.map((prom) => prom.data);
			setMetric(data);
		} catch (error) {
			setError('Hubo un error. Intente con otro rango de fechas.');			
		}
	};

	return (
		<ContentWrapper topNav breadscrumb={breadscrumb} footer>
			<div className="page reports-admin">
				<FilterNav onSearch={handleSearch} />
				<AdminMenuReports data={metric} items={items} error={error} />
			</div>
		</ContentWrapper>
	);
};

export default MetricsAdmin;
