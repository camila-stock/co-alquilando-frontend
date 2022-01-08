import React, { useState } from 'react';
import { Button, Form, Input, InputNumber, Checkbox } from 'antd';
import { FilterOutlined, CloseOutlined, DownOutlined } from "@ant-design/icons";
import SelectDB from '../InputRepository/SelectDB'

const FilterProperties = ({onFilter}) => {
    const [filters] = Form.useForm();

    const sendFilters = values => {
        let filtros = Object.entries(values).filter( f => f[1] );
        let json = {}
        filtros.map( m => json = {...json, [m[0]]: m[1] } )
        onFilter(json)
    }

    return (
        <div className="panel" >
            <div className="filter-content">
                <Form form={filters} onFinish={sendFilters}>
                    <div className="form">
                        <Form.Item name="neighborhood" label="Barrio">
                            {SelectDB({endpoint:"/location/all",search:"neighborhood",size:"small"})}
                        </Form.Item>

                        <Form.Item name="price" label="Precio Máximo">
                            <InputNumber size="small"/>
                        </Form.Item>

                        <Form.Item name="rooms" label="Habitaciones">
                            <InputNumber size="small"/>
                        </Form.Item>

                        <Form.Item name="pets" label="Acepta Mascotas" valuePropName="checked">
                            <Checkbox />
                        </Form.Item>

                        <Form.Item name="gym" label="Gimnasio" valuePropName="checked">
                            <Checkbox/>
                        </Form.Item>

                        <Form.Item name="pool" label="Pileta" valuePropName="checked">
                            <Checkbox/>
                        </Form.Item>

                        <Form.Item name="playroom" label="Salón de Juegos" valuePropName="checked">
                            <Checkbox/>
                        </Form.Item>

                        <Form.Item name="garage" label="Garage" valuePropName="checked">
                            <Checkbox/>
                        </Form.Item>

                        <Form.Item name="balcony" label="Balcón" valuePropName="checked">
                            <Checkbox/>
                        </Form.Item>

                        <Form.Item name="elevator" label="Ascensor" valuePropName="checked">
                            <Checkbox/>
                        </Form.Item>
                        
                        <Form.Item name="furnished" label="Amoblado" valuePropName="checked">
                            <Checkbox/>
                        </Form.Item>

                        <Form.Item name="ownerInhabited" label="Vivir con dueño" valuePropName="checked">
                            <Checkbox/>
                        </Form.Item>
                    </div>

                    <Form.Item>
                        <Button htmlType="submit">Filtrar</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

const FilterAds = ({onFilter}) => {
    const [filters] = Form.useForm();

    const sendFilters = values => {
        let filtros = Object.entries(values).filter( f => f[1] );
        let json = {}
        filtros.map( m => json = {...json, [m[0]]: m[1] } )
        onFilter(json)
    }

    return (
        <div className="panel" >
            <div className="filter-content">
                <Form form={filters} onFinish={sendFilters}>
                    <div className="form">
                        <Form.Item name="filter" label="Nombre">
                            <Input size="small"/>
                        </Form.Item>

                        <Form.Item name="status" label="Activas" valuePropName="checked">
                            <Checkbox />
                        </Form.Item>

                    </div>
                    <Form.Item>
                        <Button htmlType="submit">Filtrar</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

const Filters = ({title, onFilter, type = 'properties'}) => {
    const [collapse, setCollapse] = useState( window.screen.width > 600 ? true : false );
    const toggleCollapse = () => setCollapse(!collapse);
    const filter = type === 'properties' ? <FilterProperties onFilter={onFilter} /> : <FilterAds onFilter={onFilter} />;

    return (
        <div className="wrapper-filter">
            <div className="header" onClick={toggleCollapse}>
                <span><FilterOutlined />{title}</span>
                {collapse ? <CloseOutlined className="filter__icon-button" /> : <DownOutlined className="filter__icon-button"/>} 
            </div>

            {collapse && filter}
            
        </div>
    )
}

export default Filters;
