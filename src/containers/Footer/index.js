import React from 'react';
import { TwitterOutlined } from '@ant-design/icons';

import './styles.scss';

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer__contact-us'>
        <span className="title">CoAlquilando</span>
        <a href="mailto:coalquilando@gmail.com">Contacto</a>
      </div>
      <div className='footer__contact-us'>
        <span className="title">Publicitá con nosotros</span>
        <a href="mailto:coalquilando@gmail.com?subject=Contacto Publicidad">Contrataciones</a>
      </div>
      <div className='footer__media'>
        <span className="title">Redes Sociales</span>
        <a href='https://twitter.com/CoAlquilando'> <TwitterOutlined /> Twitter</a>
      </div>
    </footer>
  );
}

export default Footer;