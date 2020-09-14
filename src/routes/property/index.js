import React, { useState, useEffect, useContext } from "react";
import { SessionContext } from "../../store";
import ApiRequest from "../../util/ApiRequest";
import { Form, notification } from "antd";
import CustomizedForm from "../../components/CustomizedForm";
import ContentWrapper from "../../components/ContentWrapper";
import propertyFields from "../../forms/POST_PROPERTY";

const usePostProperty = (values) => {
  const [response, setResponse] = useState(null);
  const { state } = useContext(SessionContext);

  useEffect(() => {
    if (values) {
      values.address = { ...values.address, coordinates: values.coordinates };
      delete values.coordinates;
      let atributos = Object.entries(values.attributes);
      console.log("values", values);
      console.log("atributos", atributos);
      const attributesFormate = atributos.map((a) => {
        let json = {
          attributeType: a[0],
          value: a[1] ? a[1] : "",
          weigth: 0,
        };
        return json;
      });

      let formatedBody = {
        ...values,
        attributes: attributesFormate,
        ownerId: state.user.id,
        status: "available",
      };

	  let bodyReq = formatedBody;
	  delete bodyReq.photos

      let createProperty = new Promise(async (res, rej) => {
        try {
          let ok = await ApiRequest.post("/property", bodyReq);
          res(ok);
        } catch (e) {
          rej(e);
        }
      });

      createProperty.then((property) => {
        console.log("Property ->", property, "Body request ->", bodyReq);

        if (values && values.photos) {
          var plist = values.photos.file.fileList;

          const formData = new FormData();
          formData.append("type", "file");
          for (const ph in plist) {
            console.log(plist[ph].originFileObj);
            let phLast = plist[ph].originFileObj;

            formData.append("photos", phLast);
          }

          let header = {
            "Content-Type": "multipart/form-data",
          };

          let asyncPutPhoto = async () => {
            await ApiRequest.multipartPut(
              `/property/${property.data.id}/photos`,
              formData,
              header
            ).then((res) => {
			  console.log(res);
			  setResponse(res)
              if (res.status === 200) {
                notification.success({
                  message: `Datos Actualizados`,
                  placement: "bottomLeft",
                });
              } else {
                notification.error({
                  message: `Error: No se pudo actualizar sus datos`,
                  placement: "bottomLeft",
                });
              }
            });
          };
          asyncPutPhoto();
        }
      });
    }
  }, [values, state]);
  return response;
};

const Property = () => {
  const [values, setValues] = useState(null);
  const [form] = Form.useForm();

  let property = usePostProperty(values);
  console.log("asdasdasda", values);
  useEffect(() => {
    if (property) {
      console.log(property);
      notification.success({
        message: `Propiedad Publicada`,
        placement: "bottomLeft",
      });
      form.resetFields();
    }
  }, [property, form]);

  return (
    <ContentWrapper topNav optionsNav>
      <div className="form-property">
        <CustomizedForm form={form} data={propertyFields} onfinish={setValues} />
      </div>
    </ContentWrapper>
  );
};

export default Property;
