import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { notification, Pagination } from 'antd';
import ApiRequest from '../../util/ApiRequest';
import ContentWrapper from '../../components/ContentWrapper';
import PropertyCard from '../../components/PropertyCard';
import Spin from '../../components/Spin';
import Filters from '../../components/Filters';
import WaitingSelection from '../../components/WaitingSelection';
import AdImage from '../../components/Ad/AdImage';

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
    <ContentWrapper topNav footer optionsNav>
      <AdImage position="horizontal" />
	  
      <div className="properties-wrapper">
        <div className="filters">
          <div className="map-filter">
            <span>Buscar por mi ubicación</span>
            <Link to={`/properties-on-map`}>Ver en mapa</Link>
          </div>

          <Filters title="Filtros" onFilter={setParams} />
        </div>

        <div className="list">
          <div className="contentPL">
            {!datos && <Spin />}

            {datos?.content.map((p) => {
              return <PropertyCard key={p.id} {...p} />;
            })}

            {datos && !datos?.content.length ? (
              <WaitingSelection message="No se encontraron propiedades" />
            ) : null}
          </div>

          <div className="pagination">
            <Pagination
              current={page}
              onChange={onChange}
              total={datos?.totalElements}
              pageSize={size}
            />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Property;
