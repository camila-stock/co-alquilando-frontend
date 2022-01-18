import React, { useEffect, useState, useContext } from "react";
import { notification } from 'antd';
import { SessionContext, SIGN_IN } from '../../store';
import ApiRequest from "../../util/ApiRequest";
import ContentWrapper from "../../components/ContentWrapper";
import PropertyCard from '../../components/PropertyCard';
import PackagePropertyInfo from '../../components/PackagePropertyInfo';
import Spin from '../../components/Spin';
import { HomeOutlined } from '@ant-design/icons';
import WaitingSelection from '../../components/WaitingSelection';


const Property = () => {
  const { state, dispatch } = useContext(SessionContext);
  const [ user, setUser] = useState();
  const [ datos, setDatos] = useState();
  const breadscrumb = [{'Mis Propiedades': '/my-properties'}]

  useEffect(() => {
    if(user) return
    const getUser = async () => {
      await ApiRequest.get(`user/${state.user.userNickname}`)
      .then( ({data}) => {
        setUser(data)
      })
    }
    getUser()
  }, [user, state])

  useEffect(()=>{
    if(!user) return
    dispatch( SIGN_IN(user) )
  },[user, dispatch])

  useEffect(() => {
    let asyncGet = async () => {
        try {
            let {data} = await ApiRequest.get(`/property/properties/owner/${state.user.id}`);
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
    <ContentWrapper topNav footer breadscrumb={breadscrumb}>
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
            <div className="no-groups">
              <WaitingSelection  message="No tienes ninguna propiedad publicada" render={true} icon={<HomeOutlined />} />
            </div>
          ) :null}
        </div>

      </div>
    </ContentWrapper>
  );
};

export default Property;
