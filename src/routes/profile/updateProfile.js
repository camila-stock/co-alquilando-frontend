import React, { useEffect, useState, useContext } from "react";
import { SessionContext, SIGN_IN, SIGN_OUT } from "../../store";
import { useHistory } from "react-router-dom";
import { Form, notification } from "antd";
import CustomizedForm from "../../components/CustomizedForm";
import ApiRequest from "../../util/ApiRequest";
import ContentWrapper from "../../components/ContentWrapper";
import moment from "moment";
import { Auth } from "aws-amplify";
import User from '../../classes/User';
import userData from '../../forms/UPDATE_USER'

const UpdateForm = (props) => {
  const [form] = Form.useForm();
  const [idUser, setIdUser] = useState(null);
  const history = useHistory();
  const { state, dispatch } = useContext(SessionContext);
  const [photosUpdate, setPhotosUpdate] = useState(null);
  const breadscrumb = [
    { "Mi Perfil": "/my-profile" },
    { "Actualizar Mi Perfil": "/my-profile/update" },
  ];

  useEffect(() => {
    let asyncGetUser = async () => {
      await ApiRequest.get(`/user/${state.user.userNickname}`).then((res) => {
        let { data } = res;
        let attributes = {};

        if (data.attributes && data.attributes !== "photos") {
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
        setPhotosUpdate(res.data.photos);
      });
    };
    asyncGetUser();
  }, [form, state, idUser, history]);


  let updateProfile = async fields => {
    let updatePhotoPromise = new Promise( async (res,rej) => {
      try {
        if(!fields.photos || !fields.photos.file) res()
        let plist = fields.photos.file.fileList;
        const formData = new FormData();
        formData.append("type", "file");
        let hasFile = false;
        for (const ph in plist) {
            if (plist[ph].originFileObj) {
              hasFile = true;
              let phLast = plist[ph].originFileObj;
              formData.append("photos", phLast);
            }
        }
        if(!hasFile) res()
        await ApiRequest.multipartPut(`/user/${idUser}/photos`, formData)
        res()
      } catch (error) {
        rej(error)
      }
    })
    updatePhotoPromise.then(()=>{
      let deletePhotoPromise = new Promise( async (res,rej) => {
        try {
          if (!photosUpdate) res()
          photosUpdate.forEach( async photo => {
            if(fields.photos && fields.photos.file?.fileList) {
              let find = fields.photos.file?.fileList.find( t => t.name === photo )
              if(!find){
                  await ApiRequest.delete(`/user/${idUser}/photos/${photo}`)
              }
              res()
            }
          })
          res()
        } catch (error) {
          rej(error)
        }
      })
      deletePhotoPromise.then(()=>{
        let updateDataProfile = new Promise( async (res,rej) => {
          try {
            let user = new User(fields).mapFormToUpdate();
            let { data } = await ApiRequest.put(`/user/${idUser}`, user)
            res(data)
          } catch (error) {
            rej(error)
          }
        })
        updateDataProfile.then( async (data) => {
          notification.success({
            message: `Datos Actualizados con éxito`,
            placement: "bottomLeft",
          })
          if(data.photos?.length > 1){
            data = {...data, photos: [data.photos[1]]}
          }
          await dispatch( SIGN_IN(data) );
          history.push("/my-profile");
        }).catch(e => {
        notification.error({
          message: `Error: No se pudo actualizar sus datos`,
          description: `Hubo un problema al actualizar los datos`,
          placement: "bottomLeft",
        });
      })
      }).catch(e =>{
        notification.error({
          message: `Error: No se pudo actualizar sus datos`,
          description: `Hubo un problema al subir las nuevas fotos`,
          placement: "bottomLeft",
        });
      })
    }).catch(e=>{
      notification.error({
        message: `Error: No se pudo actualizar sus datos`,
        description: `Hubo un problema al eliminar las antiguas fotos`,
        placement: "bottomLeft",
      });
    })

  }

  const onDelete = async () => {
    await ApiRequest.delete(`/user/${idUser}`).then((res) => {
      Auth.signOut();
      dispatch(SIGN_OUT());
      history.push("/");
    });
  };

  return (
    <ContentWrapper topNav  footer breadscrumb={breadscrumb}>
      <CustomizedForm
        form={form}
        data={userData}
        onfinish={updateProfile}
        onDelete={onDelete}
      />
    </ContentWrapper>
  );
};

export default UpdateForm;
