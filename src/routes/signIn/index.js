import React, { useState, useEffect } from 'react'
import { Form, notification } from 'antd';
import { useHistory } from 'react-router-dom';
import CustomizedForm from '../../components/CustomizedForm';
import api from '../../util/api'

const userData = {
	name: 'user',
	layout: 'vertical',
	fields: {
		primaries: [
			[
				{
					label: "Nombre",
					name: "userName",
					component: "Input",
					required: true
				},
				{
					label: "Apellido",
					name: "userSurName",
					component: "Input",
					required: true
				}
			],
			[
				{
					label: "Email",
					name: "userEmail",
					component: "Input",
					required: true
				},
				{
					label: "Confirme Email",
					name: "userConfirmEmail",
					component: "Input",
					required: true,
					dependencies:['userEmail'],
					hasFeedback: true,
					validate: ({ getFieldValue }) => ({
						validator(rule, value) {
						  if (!value || getFieldValue('userEmail') === value) {
							return Promise.resolve();
						  }
						  return Promise.reject('Los emails no coinciden!');
						},
					  }),
				}
			],
			[
				{
					label: "Contraseña",
					name: "userPassword",
					component: "Input.Password",
					required: true
				},
				{
					label: "Confirme contraseña",
					name: "userConfirmPassword",
					component: "Input.Password",
					required: true,
					dependencies:['userPassword'],
					hasFeedback: true,
					validate: ({ getFieldValue }) => ({
						validator(rule, value) {
						  if (!value || getFieldValue('userPassword') === value) {
							return Promise.resolve();
						  }
						  return Promise.reject('Las constraseñas no coinciden!');
						},
					  }),
				}
			],
			[
				{
					label: "Fecha de Nacimiento",
					name: "userBirthDate",
					component: "DatePicker",
					required: true,
				},				
				{
					label: "Número de Celular",
					name: "userPhone",
					component: "Input"
				}
			]
		],
		secondaries: [
			[
				{
					label: "Documento de Identidad",
					name: "userDni",
					component: "Input",
				},
				{
					label: "Sexo",
					name: "userSex",
					component: "Select",
					options : ["Femenino","Masculino","Otros"]
				}
			],
			[
				{
					label: "Nacionalidad",
					name: "userNationality",
					component: "Input",
				},
				{
					label: "Ciudad",
					name: "userCity",
					component: "Input",
				}
			],
			[
				{
					label: "Descripción Personal",
					name: "userDescription",
					component: "Input.TextArea",
				},
				{
					label: "Cargar Imagen",
					name: "userPhoto",
					component: "Upload",
				}
			]

		]
	}
};

const usePostProperty = fields => {
	const [ response, setResponse ] = useState(null)
	useEffect(() => {
		if (fields){
			delete fields.userConfirmEmail
			delete fields.userConfirmPassword
			let post = async () => { 
				await api.post("/user", fields)
						 .then( res => setResponse(res) 
			)}
			post();	
		}
	}, [fields])
	return response;
}

const SignIn = () => {
	const [ fields, setFields ] = useState(null)
	const [form]= Form.useForm();
	const history = useHistory();
	let property = usePostProperty(fields)
	
	useEffect( () => {
		if(property){
			console.log(property)
			notification.success({
				message: `Usuario registrado`,
				placement: 'bottomLeft'
			});
			history.push('/');
		}
	},[property, history])


	return <CustomizedForm form={form} data={userData} onfinish={setFields} />

};

export default SignIn;
