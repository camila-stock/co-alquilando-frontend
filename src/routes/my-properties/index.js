import React, { useEffect, useState, useContext } from "react";
import { notification } from 'antd';
import { SessionContext } from '../../store';
import ApiRequest from "../../util/ApiRequest";
import ContentWrapper from "../../components/ContentWrapper";
import PropertyCard from '../../components/PropertyCard';
import PackagePropertyInfo from '../../components/PackagePropertyInfo';
import Spin from '../../components/Spin';


const Property = () => {
    const breadscrumb = [{'Mis Propiedades': '/my-properties'}]
    const [datos, setDatos] = useState()
    const {state} = useContext(SessionContext);
    console.log("user", state.user)

    useEffect(() => {
      let asyncGet = async () => {
          try {
              let{data} = await ApiRequest.get(`/property/properties/owner/${state.user.id}`);
              setDatos(data)
          } catch (e) {
              notification.error({
                  message: `Error al obtener propiedades`,
                  placement: 'bottomLeft'
              });
          }
      }
      asyncGet()
    }, [state])

  return (
    <ContentWrapper topNav breadscrumb={breadscrumb}>
      <div className="contentMyProperties">

        <PackagePropertyInfo count={state.user.propertiesToPost} />

        <div className="propiedades">
          {!datos ? <Spin /> : null}

          {datos?.length
          ? datos.map((p) => {
              return <PropertyCard key={p.id} {...p} />;
            })
          : null}

          {datos && !datos.length ? (
            <div className="no-properties">No tienes ninguna propiedad publicada. Carga tu propiedad <a href="/property">aquí</a></div>
          ) :null}
        </div>

      </div>
    </ContentWrapper>
  );
};

export default Property;
