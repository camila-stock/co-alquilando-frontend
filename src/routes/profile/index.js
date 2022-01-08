import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import ApiRequest from "../../util/ApiRequest";
import ContentWrapper from "../../components/ContentWrapper";
import ModalGroup from "../../components/ModalGroup";
import Spin from "../../components/Spin";
import calculateAge from "../../util/CalculateAge";
import hostname from "../../util/getHostName";

const image =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

let genders = {
  MALE: "Masculino",
  FEMALE: "Femenino",
  OTHER: "Otro",
};

const Profile = (props) => {
  let { nickname } = useParams();
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    if (!datos) {
      const getUser = async () => {
        const { data } = await ApiRequest.get(`/user/${nickname}`);
        let attr = [];
        if (data.attributes) {
          data.attributes.forEach((t) => {
            attr = { ...attr, [t.attributeType]: t.value };
          });
        }
        setDatos({ ...data, attributes: attr });
      };
      getUser();
    }
  }, [nickname, datos]);

  return (
    <ContentWrapper topNav footer>
      {!datos ? <Spin /> :null}

      {datos ? (
        <div className="profileContent">
          <div className="profileGroup2">
            <div className="imageContent">
              <img
                alt="imagen de perfil"
                src={datos?.photos ? `${hostname}/user/${datos.id}/photos/${datos.photos[0]}`
                : image}
                className="profileImage"
              />
            </div>
            <div className="profileMainData">
              <h2>
                <strong>
                  {datos.userName} {datos.userSurname}
                </strong>
              </h2>
              <h4>
              {datos.attributes.nationality}{datos.attributes.city && `- ${datos.attributes.city}`}
              </h4>
            
            <div>
              <p>
                <b>Nickname:</b> {nickname}
              </p>
            </div>
            <div>
              <p>
              {genders[datos.attributes.sex] && <b>Sexo:{genders[datos.attributes.sex]}</b>}
              </p>
            </div>
            <div>
              <p>
              {datos?.userBirthDate && <b>Edad: {calculateAge(datos.userBirthDate)}</b>}
              </p>
            </div>
            </div>
          </div>
          <div className="profileButton">
            <Button><ModalGroup user={datos} itemTitle="name" /></Button>
          </div>
        </div>
      ) : null}

      {datos && datos.attributes ? (
        <div className="profileContent">
          <h3>Acerca de</h3>
          <div className="profileGroup2">
            {datos.attributes.pets === "true" ? (
              <p>Tengo mascotas</p>
            ) : (
              <p>No tengo mascotas</p>
            )}
            {datos.attributes.occupation ? (
              <p>Ocupación: {datos.attributes.occupation} </p>
            ) : (
              <p>Sin Ocupación</p>
            )}
          </div>
        </div>
      ) : null}

      {datos && datos.userDescription ? (
        <div className="profileContent">
          <h3>Más sobre {datos.userName}</h3>
          {datos.userDescription}
        </div>
      ) : null}
    </ContentWrapper>
  );
};

export default Profile;
