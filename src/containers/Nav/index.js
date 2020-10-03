import React, { useState, useEffect, useContext } from 'react';
import { SessionContext, SIGN_OUT } from '../../store'
import { Menu, Avatar, Badge, Dropdown } from 'antd';
import { LogoutOutlined, BellOutlined, TeamOutlined } from '@ant-design/icons';
import Login from '../../components/Login';
import Auth from '../../util/Auth';
import ApiRequest from "../../util/ApiRequest";


const Ring = () => {
	const [count, setCount] = useState(0);
	setTimeout(() => { setCount(1); }, 3000);
	useEffect(() => { return () => { new AbortController().abort(); } })
	return (
		<Badge count={count}>
			<BellOutlined />
		</Badge>
	);
};

const Nav = () => {
	const { state, dispatch } = useContext(SessionContext);
	const [datos, setDatos] = useState(null);
	const [photosUpdate, setPhotosUpdate] = useState(null);

	const image =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

	useEffect(() => {
		if (!datos) {
			const getUser = async () => {
				const { data } = await ApiRequest.get(`/user/${state.user.userNickname}`);
				let attr = [];
				data.attributes.forEach((t) => {
					attr = { ...attr, [t.attributeType]: t.value };
				});
				setDatos({ ...data, attributes: attr });
				setPhotosUpdate(data.photos);
			};
			getUser();
		}
	}, [state, datos]);


	const profileSignedIn = (
		<Menu>
			<Menu.Item key="0">
				<a rel="noopener noreferrer" href="/my-profile">
					Mi Perfil
					</a>
			</Menu.Item>
			<Menu.Item key="1">
				<a rel="noopener noreferrer" href="/my-properties">
					Mis Propiedades
					</a>
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item key="3" onClick={async () => {
				await Auth.signOut;
				dispatch(SIGN_OUT())
			}
			}>
				<LogoutOutlined /> Cerrar Sesión
				</Menu.Item>
		</Menu>
	);

	return (
		<ul className="principalNav">
			<li>
				<a href="/">CoAlquilando</a>
			</li>
			{state?.user ? (

				<>
					<li style={{ float: 'right' }}>
						<Dropdown overlay={profileSignedIn} placement="bottomRight" trigger="click">
							<a rel="noopener noreferrer" className="ant-dropdown-link" href="/">
								<Avatar
									size={30}
									src={(state.user.id && photosUpdate) ? `http://localhost:8080/user/${state.user.id}/photos/${photosUpdate}` : image}
								/>
							</a>
						</Dropdown>
					</li>
					<li style={{ float: 'right' }}>
						<a href="/notifications">
							<Ring />
						</a>
					</li>
					<li style={{ float: 'right' }}>
						<a href="/groups">
							<TeamOutlined />
						</a>
					</li>
				</>) :
				<>
					<li style={{ float: 'right' }}>
						<span className="no-link">
							<Login />
						</span>
					</li>
					<li style={{ float: 'right' }}>
						<a href="/sign-in">
							Registrarse
					</a>
					</li>
				</>
			}
		</ul>
	);
};

export default Nav;