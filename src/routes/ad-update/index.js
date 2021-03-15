import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Form, notification } from "antd";
import adFields from "../../forms/UPDATE_AD";
import ContentWrapper from "../../components/ContentWrapper";
import CustomizedForm from "../../components/CustomizedForm";
import ApiRequest from "../../util/ApiRequest";
import moment from "moment";

const UpdateAd = () => {
  const { idAd } = useParams();
  const history = useHistory();
  const [form] = Form.useForm();
  const [ad, setResponse] = useState(null);
  const breadscrumb = [
    { Publicidades: "/ads" },
    { "Actualizar Publicidad": idAd ? `/ad/${idAd}/update` : null },
  ];

  useEffect(() => {
    const asyncGetAd = async () => {
      await ApiRequest.get(`/ad/${idAd}`).then((res) => {
        let { data } = res;

        let formatedData = {
          ...data,
          paymentDate: data.paymentDate ? moment(data.paymentDate) : null,
          startDate: data.startDate ? moment(data.startDate) : null,
          endDate: data.endDate ? moment(data.endDate) : null,
        };
        form.setFieldsValue(formatedData);
      });
    };
    asyncGetAd();
  }, [idAd, form]);

  const putAd = (values) => {
    let formatedBodyReq = {
      ...values,
      startDate: values.startDate.toString(),
      endDate: values.endDate.toString(),
      image: null,
    };

    let updateAd = new Promise(async (res, rej) => {
      try {
        let ok = await ApiRequest.put(`/ad/${idAd}`, formatedBodyReq);
        res(ok);
      } catch (err) {
        rej(err);
      }
    });

    updateAd.then((ad) => {
      console.log('values', values)
      if (values && values.image) {
        let image = values.image.file?.fileList;
        const formData = new FormData();
        formData.append("type", "file");

        for (const ph in image) {
          let phLast = image[ph].originFileObj;
          formData.append("image", phLast);
        }

        let header = {
          "Content-Type": "multipart/form-data",
        };

        let asyncPutImage = async () => {
          await ApiRequest.multipartPut(
            `/ad/${ad.data.id}/image`,
            formData,
            header
          ).then((res) => {
            setResponse(res);
          });
        };

        asyncPutImage();
      } else {
        setResponse(true);
      }
    });
  };

  useEffect(() => {
    if (ad) {
      notification.success({
        message: "Publicidad Actualizada con éxito",
        placement: "bottomLeft",
      });
      history.push("/ads");
    }
  }, [ad, form, history]);

  const onDelete = async () => {
    await ApiRequest.delete(`/ad/${idAd}`).then((res) => {
      notification.success({
        message: `Publicidad eliminada con éxito`,
        placement: "bottomLeft",
      });
      history.push(`/ads`);
    });
  };

  return (
    <ContentWrapper topNav footer breadscrumb={breadscrumb}>
      <CustomizedForm
        form={form}
        data={adFields}
        onfinish={putAd}
        onDelete={onDelete}
      />
    </ContentWrapper>
  );
};

export default UpdateAd;
