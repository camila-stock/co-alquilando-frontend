import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Card, notification, Avatar, Modal } from "antd";
import ApiRequest from "../../util/ApiRequest";
import Notification from "../../classes/Notification";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { SessionContext } from "../../store";

const { Meta } = Card;

let notification_types = {
  group_decline_invitation: "Invitación Rechazada",
  group_accept_invitation: "Invitación Aceptada",
  group_send_invitation: "Invitación de Grupo",
  group_reject: "El propietario rechazo tu grupo",
  group_delete_member: "Ya no tienes acceso a un grupo",
};

const Description = ({ desc }) => {
  return (
    <div>
      <div>{notification_types[desc]}</div>
    </div>
  );
};

const Name = ({ name, userNickname }) => {
  return <Link to={`profile/${userNickname}`} replace>{name}</Link>
};

const Close = ({ id, setNotifications, notifications }) => {
  const { confirm } = Modal;

  function showConfirm() {
    confirm({
      title: "¿Quieres eliminar esta notificación?",
      icon: <ExclamationCircleOutlined />,
      content: "No se volverá a mostrar en el listado de notificaciones",
      okType: "danger",
      okText: "Confirmar",
      cancelText: "Cancelar",
      onOk() {
        deleteNotification();
      },
      onCancel() {},
    });
  }

  const deleteNotification = async () => {
    await ApiRequest.delete(`/notifications/${id}`);
    setNotifications(notifications?.filter((n) => n.id !== id));
  };

  return (
    <span onClick={showConfirm}>
      <div className="NotificationClose">X</div>
    </span>
  )
};

const NotificationCard = (props) => {
  const { state } = useContext(SessionContext);
  const response = async (type) => {
    let groupID = await props.notificationAttributes.find(
      (a) => a.attributeType === "groupId"
    );

    if (type !== "group_send_invitation") {
      let bodyReqResp = {
        decision: type === "group_accept_invitation" ? true : false,
        groupId: groupID.value,
      };

      await ApiRequest.put(`/user/${state.user.id}/invite`, bodyReqResp);

      await ApiRequest.delete(`/notifications/${props.id}`);
      props.setNotifications(
        props.notification?.filter((n) => n.id !== props.id)
      );
    }

    let bodyReq = new Notification(props.to, props.from, type);
    await ApiRequest.post("/notifications/send", bodyReq);
    notification.success({
      message: `¡Tu respuesta fue enviada con éxito!`,
      placement: "bottomLeft",
    });
  };

  const actions = {
    group_send_invitation: [
      <span
        onClick={() => {
          response("group_decline_invitation");
        }}
      >
        <span>Cancelar</span>
      </span>,
      <span
        onClick={() => {
          response("group_accept_invitation");
        }}
      >
        <span style={{color:"#0098ff"}}>Confirmar</span>
      </span>,
    ],
  };

  return (
    <Card
      hoverable
      className={`notificationCard ${props.type}`}
      actions={actions[props.type]}
    >
      <Meta
        avatar={
          <Avatar
            src={props.userFrom.photo?.photoId}
            style={{ backgroundColor: "#AED6F1", color: "#154360" }}
          >
            {" "}
            {props.userFrom.userName[0].toUpperCase()}{" "}
          </Avatar>
        }
        title={
          <div>
            <Name
              name={props.userFrom.userName + " " + props.userFrom.userSurname}
              userNickname={props.userFrom.userNickname}
            />
            {/* antes validabamos si el type = group_send_invitation para mostrar el close. why? idk. se lo saqué */}
              <Close
                notifications={props.notifications}
                setNotifications={props.setNotifications}
                id={props.id}
              />
          </div>
        }
        description={<Description desc={props.type} />}
      />
    </Card>
  );
};

export default NotificationCard;
