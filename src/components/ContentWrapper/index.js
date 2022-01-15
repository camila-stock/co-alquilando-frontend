import React, { useState, useEffect, useContext } from "react";
import { SessionContext } from "../../store";
import ApiRequest from "../../util/ApiRequest";
import Nav from '../../containers/Nav';
import Breadscrumb from '../Breadscrumb';
import OptionsNav from '../../containers/OptionsNav';
import Footer from '../../containers/Footer';


const ContentWrapper = props => {
    const { state } = useContext(SessionContext);
    const [notifications, setNotifications] = useState();
    const userId = state?.user?.id;
    useEffect(() => {
        if (notifications) return;
        let asyncGet = async () => {
          let { data } = await ApiRequest.get(
            `/notifications/user/${userId}`
          );
          setNotifications(data.length);
        };
        asyncGet();
      }, [userId, notifications]);

    return (
        <>

        { props.topNav && <Nav notifications={notifications} />  }
        { props.optionsNav && <OptionsNav /> }
        { props.breadscrumb && <Breadscrumb paths={props.breadscrumb}/> }
        { props.title && <span className="content-wrapper">{props.title}</span> }
        <div style={{minHeight: '80vh', padding: 0}}>
            { props.children }
        </div>
        { props.footer && <Footer />}

        </>
    )
}

export default ContentWrapper;
