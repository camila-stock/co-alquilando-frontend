import React, { useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import { SessionContext, SIGN_OUT } from '../../store'
import { Menu, Avatar, Badge, Dropdown } from 'antd';
import { LogoutOutlined, BellOutlined, TeamOutlined } from '@ant-design/icons';
import Login from '../../components/Login';
import Auth from '../../util/Auth';
import isAdminRole from '../../util/isAdmin';
import hostname from '../../util/getHostName';
import logo from '../../assets/images/logonav.png'

const Ring = ({ notifications }) => {
	useEffect(() => { return () => { new AbortController().abort(); } })
	return (
		<Badge size="small" count={notifications}>
			<a href="/" style={{margin:0,padding:0}}><BellOutlined /></a>
		</Badge>
	);
};

const Nav = ({notifications}) => {
	const { state, dispatch } = useContext(SessionContext);

	const isAdmin = isAdminRole(state.user);

	const image = (state.user && state.user.photos) ? 
	`${hostname}/user/${state.user.id}/photos/${state.user.photos[0]}` :
  	"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

	const profileSignedIn = (
		<Menu>
			{!isAdmin && (
				<Menu.Item key="0">
					<Link to="/my-profile" replace>
						Mi Perfil
					</Link>
				</Menu.Item>
			)}
			{!isAdmin && (
				<Menu.Item key="1">
					<Link to="/my-properties">
						Mis Propiedades
					</Link>
				</Menu.Item>
			)}
			{isAdmin 
			? (
				<Menu.Item key="2">
					<Link to="/reports-admin">
						Reportes de Administrador
					</Link>
				</Menu.Item>
			)
			: (
				<Menu.Item key="2">
					<Link to="/reports">
						Mis Reportes
					</Link>
				</Menu.Item>
			)}
			{isAdmin && (
				<Menu.Item key="2">
					<Link to="/ads">
						Administrar Publicidades
					</Link>
				</Menu.Item>
			)}
			<Menu.Divider />
			<Menu.Item key="4" onClick={async () => {
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
				<Link to="/">
					<img className="logo" src={logo} alt="CoAlquilando"></img>
				</Link>
			</li>
			{state?.user ? (
				<>
					<li style={{ float: 'right' }}>
						<Dropdown overlay={profileSignedIn} placement="bottomRight" trigger="click">
							<Link to="/" >
								<div className="ant-dropdown-link">
									<span className="userName">{state?.user.userName}</span>
									<Avatar size={30} src={image} />
								</div>
							</Link>
						</Dropdown>
					</li>
					{!isAdmin && (
						<li style={{ float: 'right' }}>
							<Link to="/notifications" >
								<Ring notifications={notifications} />
							</Link>
						</li>
					)}
					{!isAdmin && (
						<li style={{ float: 'right' }}>
							<Link to="/groups">
								<TeamOutlined />
							</Link>
						</li>
					)}
				</>) :
				<>
					<li style={{ float: 'right' }}>
						<Login />
					</li>
				</>
			}
		</ul>
	);
};

export default Nav;