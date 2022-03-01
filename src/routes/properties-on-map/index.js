import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notification } from 'antd';
import ContentWrapper from '../../components/ContentWrapper';
import FilterMap from '../../components/FilterMap';
import Filters from '../../components/Filters';
import hostname from '../../util/getHostName';
import '../../styles/Properties.scss';
import ApiRequest from '../../util/ApiRequest';

const Property = () => {
	const [ selected, setSelected ] = useState();
	const [ onMap, setOnMap ] = useState();
	const [ page ] = useState(1);
	const [ size ] = useState(-1);
	const [ params, setParams ] = useState();
	const [ result, setResult] = useState()
	const breadscrumb = [
		{ "Listado de propiedades": "/" },
		{ "Mapa": "/properties-on-map" },
	  ];
	
	useEffect(() => {
		let asyncGet = async () => {
			try {
					let { data: { content } } = await ApiRequest.get(`/property/properties`, {page, size,...params});
					setResult(content);
			} catch (e) {
					notification.error({
							message: `Error al obtener propiedades`,
							placement: 'bottomLeft'
					});
			}
	};
	asyncGet();
	},[ page, size, params ]);

	const toggleActions = (id) => {
		let node = document.getElementById(id);
		let act = node.getElementsByClassName('actions');
		act[0].classList.toggle('show');
	};

	const seeOnMap = (id, fromList) => {
		const rest = result.filter((p) => p.id !== id);
		const prop = result.find((p) => p.id === id);
		setSelected(prop);
		if (fromList) setOnMap(prop);
		setResult([ prop, ...rest ]);
		let node = document.getElementById(id);
		let act = node.getElementsByClassName('actions');
		setTimeout(() => act[0].classList.remove('show'), 1300);
	};

	return (
		<ContentWrapper topNav breadscrumb={breadscrumb}>
			<div className="properties-container">
				<FilterMap properties={result} onFilter={setParams} seeOnMap={seeOnMap} selected={onMap} />

				<div className="map-filter-on-map">
					<Link to={`/`}>Ver listado</Link>
				</div>

				<div className="filters-on-map">
					<Filters title="Filtros" onFilter={setParams}/>
				</div>

				{selected ? (
					<section className="properties">
						<div id={selected.id} key={selected.id} className={`property`}>
							<div
								className="detail"
								onBlur={() => toggleActions(selected.id)}
								onClick={() => toggleActions(selected.id)}
							>
								<img
									src={`${hostname}/property/${selected.id}/photos/${selected.photos ? selected.photos[0] : null}`}
									alt={selected.description}
								/>
								<summary>
									<div className="title">{selected.title}</div>
									<div>${selected.price.rentPrice}</div>
									<div>
										{[
											selected.address.street,
											selected.address.neighborhood,
											selected.address.province
										].join(', ')}
									</div>
								</summary>
							</div>
							<div className="actions">
								<Link to={`/property/${selected.id}`}>Ver Detalle</Link>
							</div>
						</div>
					</section>
				) : null}
			</div>
		</ContentWrapper>
	);
};

export default Property;
