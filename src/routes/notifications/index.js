import React, { useState, useEffect, useContext } from "react";
import { SessionContext } from "../../store";
import ApiRequest from "../../util/ApiRequest";
import ContentWrapper from "../../components/ContentWrapper";
import NotificationCard from "../../components/NotificationCard";
import WaitingSelection from '../../components/WaitingSelection';
import Spin from '../../components/Spin';
import { BellOutlined } from '@ant-design/icons';

const Notifications = (props) => {
  const { state } = useContext(SessionContext);
  const [notifications, setNotifications] = useState();
  const breadscrumb = [{ Notificaciones: "/notifications" }];

  useEffect(() => {
    if (notifications) return;
    let asyncGet = async () => {
      let { data } = await ApiRequest.get(
        `/notifications/user/${state.user.id}`
      );
      setNotifications(data);
    };
    asyncGet();
  }, [state.user.id, notifications]);

  return (
    <ContentWrapper topNav footer breadscrumb={breadscrumb}>
      <div className="notifications">

        {!notifications ? <Spin /> : null}
        
        {notifications?.map((n) => {
          return (
            <NotificationCard
              key={n.id}
              {...n}
              setNotifications={setNotifications}
              notifications={notifications}
            />
          );
        })}

        {notifications && !notifications?.length ? (
          <div className="no-groups">
            <WaitingSelection  message="No tienes notificaciones" render={true} icon={<BellOutlined />} />
          </div>
        ):null}

      </div>
    </ContentWrapper>
  );
};

export default Notifications;
