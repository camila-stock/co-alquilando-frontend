import React, { useState, useEffect, useContext, useCallback } from 'react';
import PayCard from '../../components/PayCard/index'
import { SessionContext } from "../../store";
import ContentWrapper from "../../components/ContentWrapper";
import "../../styles/PayOptions.css"
import ApiRequest from "../../util/ApiRequest";
import { notification, Spin } from "antd";

const PayOptions = () => {
    const [packages, setPackages] = useState(null)
    const { state } = useContext(SessionContext);

    const color = {
        Basico: "#99A3A4",
        Premium: "#148F77",
        Business: "#D4AC0D"

    }

    const searchPackages = useCallback (async () => {
        try {
            const apiPackages = await ApiRequest.get(`payment/packages/${state.user.id}`)
            setPackages(apiPackages.data)
        } catch (e) {
            notification.error({
                message: `No se pudo conectar con el server`,
                placement: 'bottomLeft'
            });
        }
    }, [state.user.id]);

    useEffect(() => {
        searchPackages()
    }, [searchPackages])

    return (
        <ContentWrapper topNav>
            <div className="contentPayOptions">
                {!!packages ? (packages.map((packagePay, index) => (

                    <PayCard 
                    key={index} 
                    title={packagePay.name}
                     price={packagePay.price} 
                     propertiesAmount={packagePay.quantity} 
                     desc={packagePay.description} 
                     color={color[packagePay.name]} 
                     buyLink={packagePay.link}>

                     </PayCard>
                ))
                ):
                <div className="spiner">

                <Spin size="large" />
                </div>}

            </div>
        </ContentWrapper>
    );


}

export default PayOptions;