import React, { useState, useContext } from 'react';
import ContentWrapper from '../../components/ContentWrapper';
import AdminMenuReports from '../../components/AdminMenuReports';
import { SessionContext } from '../../store';
import ApiRequest from '../../util/ApiRequest';
import FilterNav from '../../components/FilterNav';

const items = [
	'Métricas de Propiedades',
	'Métricas de Paquetes Contratados',
];

const Metrics = () => {

	const [metric, setMetric] = useState();
	const { state } = useContext(SessionContext);
	const breadscrumb = [{'Mis Reportes': '/reports'}]

	const handleSearch = async dates => {
			const allData = true;
			const [ from, to ] = dates.map( f => f.split("T")[0]);
			const body = { allData, from, to };
			const allProm = await Promise.all([
				ApiRequest.post(`metrics/user/${state.user.id}/properties`, body),
				ApiRequest.post(`metrics/user/${state.user.id}/packages`, body),
			]);
			const data = allProm.map( prom => prom.data);
			setMetric(data);
	}

	return (
			<ContentWrapper topNav breadscrumb={breadscrumb}>
					<div className="page reports-admin">
							<FilterNav onSearch={handleSearch} />
							<AdminMenuReports data={metric} items={items} />
					</div>
			</ContentWrapper>
	);
};

export default Metrics;
