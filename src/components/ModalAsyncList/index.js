import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import ApiRequest from '../../util/ApiRequest';

const ModalAsyncList = ({endpoint, label, title, itemTitle}) => {
    const [data, setData] = useState(null)
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState({});

    useEffect( ()=>{
        if (!visible || data) return;
        let getAsync = async () => {
            let { data } = await ApiRequest.get(`${endpoint}`);
            setData( data );
        }
        getAsync();
    },[visible, data, endpoint])

    const handleVisible = () => {
        setVisible(!visible)
    }

    const isSelected = item => {
        return selected[itemTitle] === item[itemTitle] ? "selected" : ""
    }

    const handleSelected = item => {
        setSelected(item)
    }

    return (
        <div className="modal-async-list-wrapp">
            <div onClick={handleVisible}> { label } </div>
            <Modal
                visible={visible}
                onCancel={handleVisible}
                onOk={handleVisible}
                className="modal-async-list"
            >
                <div className="title">{ title }</div>
                {data?.map( (item, index) => {
                    return (
                        <div onClick={() => handleSelected(item)} key={index} className={`item ${isSelected(item)}`}>
                            <div>{item[itemTitle]}</div>
                        </div>
                    )
                })}
            </Modal>
        </div>
    )
}

export default ModalAsyncList;