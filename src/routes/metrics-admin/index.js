import React, { useState, useEffect, useContext } from 'react';
import { Menu, Switch, Divider } from 'antd';
import ContentWrapper from '../../components/ContentWrapper';
import AdminMenuReports from '../../components/AdminMenuReports';
import ColumChart from '../../components/Charts/ColumChart';
import { SessionContext } from '../../store';
import ApiRequest from '../../util/ApiRequest';
import mock from './mock.json';
import FilterNav from '../../components/FilterNav';

const MetricsAdmin = () => {
    const [metric, setMetric] = useState(null);
    const { state } = useContext(SessionContext);
    const breadscrumb = [
        { Métricas: '/reports-admin'},
    ];

    useEffect(()=>{
        const getMetric = async () => {
            // await ApiRequest.get(`metric/owner/${state.user.id}`)
            //     .then(({ data }) => {
            //         setMetric(data);
            //     })
            setMetric(mock.charts);
            };
        getMetric();
    },[]);
    
    const handleSearch = async body => {
        await ApiRequest.post(`metric/owner/${state.user.id}`, body)
            // .then(({ data }) => {
            //     setMetric(data);
            // })
        console.log(`body`, body);
    }

    return (
        <ContentWrapper topNav breadscrumb={breadscrumb}>
            <div className="page reports-admin">
                <FilterNav onSearch={handleSearch} />
                <AdminMenuReports metric={metric} />
            </div>
        </ContentWrapper>
    );
};

export default MetricsAdmin;