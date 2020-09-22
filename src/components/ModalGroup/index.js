import React, { useContext, useState, useEffect } from "react";
import {
  notification,
  Modal,
  Radio,
  Input,
  Form,
} from "antd";
import { UsergroupAddOutlined } from "@ant-design/icons";
import Notification from "../../classes/Notification";
import ApiRequest from "../../util/ApiRequest";
import { SessionContext } from "../../store";


const RadioGroup = ({ radio, setRadio }) => {
    const onChange = (e) => {
      console.log("radio checked", e.target.value);
      setRadio(e.target.value);
    };
  
    return (
      <>
        <Radio.Group className="radioGroup" value={radio}>
          <Radio onChange={onChange} value={1}>
            Nuevo Grupo
          </Radio>
          <Radio onChange={onChange} value={2}>
            Grupo Existente
          </Radio>
        </Radio.Group>
      </>
    );
  };
  
  const NewGroupForm = ({ input, setInput }) => {
    console.log("Input", input);
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
        {groups
          ? groups.map((item, index) => {
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
          : "No tiene ningún grupo"}
      </>
    );
  };
  
  const createNewGroup = async (input, user, id) => {
    let bodyReqNewGroup = {
      adminId: id,
      name: input,
    };
  
    let { data } = await ApiRequest.post("/group", bodyReqNewGroup);
  
    console.log("DATA ->", data);
  
    let bodyReqNewInvitation = {
      groupId: data.id,
    };
  
    await ApiRequest.post(`/user/${user.id}/invite`, bodyReqNewInvitation);
  
    return data.id;
  };
  
  const inviteToGroup = async (user, selected) => {
    console.log('Selected ->', selected);
    let bodyReqNewInvitation = {
      groupId: selected.id,
    };
    await ApiRequest.post(`/user/${user.id}/invite`, bodyReqNewInvitation);
  
    return;
  };
  
  const ModalGroup = ({ user, itemTitle }) => {
    const [groups, setGroups] = useState([]);
    const [visible, setVisible] = useState(false);
    const { state } = useContext(SessionContext);
    const [radio, setRadio] = useState(1);
    const [input, setInput] = useState("");
    const [selected, setSelected] = useState({});
    let groupId = null;
  
    const handleConfirm = async (radio, input, user, state, selected) => {
        
        if (radio === 1) {
            groupId = await createNewGroup(input, user, state.user.id);
            console.log('groupID', groupId)
        } else {
            inviteToGroup(user, selected);
        }
        
        let notificationAttributes = [
          {
            attributeType: 'groupId',
            value: radio === 1 ? groupId : selected.id
          }
        ]

        let bodyReq = new Notification(
          state.user.id,
          user.id,
          "group_send_invitation",
          notificationAttributes
        );
    
        await ApiRequest.post("/notifications/send", bodyReq);
        notification.success({
          message: `¡Tu solicitud fue enviada con éxito!`,
          placement: "bottomLeft",
        });

      setVisible(!visible);
    };
  
    const handleConnect = () => {
      setVisible(!visible);
      console.log("USER ->", user);
    };
  
    useEffect(() => {
      const handleGroups = async () => {
        let { data } = await ApiRequest.get(`group/user/${state.user.id}`);
        setGroups(data);
      };
      handleGroups();
    }, [state.user.id]);
  
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
          okText="Confirmar"
          cancelText="Cancelar"
        >
          <p>
            {" "}
            <UsergroupAddOutlined /> ¿Quieres enviar la solicitud de grupo a{" "}
            {user.userName}?
          </p>
          <h3>Seleccione un grupo existe o cree un nuevo grupo</h3>
          <RadioGroup  radio={radio} setRadio={setRadio}></RadioGroup>
  
          {radio === 1 ? (
            <NewGroupForm input={input} setInput={setInput} />
          ) : (
            <UserGrops groups={groups} itemTitle={itemTitle} selected={selected} setSelected={setSelected}/>
          )}
        </Modal>
      </>
    );
  };

  export default ModalGroup;