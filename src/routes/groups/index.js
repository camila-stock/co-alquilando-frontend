import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ApiRequest from '../../util/ApiRequest';
import { SessionContext } from '../../store';
import ContentWrapper from '../../components/ContentWrapper';
import GroupList from '../../components/GroupList';
import GroupDetail from '../../components/GroupDetail';
import Spin from '../../components/Spin';
import Chat from '../../components/Chat';
import Votation from '../../components/Votation';
import WaitingSelection from '../../components/WaitingSelection';
import { TeamOutlined } from '@ant-design/icons';

export const GroupContext = React.createContext();

const Groups = () => {
  const { state } = useContext(SessionContext);
  const { group, chat, name } = useParams();
  const votation = window.location.href.split("/").includes("votations");
  const breadscrumb = [
    { Grupos: "/groups" },
    { Detalle: group ? `/groups/${group}` : null },
    { Chat: chat ? `/groups/${group}/chat/${chat}` : null },
    { Votaciones: votation ? `/groups/${group}/votations` : null },
  ];
  const [data, setData] = useState(null);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    if (data) return;
    const getGroupInformation = async () => {
      const { data } = await ApiRequest.get(`/group/user/${state.user.id}`);
      setData(data);
    };
    getGroupInformation();
  }, [state.user.id, data]);

    useEffect( () => {
        if (!group) return
		let getGroupInformation = async () => {
            let response = await ApiRequest.get(`/group/${group}/detail`)
            setDetail(response.data);
        };
        if (!data?.find( g => g.id === group )){ 
            setDetail(null);
            return
        }
        getGroupInformation();
	}, [group, data])

    return (
        <ContentWrapper topNav breadscrumb={breadscrumb} footer>
            <GroupContext.Provider value={ {data, setData, detail, setDetail} }>

                {!data ? <Spin /> :null}

                {data?.length ? (
                    <div className="groups-container">
                        <GroupList groups={data} render={ !group && !chat && !votation} />
                        {   
                            data ? 
                            detail ? 
                            <GroupDetail detail={detail} render={ group && !chat && !votation } group={group} /> 
                            : group ? 
                            <Spin />
                            : <WaitingSelection border message="Seleccione Grupo" render={ group && !chat } icon={<TeamOutlined />}/> 
                            : <WaitingSelection border message="Seleccione Grupo" render={ group && !chat } icon={<TeamOutlined />}/> 
                        }
                        {
                            detail ? 
                            chat ? 
                            <Chat render={ group && chat && !votation } channelName={name} groupId={group} channel={chat}/> 
                            : votation ? 
                            <Votation render={ group && !chat && votation } detail={detail} />
                            : null
                            : null
                        }
                    </div>
                ): null }

                {data && !data?.length ? (
                    <div className="no-groups">
                        <WaitingSelection border message="No tienes grupos!" render={!group && !chat} icon={<TeamOutlined />} />
                    </div>
                ) :null }
            </GroupContext.Provider>
        </ContentWrapper>
    )
}

export default Groups;
