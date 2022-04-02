import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Carousel, Tag, notification, Modal, Dropdown, Menu } from "antd";
import {
  SendOutlined,
  TeamOutlined,
  WechatOutlined,
  DownOutlined
} from "@ant-design/icons";
import { SessionContext } from "../../store";
import { useParams } from "react-router";
import ApiRequest from "../../util/ApiRequest";
import Property from "../../classes/Property";
import ClickeableMap from "../ClickeableMap";
import ModalAsyncList from "../ModalAsyncList";

const statusColor = {
  available: "green",
  disabled: "error",
  pre_rented: "orange",
  rented: "error",
};

const Header = ({ status, typology, ownerId }) => {
  const { state } = useContext(SessionContext);
  const { t } = useTranslation();
  const { idProperty } = useParams();
  const { confirm } = Modal;

  const handleOk = async (selected) => {
    let bodyReq = {
      userId: state.user.id,
      propertyId: idProperty,
    };
    try {
      let { data } = await ApiRequest.post(
        `/group/votation/new/${selected.id}`,
        bodyReq
      );
      notification.success({
        message: `Se envió la notificacion al grupo ${data.name} y se registró tu voto.`,
        placement: "bottomLeft",
      });
    } catch (e) {
      notification.error({
        message: `Esta propiedad ya ha sido propuesta en este grupo`,
        placement: "bottomLeft",
      });
    }
  };

  const addChannel = async () => {
    try {
      await ApiRequest.get(
        `/group/user/${state.user.id}/groupName/Mis chats`
      ).then(async ({ data }) => {
        let bodyReq = {
          propertyId: idProperty,
          groupName: state.user.userName + " " + state.user.userSurname,
          adminId: state.user.id
        };
        await ApiRequest.put(`group/owner/channel/${data.id}`, bodyReq).then(() => {
          notification.success({
            message: `Se creo correctamente el chat con el propietario.`,
            placement: "bottomLeft",
          });
        });
      }).catch(e => {
        notification.error({
          message: `Ya tienes un chat con este propietario`,
          placement: "bottomLeft",
        });
      });
    } catch (e) {
      notification.error({
        message: `No se pudo crear el chat con el propietario`,
        placement: "bottomLeft",
      });
    }
  };

  function showConfirm() {
    confirm({
      title: "¿Deseas iniciar un chat con el propietario?",
      icon: <WechatOutlined />,
      content: 'Iniciarás una conversación directamente con el propietario.',
      onOk() {
        addChannel();
      },
      onCancel() {},
      okText: "Confirmar",
      cancelText: "Cancelar",
    });
  }

  const menu = (
    <Menu>
      <Menu.Item key="0" >
      <ModalAsyncList
          label={
            <div>
              <SendOutlined /> Iniciar Votación
            </div>
          }
          title={
            <div>
              <TeamOutlined />
              Seleccione Grupo
            </div>
          }
          endpoint={`/group/available/user/${state.user.id}`}
          itemTitle="name"
          handleOk={handleOk}
          nodata="No tienes grupos creados"
        />
      </Menu.Item>
      { state.user.id !== ownerId ? (
        <Menu.Item key="1">
          <div onClick={showConfirm}>
            <SendOutlined /> Iniciar Conversación
          </div>
        </Menu.Item>
      ):null}
    </Menu>
  );

  return (
    <div className="section header">
      <Tag>{t(typology)}</Tag>
      <Tag color={statusColor[status]}>{t(status)}</Tag>
      {status === "available" ? (<Dropdown overlay={menu} trigger={['click']} placement="bottomCenter">
        <Tag color="#5e83ba">
          Acciones <DownOutlined />
        </Tag>
      </Dropdown>): null }
    </div>
  );
};

const PhotoSection = ({ photos, alt }) => {
  return (
    <div className="section carrousel">
      <Carousel autoplay>
        {photos.map((url) => {
          return <img key={alt} src={url} alt={alt} />;
        })}
      </Carousel>
    </div>
  );
};

const TitleSection = ({ title, description }) => {
  return (
    <div className="section box description">
      <h3>{title}</h3>
      <div>{description} </div>
    </div>
  );
};

const validPrice = (price) => (price ? price : "-");
const PriceSection = ({ services, taxes, expenses, rentPrice }) => {
  return (
    <div className="section box price">
      <span>Precios</span>
      <div className="table price">
        <div>Alquiler</div>
        <div>Expensas</div>
        <div>Servicios</div>
        <div>Impuestos</div>
        <div>${validPrice(rentPrice)}</div>
        <div>${validPrice(expenses)}</div>
        <div>${validPrice(services)}</div>
        <div>${validPrice(taxes)}</div>
      </div>
    </div>
  );
};

const FullAddress = ({
  province,
  neighborhood,
  street,
  tower,
  number,
  floor,
  apartment,
  description,
}) => {
  return (
    <div className="section box fullAddress">
      <span>Dirección</span>
      <div>
        {province}, Bº {neighborhood}
      </div>
      <div>
        {street}, {number}{" "}
      </div>
      <div>
        {tower ? `Torre: ${tower}` : null} {floor}º {apartment}
      </div>
      <div>{description}</div>
    </div>
  );
};

const MapSection = (props) => {
  if (!props.latitude || !props.length)
    return <div className="section box">Geolocalización no disponible</div>;

  return (
    <div className="section map">
      <span>Ver Ubicación</span>
      <ClickeableMap
        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDzoLTHAJKj5xymA3iBqJxxQl-MYG9R_ag"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `auto`, width: `auto` }} />}
        mapElement={<div style={{ height: `auto` }} />}
        zoomLevel={10}
        notClickeable
        {...props}
      />
    </div>
  );
};

const Attributes = ({ attributes }) => {
  const { t } = useTranslation();
  let attrArray = Property.mapJsonToArray(attributes);
  return (
    <div className="section box attributes">
      <span>Comodidades</span>
      {attrArray?.map((attr, index) => {
        return (
          <div key={index} className="row">
            <div>{t(attr.attributeType)}</div>
            <div>{t(attr.value)}</div>
          </div>
        );
      })}
    </div>
  );
};

const PayingLink = ({ payingLink }) => {
  if (!payingLink)
    return <div className="section box">Link de Pago no disponible</div>;
  return (
    <div className="section box payingLink">
      <p>Link de Pago </p>
      <div>
        <a href={payingLink} alt="Link de pago">{payingLink}</a>
      </div>
    </div>
  );
};

const PropertyDetail = (props) => {
  return (
    <div className="propertyDetail">
      <Header status={props.status} typology={props.attributes?.typology} ownerId={props?.ownerId} />
      <PhotoSection photos={props.photos} alt={props.description} />
      <TitleSection title={props.title} description={props.description} />
      <PriceSection {...props.price} />
      <FullAddress {...props.address} />
      <PayingLink payingLink={props.payingLink} />
      <MapSection {...props.address?.coordinates} />
      <Attributes attributes={props.attributes} />
    </div>
  );
};

PhotoSection.defaultProps = {
  photos: [
    "https://omegamma.com.au/wp-content/uploads/2017/04/default-image-720x530.jpg",
    "https://omegamma.com.au/wp-content/uploads/2017/04/default-image-720x530.jpg",
  ],
  alt: "No image",
};

export default PropertyDetail;
