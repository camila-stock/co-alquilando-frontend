import React, { useState, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import { Card, Divider, Button, Tag } from 'antd';
import { EditOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons'
import CarrouselPequeño from '../CarrouselPequeño';
import ModalMapa from '../Modal';
import { FacebookOutlined, TwitterOutlined } from '@ant-design/icons';
import hostname from '../../util/getHostName';

const PropertyCard = props => {
    const { title, price, address, attributes, id, photos } = props;
    const { rentPrice } = price;
    const {coordinates} = address;
    const history = useHistory();
    const { path } = useRouteMatch();
    const [ photoList, setPhotoList ] = useState([]);

    let attr = []
    if(attributes){
        attributes.forEach(t => {
            attr = { ...attr, [t.attributeType]: t.value }
        })
    }
    let typologies = {
        "APARTMENT": "Departamento",
        "APARMENT": "Departamento",
        "HOUSE": "Casa"
    }

    useEffect(() => {
        let asyncGet = async () => {
          setPhotoList([])
          photos.forEach( async (photo, index) => {
            let photoJson = {
                caption: "", 
                position: "",
                imgUrl: `${hostname}/property/${id}/photos/${photo}`
            }
            setPhotoList(photoList => [...photoList, photoJson])
          })
        }
        if(photos){
          asyncGet();
        }else{
            let photoJson = {
                caption: "", 
                position: "",
                imgUrl: ""
            }
            setPhotoList(photoList => [...photoList, photoJson])
        }
      },[id, photos])
  

    const onEdit = () => {
        history.push(`/property/${id}/update`)
    }

    const redirectDetail = () => {
        history.push(`/property/${id}`)
    }

    return (

        <div className="contentPC">

            <Card
                hoverable
                style={{ width: 280 }}
                cover={
                    <CarrouselPequeño className="carruselPC" data={photoList}>
                    </CarrouselPequeño>
                }
            >
                <div >
                    <div className="cabeceraPC">
                        <label className="titlePC">{title}</label>
                        <div className="pricePC"> 
                            <label>${rentPrice}</label>
                            <Tag className="tagPC" title="Tipología" >{ typologies[attr.typology] }</Tag>
                            {attr?.ownerInhabited && <Tag color="blue" className="tagPC" title="Vivir con dueño" >{ <UserOutlined /> }</Tag>}
                        </div>
                    </div>

                    <Divider className="dividerPC"></Divider>

                    <div className="button-place">
                        <ModalMapa coordinates={coordinates}/>
                        {path === "/my-properties" &&
                            <Button className="icon-map-pin-5" onClick={() => onEdit()}>
                                <EditOutlined />
                            </Button>
                        }
                        <Button onClick={() => redirectDetail()}>
                            <EyeOutlined />
                        </Button>
                        <Button>
                          <div className="fb-share-button" data-href={`http://coalquilando.com/property/${id}`} data-layout="button_count" data-size="small">
                              <a 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                  href={`https://www.facebook.com/sharer/sharer.php?u=http://coalquilando.com/property/${id}`} 
                                  className="fb-xfbml-parse-ignore">
                                  <FacebookOutlined />
                              </a>
                          </div>
                        </Button>
                        <Button>
                          <div>
                            <a 
                              className="twitter-share-button"
                              target="_blank" 
                              rel="noopener noreferrer"
                              href={`https://twitter.com/intent/tweet?text=Echale%20un%20vistazo%20a%20esta%20propiedad%20www.coalquilando.com.ar/property/${id}`}
                              data-size="large">
                              <TwitterOutlined />
                            </a>
                          </div>
                        </Button>
                    </div>
                        
                </div>
            </Card>
        </div>
    );


}

export default PropertyCard;

