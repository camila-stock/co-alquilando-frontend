import React, { useState } from 'react';
import { Form, Button, notification, Divider } from 'antd';
import InputRepository from '../InputRepository';

const Row = (props) => {
	const { fields } = props;
	return (
		<div className={`group${fields.length}`}>
			{fields.map((element) => {
				return (
					<Form.Item
						key={element.label}
						label={element.label}
						name={element.name}
						dependencies={element.dependencies}
						hasFeedback={element.hasFeedback}
						valuePropName={element.valuePropName}
						rules={ element.validate ?
							[
								{
									required: element.required,
									message: `Porfavor, ingrese ${element.label}`
								},
								element.validate ? element.validate : () => { return Promise.resolve() }
						] : [{
							required: element.required,
							message: `Porfavor, ingrese ${element.label}`
						}]
						}
					>
						{InputRepository(element)}
					</Form.Item>
				);
			})}
		</div>
	);
};

const CustomizedForm = (props) => {
	const { data, onfinish, form } = props;
	const { name, layout, fields, btnSubmit, className } = data;
	const { primaries, secondaries, tertiaries } = fields;
	const [ showSecondary, setShowSecondary ] = useState(false);
	const [ showTertiary, setShowTertiary ] = useState(false);
	const [ loading, setLoading ] = useState(false);


	const onFinish = (values) => {
		setLoading(true);
		setTimeout( () => { 
			setLoading(false);
			onfinish(values);
		}, 1000);
	};

	const onFinishFailed = values => {
		notification.error({
			message: `Error en formulario`,
			placement: 'bottomLeft'
		});
	};

	const showMore = () => {
		if(secondaries){
			if(showSecondary){
				if(tertiaries){
					if(showTertiary){
						return <div onClick={ () => {setShowTertiary(false);setShowSecondary(false)}}>Mostrar menos</div>
					}else{
						return <div onClick={ () => {setShowTertiary(true)}}>Mostrar más</div>
					}
				}else{
					return <div onClick={ () => {setShowSecondary(false)}}>Mostrar menos</div>
				}

			}else{
				return <div onClick={ () => {setShowSecondary(true)} }>Mostrar más</div>
			}
		}else{
			return null
		}
	}

	const renderForm = () => {
		return (
			<Form
				name={name}
				initialValues={{
					remember: true
				}}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				form={form}
				layout={layout}
			>
				{data ? (
					primaries.map((row, index) => {
						return <Row key={index} fields={row} />;
					})
				) : null}

				{showSecondary ? (
					<>
					<Divider />
					{secondaries.map((row, index) => {
						return <Row key={index} fields={row} />;
					})}
					</>
				) : null}

				{showTertiary ? (
					<>
					<Divider />
					{tertiaries.map((row, index) => {
						return <Row key={index} fields={row}/>;
					})}
					</>
				) : null}

				<div className="showmore">
					{showMore()}
				</div>

				{
					btnSubmit ? 
						<Form.Item>
							<Button loading={loading} type="primary" htmlType="submit">
								{btnSubmit}
							</Button>
						</Form.Item>
					: null
				}
			</Form>

		)
	}

	return (
		<div className={ className ? className : "customizedForm"}>
			{renderForm()}
		</div>
	);
};

export default CustomizedForm;
