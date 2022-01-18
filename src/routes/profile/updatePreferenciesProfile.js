import React, { useEffect, useState, useContext } from "react";
import { SessionContext } from "../../store";
import ContentWrapper from "../../components/ContentWrapper";
import CustomizedForm from "../../components/CustomizedForm";
import { Form, notification } from "antd";
import { useHistory } from "react-router-dom";
import ApiRequest from "../../util/ApiRequest";
import provinces from "../../util/provinces.js";

const userPreferenciesRoomie = {
  name: "user",
  layout: "vertical",
  btnSubmit: "Actualizar Preferencias de Coinquilino",
  fields: {
    primaries: [
      [
        {
          label: "Preferencias de Coinquilino",
          component: "h2",
        },
      ],
      [
        {
          content: [
            "Aquí podras cargar tus preferencias con respecto tus potenciales coinquilinos, para que podamos ayudarte a encontrarlo.",
          ],
          name: ["info"],
          component: "multiple-line",
        },
      ],
      [
        {
          label: "Sexo",
          name: ["roommatePreferences", "sex"],
          component: "Select",
          options: [
            { name: "Femenino", value: "FEMALE" },
            { name: "Masculino", value: "MALE" },
            { name: "Otro", value: "NOT_DEFINED" },
          ],
        },
        {
          label: "Ocupación",
          name: ["roommatePreferences", "occupation"],
          component: "SelectDB",
          endpoint: "/occupation/all",
          search: "occupation",
        },
      ],
      [
        {
          label: "Nacionalidad",
          name: ["roommatePreferences", "nationality"],
          component: "SelectDB",
          endpoint: "/nationality/all",
          search: "nationality",
        },
        {
          label: "Provincia",
          name: ["roommatePreferences", "city"],
          component: "Select",
          options: provinces,
        },
      ],
      [
        {
          label: "Edad",
          name: ["roommatePreferences", "age"],
          component: "slider",
        },
        {
          label: "Mascotas",
          name: ["roommatePreferences", "pets"],
          valuePropName: "checked",
          component: "Checkbox",
        },
      ],
    ],
  },
};


const UpdatePreferenciesForm = (props) => {
  const [formRoom] = Form.useForm();
  const [fieldsRoom, setFieldsRoom] = useState(null);
  const [idUser, setIdUser] = useState(null);
  const history = useHistory();
  const { state } = useContext(SessionContext);
  const breadscrumb = [
    { "Mi Perfil": "/my-profile" },
    { "Mis Preferencias": "/my-profile/updatePreferencies" },
  ];
  useEffect(() => {
    let asyncGetUser = async () => {
      await ApiRequest.get(`/user/${state.user.userNickname}`).then((res) => {
        let { data } = res;
        setIdUser(data.id);
        data = data.preferences;
        let arrayRoommate = [];
        if (data) {
          if (data.roommatePreferences) {
            data.roommatePreferences.attributes.forEach((t) => {
              arrayRoommate.push({ [t.attributeType]: t.value });
            });
            delete data.roommatePreferences;
            let rangeAge = [0, 0];
            arrayRoommate.forEach((t) => {
              if (Object.keys(t)[0] === "minAge") {
                rangeAge[0] = Object.values(t)[0];
              }
              if (Object.keys(t)[0] === "maxAge") {
                rangeAge[1] = Object.values(t)[0];
              } else {
                data = {
                  ...data,
                  roommatePreferences: { ...data.roommatePreferences, ...t },
                };
              }
            });
            data = {
              ...data,
              roommatePreferences: {
                ...data.roommatePreferences,
                age: rangeAge,
              },
            };
            delete data.roommatePreferences.minAge;
            delete data.roommatePreferences.maxAge;
            formRoom.setFieldsValue(data);
          }
        }
      });
    };
    asyncGetUser();
  }, [formRoom, state]);
  useEffect(() => {
    if (fieldsRoom) {
      var preferencesRoomate = Object.entries(fieldsRoom.roommatePreferences);
      preferencesRoomate = preferencesRoomate.filter((t) => t[1]);
      let attributes = [];
      preferencesRoomate.map((a) => {
        if (a[0] === "age") {
          return (attributes = [
            ...attributes,
            { attributeType: "minAge", value: a[1][0] },
            { attributeType: "maxAge", value: a[1][1] },
          ]);
        } else {
          return (attributes = [
            ...attributes,
            { attributeType: a[0], value: a[1], weigth: 0 },
          ]);
        }
      });
      let bodyReq = { attributes };
      let asyncPutUser = async () => {
        await ApiRequest.put(
          `/user/preferences/roommate/${idUser}`,
          bodyReq
        ).then((res) => {
          if (res.status === 200) {
            notification.success({
              message: `Preferencias de Coinquilino Actualizadas`,
              placement: "bottomLeft",
            });
            history.push(`/my-profile`);
          } else {
            notification.error({
              message: `Error: No se pudo actualizar sus datos`,
              placement: "bottomLeft",
            });
          }
        });
      };
      asyncPutUser();
    }
  }, [fieldsRoom, idUser,history]);
  return (
    <ContentWrapper topNav footer breadscrumb={breadscrumb}>
      <CustomizedForm
        form={formRoom}
        data={userPreferenciesRoomie}
        onfinish={setFieldsRoom}
      />
    </ContentWrapper>
  );
};

export default UpdatePreferenciesForm;
