import React, { useState, useEffect, useContext } from 'react';
import { SessionContext, SIGN_IN } from '../../store';
import { Modal, Form, notification } from 'antd';
import { FacebookOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import Auth from '../../util/Auth';
import ApiRequest from '../../util/ApiRequest';
import isAdminRole from '../../util/isAdmin';
import getSocialNetwork from '../../util/getSocialNetwork'
import CustomizedForm from '../CustomizedForm';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';

const loginFields = {
	name: 'login',
	layout: 'vertical',
	btnSubmit: 'Ingresar',
	className: 'login',
	fields: {
		primaries: [
			[
				{
					label: 'Usuario',
					name: 'username',
					component: 'Input',
					required: true
				}
			],
			[
				{
					label: 'Contraseña',
					name: 'password',
					component: 'Input.Password',
					required: true
				}
			],
			[
				// {
				// 	label: 'Olvidé mi Contraseña',
				//     component: 'link',
				//     href: "#"
				// },
				{
					label: '¿No tienes cuenta? ¡Registrate!',
					component: 'link',
					href: '/sign-in'
				}
			]
		]
	}
};

const CustomizedModal = (props) => {
	const { dispatch } = useContext(SessionContext);
	const { visible, toggleVisible } = props;
	const history = useHistory();
	const [ form ] = Form.useForm();
	const [ authErr, setAuthErr ] = useState(null);
	const [ user, setUser ] = useState(null);
	const { t } = useTranslation();

	const postSession = (data) => {
		setAuthErr(null);
		if (data) {
			let asyncSignIn = new Promise(async (res, rej) => {
				try {
					let user = await Auth.signIn(data.username, data.password);
					res(user);
				} catch (e) {
					rej(e);
				}
			});
			let asyncGetUser = async (user) => {
				try {
					let nickname = user.username;
					let { data } = await ApiRequest.get(`user/${nickname}`);
					setUser(data);
				} catch (e) {
					notification.error({
						message: 'No se pudo traer datos del usuario.',
						description: `${t(e.message)}`,
						placement: 'bottomLeft'
					});
				}
			};
			asyncSignIn
				.then((user) => {
					setAuthErr(null);
					asyncGetUser(user);
				})
				.catch((e) => {
					setAuthErr(e.message);
				});
		}
	};

	const postSessionSocialNetwork = (res) => {
	const social_network = getSocialNetwork(res);

    if (res) {
		let userBodyReq = {};
		// TODO: agregar attributtes!
		switch (social_network) {
			case 'FACEBOOK':
				userBodyReq = {
					userName: res.first_name,
					userSurname: res.last_name,
					userEmail: res.email,
					userNickname: res.first_name + res.last_name,
					attributes: [
						{attributeType: "sex", 
						value: "Otro", 
						weight: 0}
					]
				  };
				break;
			case 'GOOGLE':
				let data = res.profileObj;
				userBodyReq = {
				userName: data.givenName,
				userSurname: data.familyName,
				userEmail: data.email,
				userNickname: data.first_name + data.last_name,
				attributes: [
					{attributeType: "sex", 
					value: "Otro", 
					weight: 0}
				]
			  };
			// eslint-disable-next-line no-fallthrough
			default:
				break;
		}
      

      let asyncPost = async () => {
        try {
          let { data } = await ApiRequest.post("/user", userBodyReq);
          setUser(data);
        } catch (e) {
          notification.error({
            message: "Error al almacenar usuario ",
            description: `Api Error: ${e.message}`,
            placement: "bottomLeft",
          });
        }
      };

      let asyncGetUser = async (res) => {
        try {
		  let email = social_network === 'FACEBOOK' ? res.email : res.profileObj.email;
          let { data } = await ApiRequest.get(`user/email/${email}`);
          setUser(data);
        } catch (e) {
          asyncPost();
        }
      };
      asyncGetUser(res);
    }
  };

	useEffect(() => {
    if (user) {
      delete user.userPassword;
      dispatch(SIGN_IN(user));
      notification.success({
        message: `¡${user.userName}, Bienvenido a CoAlquilando!`,
        placement: "bottomLeft",
      });
			if (isAdminRole(user)) {
				window.location = "reports-admin"
				return;
			}
      window.location = "/"
    }
  }, [dispatch, user, history]);

	const redes = (
    <div className="redes">
      <FacebookLogin
        appId="1725304344329251"
        fields="name,email,picture,first_name,last_name"
        icon={<FacebookOutlined />}
        textButton="Continuar con Facebook"
        size="small"
        callback={postSessionSocialNetwork}
      />
      <GoogleLogin
        clientId="1020592739385-h7eftrjsbjeluoj7mcjq65gqbu161rjt.apps.googleusercontent.com"
        buttonText="Continuar con Google"
        onSuccess={postSessionSocialNetwork}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );

	return (
		<Modal
			title="Iniciar Sesión"
			className="loginModal"
			visible={visible}
			onCancel={toggleVisible}
			footer={null}
			destroyOnClose={true}
			okText="Confirmar"
			cancelText="Cancelar"
		>
			<CustomizedForm form={form} data={loginFields} onfinish={postSession} />
			{authErr && <span id="authErr">{t(authErr)}</span>}
			{redes}
		</Modal>
	);
};

const Login = (props) => {
	const [ visible, setVisible ] = useState(false);

	const toggleVisible = () => {
		setVisible(!visible);
	};

	return (
		<div className="wrapper-login">
			{props.children ? (
				<span onClick={() => toggleVisible()}>{props.children}</span>
			) : (
				<span className="title" onClick={() => toggleVisible()}>
					{' '}
					Iniciar sesión{' '}
				</span>
			)}

			<CustomizedModal visible={visible} toggleVisible={toggleVisible} />
		</div>
	);
};

export default Login;
