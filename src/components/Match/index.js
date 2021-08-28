import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Tag,
} from "antd";
import Avatar from '../Avatar'
import ModalGroup from "../ModalGroup";

const { Meta } = Card;

const handleTagCoincidence = (coincidence) => {
  if (coincidence >= 90) {
    return "green";
  }
  if (coincidence >= 70) {
    return "blue";
  }
};

const Description = ({ desc }) => {
  return (
    <div>
      <div>{desc}</div>
    </div>
  );
};

const Name = ({ name, coincidence }) => {
  return (
    <div className="name">
      <p>{name}</p>
      {
        Object.is(coincidence, null) || Object.is(coincidence, undefined) ?
        null
        : (<Tag color={handleTagCoincidence(coincidence)}>
            {parseFloat(coincidence).toFixed(2)} %
          </Tag>)
      }
    </div>
  );
};

const UserCard = ({ user, coincidence } ) => {

  const ViewProfile = ({ title }) => {
    return (
      <Link to={`profile/${user?.userNickname}`}>
        {title}
      </Link>
    );
  };

  return (
    <Card
      hoverable
      className="userCard"
      actions={[
        <ModalGroup user={user} itemTitle="name" />,
        <ViewProfile key="viewProfile" title={"Ver Perfil"} />,
      ]}
    >
      <Meta
        avatar={ <Avatar user={user} letter={user?.userName[0].toUpperCase()} url={ user?.photos ? `https://ec2-34-219-1-255.us-west-2.compute.amazonaws.com:8080/user/${user?.id}/photos/${user?.photos[0]}` : null} />}
        title={
          <Name name={user?.userName + " " + user?.userSurname} coincidence={coincidence} />
        }
        description={
          <Description desc={user?.userDescription} coincidence={coincidence} />
        }
      />
    </Card>
  );
};

export default UserCard;
