import React, { useState, useEffect } from "react";
import ContentWrapper from "../../components/ContentWrapper";
import AdCard from "../../components/Ad";
import AdInfo from "../../components/AdInfo";
import { notification, Pagination } from "antd";
import ApiRequest from "../../util/ApiRequest";
import WaitingSelection from "../../components/WaitingSelection";
import { HomeOutlined } from "@ant-design/icons";
import Spin from "../../components/Spin";

const AdList = () => {
  const [datos, setDatos] = useState(null);
  const [page, setPage] = useState(1);
  const [size] = useState(5);
	const [params, setParams] = useState();
  const breadscrumb = [{ Publicidades: "/ads" }];
  
  const onChange = (page) => setPage(page);

  useEffect(() => {
    let asyncGet = async () => {
      try {
        let { data } = await ApiRequest.get(`/ad/pageable`, { page, size, ...params });
        setDatos(data);
      } catch (e) {
        notification.error({
          message: `Error al obtener propiedades`,
          placement: "bottomLeft",
        });
      }
    };
    asyncGet();
  }, [page, params, size]);

  return (
    <ContentWrapper topNav breadscrumb={breadscrumb} footer>
      <div className="ads-list--content">
        <AdInfo count={datos?.totalElements} onFilter={setParams} />
        

        <div className="ads">
          {!datos ? <Spin /> : null}

          {datos?.totalElements
            ? datos?.adList.map((a) => {
                return (
                  <AdCard key={a.id} {...a} datos={datos} setDatos={setDatos} />
                );
              })
            : null}

          {datos && !datos.totalElements ? (
            <div className="no-groups">
              <WaitingSelection
                message="No tienes ninguna publicidad publicada"
                render={true}
                icon={<HomeOutlined />}
              />
            </div>
          ) : null}

          <div className="ads__pagination">
            <Pagination
              current={page}
              onChange={onChange}
              total={datos?.totalElements}
              pageSize={size}
            />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default AdList;
