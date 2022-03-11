import React, { useState, useEffect, useContext } from 'react';
import ContentWrapper from '../../components/ContentWrapper';
import AdminMenuReports from '../../components/AdminMenuReports';
import { SessionContext } from '../../store';
import ApiRequest from '../../util/ApiRequest';
import FilterNav from '../../components/FilterNav';

const items = [
	'Propiedades',
	'Paquetes Comprados',
];

const Metrics = () => {

	const [metric, setMetric] = useState();
	const [error, setError] = useState();
	const { state } = useContext(SessionContext);
	const breadscrumb = [{'Mis Reportes': '/reports'}];

	useEffect(() => {
		const allData = true;
		const from = new Date().toISOString(2020);
		const to = new Date().toISOString(2022);
		const body = { allData, from, to };
		const getProms = async () => {
			const allProm = await Promise.all([
				ApiRequest.post(`metrics/user/${state.user.id}/properties`, body),
				ApiRequest.post(`metrics/user/${state.user.id}/packages`, body),
			]);
			return allProm;
		}
		getProms().then((allProm) => {
			const data = allProm.map((prom) => prom.data);
			setMetric(data);
		});
	},[state.user.id])

	const handleSearch = async dates => {
			setMetric(null);
			setError(null);
			const allData = false;
			const [ from, to ] = dates.map( f => f.split("T")[0]);
			const body = { allData, from, to };
			try {
				const allProm = await Promise.all([
					ApiRequest.post(`metrics/user/${state.user.id}/properties`, body),
					ApiRequest.post(`metrics/user/${state.user.id}/packages`, body),
				]);
				const data = allProm.map( prom => prom.data);
				setMetric(data);
			} catch (error) {
				setError('Hubo un error. Intente con otro rango de fechas.');			
			}
	}

	return (
			<ContentWrapper topNav breadscrumb={breadscrumb} footer>
					<div className="page reports-admin">
							<FilterNav onSearch={handleSearch} />
							<AdminMenuReports data={metric} items={items} error={error}/>
					</div>
			</ContentWrapper>
	);
};

export default Metrics;
