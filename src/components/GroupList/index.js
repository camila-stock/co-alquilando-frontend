import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import { ArrowRightOutlined } from '@ant-design/icons';


const Group = ({name, link}) => {
    let history = useHistory();

    const handleClick = () => {
        history.push(`/groups/${link}`);
    }
    return (
        <div className="detail clickeable" onClick={handleClick} >
            <div className="header">
                <div className="name">{name}</div>
                <ArrowRightOutlined />
            </div>
            <div className="info">
                <div>
                </div>
            </div>
        </div>
    )
}


const GroupList = ({render}) => {
    console.log("GroupList -->",render)
    return (
        <div className={`group-list ${!!render}`}>
            <div className="container">
                <Group name={"Grupo 1"} link="1"/>
                <Group name={"Grupo 2"} link="2"/>
                <Group name={"Grupo 3"} link="3"/>
            </div>
        </div>
    )
}
export default GroupList;
