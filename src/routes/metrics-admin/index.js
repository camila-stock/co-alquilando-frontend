import React, { useState, useEffect, useContext } from 'react';
import { Menu, Switch, Divider } from 'antd';
import ContentWrapper from '../../components/ContentWrapper';
import AdminMenuReports from '../../components/AdminMenuReports';
import ColumChart from '../../components/Charts/ColumChart';
import { SessionContext } from '../../store';
import ApiRequest from '../../util/ApiRequest';
import FilterNav from '../../components/FilterNav';
import WaitingSelection from '../../components/WaitingSelection';
import { HomeOutlined } from "@ant-design/icons";

const MetricsAdmin = () => {
    const [metric, setMetric] = useState(null);
    const { state } = useContext(SessionContext);
    const breadscrumb = [
        { Métricas: '/reports-admin'},
    ];

    const handleSearch = async dates => {
        const allData = true;
        const [ from, to ] = dates.map( f => f.split("T")[0]);
        const body = { allData, from, to };
        const allProm = await Promise.all([
            ApiRequest.post(`metrics/users`, body),
            ApiRequest.post(`metrics/groups`, body),
            ApiRequest.post(`metrics/properties`, body),
            ApiRequest.post(`metrics/package_purchases`, body),
            ApiRequest.post(`metrics/ads`, body),
        ]);
        const data = allProm.map( prom => prom.data);
        setMetric(data);
    }

    return (
        <ContentWrapper topNav breadscrumb={breadscrumb}>
            <div className="page reports-admin">
                <FilterNav onSearch={handleSearch} />
                <AdminMenuReports data={metric} />
            </div>
        </ContentWrapper>
    );
};

export default MetricsAdmin;