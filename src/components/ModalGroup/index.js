import React, { useContext, useState, useEffect } from "react";
import { notification, Modal, Radio, Input, Form } from "antd";
import { UsergroupAddOutlined } from "@ant-design/icons";
import Notification from "../../classes/Notification";
import ApiRequest from "../../util/ApiRequest";
import { SessionContext } from "../../store";

const RadioGroup = ({ radio, setRadio }) => {
  const onChange = (e) => {
    setRadio(e.target.value);
  };

  return (
    <>
      <Radio.Group className="radioGroup" value={radio}>
        <Radio onChange={onChange} value={1}>
          Grupo Existente
        </Radio>
        <Radio onChange={onChange} value={2}>
          Nuevo Grupo
        </Radio>
      </Radio.Group>
    </>
  );
};

const NewGroupForm = ({ input, setInput }) => {
  return (
    <>
      <Form layout="vertical">
        <Form.Item
          name="Nombre del Grupo"
          label="Nombre del Grupo"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input onChange={(e) => setInput(e.target.value)} />
        </Form.Item>
      </Form>
    </>
  );
};

const UserGrops = ({ groups, itemTitle, selected, setSelected }) => {
  const isSelected = (item) => {
    return selected[itemTitle] === item[itemTitle] ? "selected" : "";
  };

  const handleSelected = (item) => {
    setSelected(item);
  };
  return (
    <>
      {groups && groups.length ? (
        groups.map((item, index) => {
          if (item[itemTitle] === "Mis chats") return <div></div>
          return (
            <div
              onClick={() => handleSelected(item)}
              key={index}
              className={`item ${isSelected(item)}`}
            >
              <div>{item[itemTitle]}</div>
            </div>
          );
        })
      ) : (
        <div>No tiene ningún grupo</div>
      )}
    </>
  );
};

const createNewGroup = async (input, user, id) => {
  let bodyReqNewGroup = {
    adminId: id,
    name: input,
  };

  let { data } = await ApiRequest.post("/group", bodyReqNewGroup);

  let bodyReqNewInvitation = {
    groupId: data.id,
  };

  await ApiRequest.post(`/user/${user.id}/invite`, bodyReqNewInvitation)
    .then(async (res) => {
      let notificationAttributes = [
        {
          attributeType: "groupId",
          value: data.id,
        },
      ];
      let bodyReq = new Notification(
        id,
        user.id,
        "group_send_invitation",
        notificationAttributes
      );

      await ApiRequest.post("/notifications/send", bodyReq).then((res) => {
        notification.success({
          message: `¡Tu solicitud fue enviada con éxito!`,
          placement: "bottomLeft",
        });
      });
    })
    .catch((err) => {
      console.error(err);
      notification.info({
        message: `¡Tu solicitud fue enviada con éxito!`,
        placement: "bottomLeft",
      });
    });

  return data.id;
};

const inviteToGroup = async (user, selected, id) => {
  let bodyReqNewInvitation = {
    groupId: selected.id,
  };
  await ApiRequest.post(`/user/${user.id}/invite`, bodyReqNewInvitation)
    .then(async (res) => {
      let notificationAttributes = [
        {
          attributeType: "groupId",
          value: selected.id,
        },
      ];
      let bodyReq = new Notification(
        id,
        user.id,
        "group_send_invitation",
        notificationAttributes
      );

      await ApiRequest.post("/notifications/send", bodyReq).then((res) => {
        notification.success({
          message: `¡Tu solicitud fue enviada con éxito!`,
          placement: "bottomLeft",
        });
      }).catch((err) => {
        notification.success({
          message: `¡Tu solicitud fue enviada con éxito!`,
          placement: "bottomLeft",
        });
      });
  ;
    })
    .catch((err) => {
      notification.error({
        message: `${user.userName} ${user.userSurname} ya pertence al grupo`,
        placement: "bottomLeft",
      });
    });

  return;
};

const ModalGroup = ({ user, itemTitle }) => {
  const [groups, setGroups] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setloading] = useState(false);
  const [radio, setRadio] = useState(1);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState({});
  const { state } = useContext(SessionContext);

  const handleConfirm = async (radio, input, user, state, selected) => {
    setloading(true)
    if (radio === 2) {
      await createNewGroup(input, user, state.user.id);
    } else {
      inviteToGroup(user, selected, state.user.id);
    }
    setloading(false);
    setVisible(!visible);
  };

  const handleConnect = () => setVisible(vis => !vis);

  useEffect(() => {
    if (!visible) return;
    const handleGroups = async () => {
      let { data } = await ApiRequest.get(`group/user/${state.user.id}`);
      setGroups(data);
    };
    handleGroups();
  }, [visible, state.user.id]);

  return (
    <>
      <span onClick={() => handleConnect()}>Conectar</span>
      <Modal
        className="notificationModal"
        visible={visible}
        onOk={() => handleConfirm(radio, input, user, state, selected)}
        onCancel={() => {
          setVisible(!visible);
        }}
        confirmLoading={loading}
        okText="Confirmar"
        cancelText="Cancelar"
      >
        <p>
          {" "}
          <UsergroupAddOutlined /> ¿Quieres enviar la solicitud de grupo a{" "}
          {user.userName}?
        </p>
        <h3>Seleccione un grupo existente o cree un nuevo grupo</h3>
        <RadioGroup radio={radio} setRadio={setRadio}></RadioGroup>

        {radio === 2 ? (
          <NewGroupForm input={input} setInput={setInput} />
        ) : (
          <UserGrops
            groups={groups}
            itemTitle={itemTitle}
            selected={selected}
            setSelected={setSelected}
          />
        )}
      </Modal>
    </>
  );
};

export default ModalGroup;
