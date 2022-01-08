import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router';
import { SessionContext, SIGN_IN } from '../../store';
import ApiRequest from '../../util/ApiRequest';
import { Form, notification } from 'antd';
import CustomizedForm from '../../components/CustomizedForm';
import ContentWrapper from '../../components/ContentWrapper';
import propertyFields from '../../forms/POST_PROPERTY';

const Property = () => {
	const [ form ] = Form.useForm();
	const [property, setResponse] = useState(null);
	const { state, dispatch } = useContext(SessionContext);
	const [ user, setUser ] = useState();
	const history = useHistory();

	useEffect(
		() => {
			if (user) return;
			const getUser = async () => {
				await ApiRequest.get(`user/${state.user.userNickname}`)
					.then(({ data }) => {
						setUser(data);
					})
					.then(async () => {
						const { data } = await ApiRequest.get(`user/hasToPay/${state.user.id}`);
						console.log("data", data)
						if (data) {
							notification.info({
								message: `No tiene suscripciones activas`,
								placement: 'bottomLeft'
							});
							history.push('/payOptions');
						}
					});
			};
			getUser();
		},
		[ user, state, history ]
	);

	useEffect(
		() => {
			if (!user) return;
			dispatch(SIGN_IN(user));
		},
		[ user, dispatch ]
	);

	const postProperty = values => {
		values.address = { ...values.address, coordinates: values.coordinates };
		delete values.coordinates;
		let atributos = Object.entries(values.attributes);
		const attributesFormate = atributos.map((a) => {
			let json = {
				attributeType: a[0],
				value: a[1] ? a[1] : '',
				weigth: 0
			};
			return json;
		});

		let formatedBody = {
			...values,
			attributes: attributesFormate,
			ownerId: state.user.id,
			status: 'available'
		};

		let bodyReq = formatedBody;
		delete bodyReq.photos;

		let createProperty = new Promise(async (res, rej) => {
			try {
				let ok = await ApiRequest.post('/property', bodyReq);
				res(ok);
			} catch (e) {
				rej(e);
			}
		});

		createProperty.then((property) => {
			if (values && values.photos) {
				var plist = values.photos.file.fileList;

				const formData = new FormData();
				formData.append('type', 'file');
				for (const ph in plist) {
					let phLast = plist[ph].originFileObj;

					formData.append('photos', phLast);
				}

				let header = {
					'Content-Type': 'multipart/form-data'
				};

				let asyncPutPhoto = async () => {
					await ApiRequest.multipartPut(
						`/property/${property.data.id}/photos`,
						formData,
						header
					).then((res) => {
						setResponse(res);
						if (res.status === 200) {
							notification.success({
								message: `Datos Actualizados`,
								placement: 'bottomLeft'
							});
						} else {
							notification.error({
								message: `Error: No se pudo actualizar sus datos`,
								placement: 'bottomLeft'
							});
						}
					});
				};
				asyncPutPhoto();
			}else{
				setResponse(true);
			}
		});
	}

	useEffect(
		() => {
			if (property) {
				notification.success({
					message: `Propiedad Publicada`,
					placement: 'bottomLeft'
				});
				setUser(null);
				form.resetFields();
			}
		},
		[ property, form ]
	);

	return (
		<ContentWrapper topNav footer optionsNav>
			<div className="form-property">
				<CustomizedForm form={form} data={propertyFields} onfinish={postProperty} />
			</div>
		</ContentWrapper>
	);
};

export default Property;
