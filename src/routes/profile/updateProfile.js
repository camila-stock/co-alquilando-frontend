import React, { useEffect, useState, useContext } from "react";
import {SessionContext} from '../../store'
import { useHistory } from "react-router-dom";
import { Form, notification } from "antd";
import CustomizedForm from "../../components/CustomizedForm";
import ApiRequest from "../../util/ApiRequest";
import ContentWrapper from "../../components/ContentWrapper";
import moment from "moment";

const userData = {
  name: "user",
  layout: "vertical",
  btnSubmit: "Actualizar Datos",
  fields: {
    primaries: [
      [
        {
          label: "Nombre de usuario",
          name: "userNickname",
          component: "Input",
        },
      ],
      [
        {
          label: "Nombre",
          name: "userName",
          component: "Input",
          required: true,
        },
        {
          label: "Apellido",
          name: "userSurname",
          component: "Input",
          required: true,
        },
      ],
      [
        {
          label: "Email",
          name: "userEmail",
          component: "Input",
          required: true,
        },
        {
          label: "Confirme Email",
          name: "userConfirmEmail",
          component: "Input",
          required: true,
          dependencies: ["userEmail"],
          hasFeedback: true,
          validate: ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue("userEmail") === value) {
                return Promise.resolve();
              }
              return Promise.reject("Los emails no coinciden!");
            },
          }),
        },
      ],
      [
        {
          label: "Fecha de Nacimiento",
          name: "userBirthDate",
          component: "DatePicker",
        },
        {
          label: "Número de Celular",
          name: "userPhone",
          component: "Input",
        },
      ],
      [
        {
          label: "Documento de Identidad",
          name: "userDni",
          component: "Input",
        },
        {
          label: "Sexo",
          name: ["attributes", "sex"],
          component: "Select",
          options: [
            { name: "Femenino", value: "FEMALE" },
            { name: "Masculino", value: "MALE" },
            { name: "Otro", value: "NOT_DEFINED" },
          ],
        },
      ],
      [
        {
          label: "Nacionalidad",
          name: ["attributes", "nationality"],
          component: "Input",
        },
        {
          label: "Ciudad",
          name: ["attributes", "city"],
          component: "Input",
        },
      ],
      [
        {
          label: "Descripción Personal",
          name: "userDescription",
          component: "Input.TextArea",
        },
        {
          label: "Cargar Imagen",
          name: "userPhoto",
          component: "Upload",
        },
      ],
      [
        {
          label: "Preferencias",
          component: "link",
        },
      ]
    ],
  },
};

const UpdateForm = (props) => {
  const [form] = Form.useForm();
  const [fields, setFields] = useState(null);
  const [idUser, setIdUser] = useState(null);
  const history = useHistory();
  const { state } = useContext(SessionContext);
  useEffect(() => {
    let asyncGetUser = async () => {
      await ApiRequest.get(`/user/${state.user.userNickname}`).then((res) => {
        let { data } = res;
        let attributes = {};
        if (data.attributes) {
          data.attributes.forEach((t) => {
            attributes = { ...attributes, [t.attributeType]: t.value };
          });
        }
        let formated = {
          ...data,
          userBirthDate: data.userBirthDate ? moment(data.userBirthDate) : null,
          userConfirmEmail: data.userEmail,
        };
        delete formated.attributes;
        formated = { ...formated, attributes };
        form.setFieldsValue(formated);
        setIdUser(formated.id);
      });
    };
    asyncGetUser();
  }, [form,state]);
  useEffect(() => {
    if (fields) {
      var attributes = Object.entries(fields.attributes);
      let arrayAttributes = [];
      attributes.map((t) => {
       return arrayAttributes.push({ attributeType: t[0], value: t[1] });
      });
      let bodyReq = { ...fields, attributes: arrayAttributes };
      delete bodyReq.userConfirmEmail;
      delete bodyReq.userConfirmPassword;
      let asyncPutUser = async () => {
        await ApiRequest.put(`/user/${idUser}`, bodyReq).then((res) => {
          if (res.status === 200) {
            notification.success({
              message: `Datos Actualizados`,
              placement: "bottomLeft",
            });
            history.push(`/profile/${bodyReq.userNickname}`);
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
  }, [fields, idUser, history]);
  return (
    <ContentWrapper header footer>
      <CustomizedForm form={form} data={userData} onfinish={setFields} />
    </ContentWrapper>
  );
};

export default UpdateForm;
