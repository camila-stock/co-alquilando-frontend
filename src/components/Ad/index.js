import React, { useState, useEffect } from "react";
import { Card, Divider, Button, notification, Modal } from "antd";
import { Link } from "react-router-dom";
import {
  CheckCircleOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import ApiRequest from "../../util/ApiRequest";
import hostname from '../../util/getHostName';
import moment from "moment";

const image = "http://anokha.world/images/not-found.png";

const AdCard = (props) => {
  const [photo, setPhoto] = useState();
  const { confirm } = Modal;

  useEffect(() => {
    let asyncGetPhoto = async () => {
      let photoJSON = {
        caption: "",
        position: "",
        imgUrl: `${hostname}/ad/${props.id}/image/${props.image}`,
      };
      setPhoto(photoJSON);
    };
    if (props.image) {
      asyncGetPhoto();
    } else {
      let photoJSON = {
        caption: "",
        position: "",
        imgUrl: "",
      };
      setPhoto(photoJSON);
    }
  }, [props.id, props.image]);

  const onDelete = async () => {
    await ApiRequest.delete(`/ad/${props.id}`).then((res) => {
      notification.success({
        message: `Publicidad eliminada con éxito`,
        placement: "bottomLeft",
      });
    }).then(async (res) => {
      let { data } = await ApiRequest.get(`/ad`);
      props.setDatos(data);
    });
  };

  const showDelete = () => {
    confirm({
      title: "¿Desea eliminar esta publicidad?",
      icon: <ExclamationCircleOutlined />,
      content: "Si selecciona 'Si', se desactivará la publicidad.",
      okText: "Si",
      okType: "danger",
      cancelText: "No",
      onOk() {
        onDelete();
      },
    });
  };

  return (
    <Card hoverable>
      <div className="pubicity-card--container">
        {props.image ? (
          <div
            className="publicity-card--image"
            style={{ backgroundImage: `url(${photo?.imgUrl})` }}
            key={photo?.position}
            alt={props.client}
          ></div>
        ) : (
          <img
            className="publicity-card--image"
            src={image}
            alt={props.client}
          ></img>
        )}
        <div className="ad-card--content">
          <div className="ad-card--content-title">
            <Link to={`/ad/${props.id}/update`}>{props.client}</Link>
            {props.active ? (
              <CheckCircleOutlined title="Activa" style={{color:"#52c41a"}} />
            ) : null}
          </div>
          <div className="ad-card--content-price">$ {props.price}</div>
          {props.paymentDate && (
            <div className="ad-card--content-paymentDate">
              Fecha de pago: {moment(props.paymentDate).format("DD/MM/YYYY")}
            </div>
          )}
          <div className="ad-card--content-description">
            Desde: {moment(props.startDate).format("DD/MM/YYYY")} - Hasta:{" "}
            {moment(props.endDate).format("DD/MM/YYYY")}
          </div>
          <Divider />
          <div className="ad-card--content-buttons">
            {props.active && <Button danger onClick={showDelete}>
              Desactivar
            </Button>}
            <Link to={`/ad/${props.id}/update`}>
              <Button>
                <EditOutlined title="Editar" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AdCard;
