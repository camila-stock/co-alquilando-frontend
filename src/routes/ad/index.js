import React, { useState, useEffect } from "react";
import { Form, notification } from "antd";
import adFields from "../../forms/POST_AD";
import ContentWrapper from "../../components/ContentWrapper";
import CustomizedForm from "../../components/CustomizedForm";
import ApiRequest from "../../util/ApiRequest";

const Ad = () => {
  const [form] = Form.useForm();
  const [ad, setResponse] = useState(null);
  const breadscrumb = [
    { Publicidades: "/ads" },
    { "Publicar Publicidad": "/ad" },
  ];

  const postAd = (values) => {
    let formatedBodyReq = {
      ...values,
      image: null,
    };

    let createAd = new Promise(async (res, rej) => {
      try {
        let ok = await ApiRequest.post("/ad", formatedBodyReq);
        res(ok);
      } catch (err) {
        rej(err);
      }
    });

    createAd.then((ad) => {
      if (values && values.image) {
        var image = values.image.file.fileList;

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
        message: "Publicidad Publicada",
        placement: "bottomLeft",
      });
      form.resetFields();
    }
  }, [ad, form]);

  return (
    <ContentWrapper topNav footer breadscrumb={breadscrumb}>
      <CustomizedForm form={form} data={adFields} onfinish={postAd} />
    </ContentWrapper>
  );
};

export default Ad;
