import React, { useState, useEffect, useContext } from 'react';
import { SessionContext } from '../../store';
import ContentWrapper from '../../components/ContentWrapper';
import UserCard from '../../components/Match';
import Spin from '../../components/Spin';
import ApiRequest from '../../util/ApiRequest';
import { ArrowDownOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AdImage from '../../components/Ad/AdImage';
import WaitingSelection from '../../components/WaitingSelection';

const Match = () => {
	const [ matched, setMatched ] = useState(null);
	const [ users, setUsers ] = useState(null);
	const { state } = useContext(SessionContext);

	useEffect(() => {
			let asyncGet = async () => {
				try {
					let { data } = await ApiRequest.get(`/user/match/${state.user.id}`);
          data 
            ? setMatched(data)
            : setMatched([])
				} catch (error) {
					let params = { userId : state.user.id }
					await ApiRequest.getQuery(`/user/users`, params)
          .then(({data})=> {
            setUsers(data)
          })
          .catch(() => {
            setUsers([])
          })
				}
			};
			asyncGet();
		},[ state.user ]);

	return (
    <ContentWrapper topNav footer optionsNav>
      <div className="roommates-wrapper">
        <div className="info-column">
          {!matched ? (
            <div className="no-match">
              <p>No tienes preferencias cargadas</p>
              <div>
                <p className="here">Cargalas aquí</p>
                <ArrowDownOutlined />
              </div>
            </div>
          ) : null}

          <div className="edit preferences">
            <Link to="my-profile/updatePreferencies">Editar Preferencias</Link>
          </div>

          <AdImage position="vertical" />
        </div>

        <div className="match">
          {users && !users.length 
            ? <WaitingSelection message="No se encontraron compañeros" /> 
            : null}
          {!matched && !users ? <Spin /> : null}

          {matched?.map((u, index) => {
            return <UserCard key={index} {...u} />;
          })}

          {users && (
            <div>
              {users.map((u, index) => {
                return <UserCard key={index} user={{ ...u }} />;
              })}
            </div>
          )}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Match;
