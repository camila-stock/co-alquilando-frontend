import React from 'react';
import { Steps, Tag } from 'antd';
import LOGO_COALQUILANDO from '../../assets/images/logonav.png';
import desktopVideo from '../../assets/images/Home/Coalq.mp4';
import mobileVideo from '../../assets/images/Home/mobile-coalq.mov';
import Login from '../../components/Login';
import Footer from '../../containers/Footer';
import { LoginOutlined } from '@ant-design/icons';

import '../../styles/Home.scss';

const { Step } = Steps;

const Home = () => {

	const mobileView = window.screen.width < 600;
	const video = mobileView ? mobileVideo : desktopVideo;

	return (
		<div className="home-page">
			<div className="logo">
				<img src={LOGO_COALQUILANDO} alt="image_home" />
			</div>

			<section className="video-section">
				<video className="video" loop autoPlay preload="true" muted>
					<source src={video} />
				</video>

				<div className="presentation-text">
					<h1 className="text --title">CoAlquilando</h1>
					<h3 className="text --subtitle">Encontrá tu lugar...</h3>
					<div className="login">
						<Login>
              <Tag icon={<LoginOutlined />} >
                Ingresar
              </Tag>
            </Login>
					</div>
				</div>
			</section>

			<section className="steps">
				<div className="step-by-step">
					<div className="step">
						<h1 className="title">Buscá compañeros de alquiler</h1>
						<Steps current={3} progressDot direction="vertical">
							<Step title="Registrate" description="Completá tus datos y accede a la plataforma." />
							<Step
								title="Personalizá tu Búsqueda"
								description="Elegí tus preferencias para encontrar a tus compañeros ideales."
							/>
							<Step
								title="Elegí tu Propiedad"
								description="Proponé tu lugar favorito y vótalo con tus compañeros."
							/>
						</Steps>
					</div>

					<div className="step">
						<h1 className="title">Compartí tu alquiler</h1>
						<Steps current={3} progressDot direction="vertical">
							<Step title="Registrate" description="Completá tus datos y accede a la plataforma." />
							<Step
								title="Publicá tu propiedad"
								description="Completa los datos y comenzá tu búsqueda de compañeros."
							/>
							<Step
								title="Encontrá tus compañeros"
								description="Navegá entre los perfiles y elegí tus compañeros de vivienda."
							/>
						</Steps>
					</div>

					<div className="step">
						<h1 className="title">Publicá tu propiedad</h1>
						<Steps current={3} progressDot direction="vertical">
							<Step title="Registrate" description="Completá tus datos y accede a la plataforma." />
							<Step
								title="Publicá tus propiedades"
								description="Publicá sin costo tu primera propiedad."
							/>
							<Step
								title="Encontrá tus inquilinos"
								description="Gestioná los grupos, comunícate y alquila tu propiedad."
							/>
						</Steps>
					</div>
				</div>
			</section>
			<Footer />
		</div>
	);
};

export default Home;
