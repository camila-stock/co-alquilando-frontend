import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Form, notification } from "antd";
import ApiRequest from "../../util/ApiRequest";
import ContentWrapper from "../../components/ContentWrapper";
import CustomizedForm from "../../components/CustomizedForm";
import Property from "../../classes/Property";
import propertyFields from "../../forms/UPDATE_PROPERTY";
import { SessionContext } from '../../store';


const UpdateProperty = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState(null);
    const [hiddenFields, setHiddenFields] = useState(null);
    const { idProperty } = useParams();
    const history = useHistory();
    const { state } = useContext(SessionContext);
    const breadscrumb = [
        { "Mis Propiedades": "/my-properties" },
        { "Actualizar": `/property/${idProperty}/update` }
    ];

    form.setFieldsValue(data)

    const updateProperty = async (values) => {
        let bodyRequest = new Property(values).mapJsonToRequest();
        bodyRequest = { ...bodyRequest, ownerId: hiddenFields.ownerId, photos: null };
        let allPromise = new Promise( async (res,rej)=> {
            try {
                await ApiRequest.put(`/property/${idProperty}`, bodyRequest).then( async () => {
                    let deletePhotos = new Promise( async (resolve,reject)=>{
                        try {
                            if (Array.isArray(values.photos) && values.photos.length){
                                resolve()
                                return
                            }
                            let array_delete_photos = [];
                            hiddenFields.photos.forEach( async (photo) => {
                                let res = values.photos.file?.fileList.find( photoAux => photoAux.name === photo)
                                if (!res) {
                                    array_delete_photos.push(photo)
                                }
                            })
                            if (array_delete_photos.length) {
                                await ApiRequest.delete(`/property/${idProperty}/photos`, { photos: array_delete_photos})
                            }
                            resolve()
                        } catch (error) {
                         reject(error)   
                        }                        
                    })
                    deletePhotos.then( async () => {
                        let postPhotos = false;
                        const formData = new FormData();
                        formData.append('type', 'file')
                        await values.photos.file?.fileList.map( async pic => {
                            if ( !hiddenFields.photos.includes(pic.name) ){
                                postPhotos = true;
                                formData.append("photos", pic.originFileObj)
                            }
                        })
                        if(postPhotos){
                            await ApiRequest.multipartPut(`/property/${idProperty}/photos`, formData)
                        }
                    })
                }).then(()=> res())
            } catch (error) {
                rej(error)
            }
        })
        allPromise.then( () => {
            notification.success({
                message: `Propiedad actualizada con éxito`,
                placement: "bottomLeft",
            });
        }).catch( err => {
            notification.error({
                message: `Error al actualizar propiedad`,
                placement: "bottomLeft",
            });
        })
        
    }

    useEffect(() => {
        let getProperty = async () => {
            let { data } = await ApiRequest.get(`/property/${idProperty}`)
            let property = new Property(data).mapResponseToFormJson();
            if (property.ownerId !== state.user.id) {
                history.push(`/property/${idProperty}`)
            } else {
                setData(property)
                setHiddenFields({
                    ownerId: property.ownerId,
                    photos: property.photos,
                })
            }
        }
        getProperty();
    }, [idProperty, state.user.id, history])

    const onDelete = async () => {
        await ApiRequest.delete(`/property/${idProperty}`).then(res => {
            notification.success({
                message: `Propiedad eliminada con éxito`,
                placement: "bottomLeft",
            });
            history.push(`/my-properties`)
        })

    };

    return (
        <div>
            <ContentWrapper topNav footer breadscrumb={breadscrumb}>
                <CustomizedForm form={form} data={propertyFields} onfinish={updateProperty} onDelete={onDelete} />
            </ContentWrapper>
        </div>
    );
};

export default UpdateProperty
