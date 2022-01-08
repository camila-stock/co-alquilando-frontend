import React, { useEffect, useState, useContext } from "react";
import { useRouteMatch } from "react-router";
import { SessionContext } from "../../store";
import { Button } from "antd";
import ApiRequest from "../../util/ApiRequest";
import ContentWrapper from "../../components/ContentWrapper";
import Spin from "../../components/Spin";
import calculateAge from "../../util/CalculateAge";
import { Link } from "react-router-dom";
import hostname from "../../util/getHostName";

const image =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

let genders = {
  MALE: "Masculino",
  FEMALE: "Femenino",
  OTHER: "Otro",
};

const MyProfile = (props) => {
  const { state } = useContext(SessionContext);
  const [datos, setDatos] = useState(null);
  const [photosUpdate, setPhotosUpdate] = useState(null);
  const { path } = useRouteMatch();

  useEffect(() => {
    if (!datos) {
      const getUser = async () => {
        const { data } = await ApiRequest.get(
          `/user/${state.user.userNickname}`
        );
        let attr = [];
        data.attributes.forEach((t) => {
          attr = { ...attr, [t.attributeType]: t.value };
        });
        setDatos({ ...data, attributes: attr });
        setPhotosUpdate(data.photos);
      };
      getUser();
    }
  }, [state, datos]);

  return (
    <ContentWrapper topNav footer>
      <div style={{padding:'20px 0'}}>

      {!datos ? <Spin /> :null}

      {datos ? (
        <div className="profileContent">
          <div className="profileGroup2">
            <div className="imageContent">
              <img
                alt="imagen de perfil"
                src={ 
                  (state.user.id && photosUpdate?.length) 
                    ? `${hostname}/user/${state.user.id}/photos/${photosUpdate}`
                    : image
                }
                className="profileImage"
              />
            </div>
            <div className="profileMainData">
              <h1>
                <strong>
                  {datos.userName} {datos.userSurname}
                </strong>
              </h1>
              <h3>
                {datos.attributes.nationality}{datos.attributes.city && `- ${datos.attributes.city}`}
              </h3>
              <div>
                <p>
                  <b>Nickname:</b> {state.user.userNickname}
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
            <Button className="buttonEdit">
              <Link to="/my-profile/update">Editar Datos</Link>
            </Button>
            <Button className="buttonEdit">
              <Link to="/my-profile/updatePreferencies">Editar Preferencias</Link>
            </Button>
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
          <h3>Más sobre {path === "/my-profile" ? "mi" : datos.userName}</h3>
          {datos.userDescription}
        </div>
      ) : null}
      </div>
    </ContentWrapper>
  );
};

export default MyProfile;
