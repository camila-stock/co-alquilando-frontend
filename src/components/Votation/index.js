import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { Rate, notification } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationOutlined,
} from "@ant-design/icons";
import { SessionContext } from "../../store";
import ApiRequest from "../../util/ApiRequest";
import Property from "../../classes/Property";
import WaitingSelection from "../WaitingSelection";

const useVotations = (detail) => {
  const [data, setData] = useState(null);
  const [votations, setVotations] = useState(null);
  let { group } = useParams();

  useEffect(() => {
    const getVotations = async () => {
      const { data } = await ApiRequest.get(`/group/votation/all/${group}`);
      setData(data);
    };
    getVotations();
  }, [group]);

  useEffect(() => {
    if (!votations?.update) return;
    const getVotations = async () => {
      const { data } = await ApiRequest.get(`/group/votation/all/${group}`);
      setData(data);
      setVotations({ ...votations, update: false });
    };
    getVotations();
  }, [group, votations]);

  useEffect(() => {
    if (!data) return;

    let ongoing = null;
    let history = [];
    data.forEach((item) => {
      if (item.result === "ongoing") {
        ongoing = item;
        let votos = Object.entries(item.votes);
        ongoing = {
          ...ongoing,
          votospositivos: votos.filter((voto) => voto[1]).length,
        };
      } else {
        history = [...history, item];
      }
    });
    setVotations({ ongoing, history });
  }, [data]);

  return [votations, setVotations];
};

const OnGoing = ({ votations, detail, setVotations }) => {
  const { t } = useTranslation();
  const { state } = useContext(SessionContext);
  const [property, setProperty] = useState(null);
  const [userVote, setuserVote] = useState(null);
  const userId = state.user.id;
  const voteConfig = {
    false: 0,
    true: 1,
    null: 2,
  }

  useEffect(() => {
    if (!votations?.ongoing) {
      setProperty(null);
      return;
    }
    let asyncGetUser = async () => {
      let { data } = await ApiRequest.get(
        `/property/${votations?.ongoing.propertyId}`
      );
      let formatedProperty = await new Property(data).mapResponseToJson();
      setProperty(formatedProperty);
    };
    asyncGetUser();
  }, [votations, detail]);

  useEffect(() => {
    const getVotations = async () => {
      if (!votations.ongoing?.id) return;
      const { data } = await ApiRequest.get(`/group/votation/${votations.ongoing?.id}`);
      const vote = voteConfig[data.votes[`${userId}`]]
      setuserVote( vote );
    };
    getVotations();
  }, [votations, userId, voteConfig]);

  const handleVote = async (vote) => {
    let bodyReq = {
      userId: userId,
      votationId: votations?.ongoing.id,
      vote,
    };
    let { data, status } = await ApiRequest.put(
      `/group/votation/vote/${detail?.id}`,
      bodyReq
    );
    setVotations({ ...votations, ongoing: data, update: true });
    if (status === 200) {
      notification.success({
        message: "Votación registrada",
        placement: "bottomLeft",
      });
    } else {
      notification.success({
        message:
          "Hubo un error al registrar su votación. Por favor, intente nuevamente.",
        placement: "bottomLeft",
      });
    }
  };

  if (votations?.ongoing && property) {
    return (
      <div className="ongoing" key={Math.random()}>
        <div className="votationHeader">
          <img
            alt="imagen de perfil"
            src={property?.photos[0]}
            className="imageVotation"
          />
          <div key={votations.id} className="contentVotationTitle">
            <a
              href={`/property/${votations?.ongoing.propertyId}`}
              className="titleVotation"
            >
              {property?.title}
            </a>
            <div className="priceVotation">
              Precio: ${property?.price.rentPrice}
            </div>
            <div className="buttonsVotation">
              {(userVote === 2 || userVote === 1) && (
              <CloseCircleOutlined
                style={{color:"red"}}
                className="buttonsVotationNo"
                onClick={() => handleVote(false)}
              />)}
              {(userVote === 2 || userVote === 0) && (
              <CheckCircleOutlined
                style={{color:"#52c41a"}}
                className="buttonsVotationOk"
                onClick={() => handleVote(true)}
              />)}
            </div>
          </div>
        </div>

        <div className="results">
          <div className="subtitleVotation">Resultado actual</div>
          <Rate
            className="actualVotation"
            character={<CheckCircleOutlined />}
            disabled
            count={detail?.membersId.length}
            value={votations?.ongoing.votospositivos}
          />
        </div>

        <div className="state">
          <div className="resultVotation">{t(votations?.ongoing.result)}</div>
        </div>
      </div>
    );
  }
  return <></>;
};
const History = ({ items }) => {
  const { t } = useTranslation();
  let configColor = {
    ongoing: "#F7DC6F",
    passed: "#17A589",
    failed: "#F1948A",
    canceled: "#bbb",
  };
  return (
    <div className="history">
      <span>Historial</span>
      {items?.map((item) => {
        return (
          <div className="row" key={item.id}>
            <Link to={`/property/${item?.propertyId}`}>
              Ver propiedad
            </Link>
            <div
              style={{ color: configColor[item?.result] }}
              className="resultVotation"
            >
              {t(item?.result)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Votation = ({ detail, render }) => {
  const [votations, setVotations] = useVotations(detail);

  if (!votations?.history.length && !votations?.ongoing) {
    return (
      <WaitingSelection
        border
        render
        message="No tienes votaciones"
        icon={<ExclamationOutlined />}
      />
    );
  }

  return (
    <div key={detail?.id} className={`votation-wrapper ${!!render}`}>
      <OnGoing
        votations={votations}
        item={votations?.ongoing}
        detail={detail}
        setVotations={setVotations}
      />
      {votations?.history.length ? (
        <History items={votations?.history} />
      ) : null}
    </div>
  );
};

export default Votation;
