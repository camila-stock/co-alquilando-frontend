import React, { useState, useEffect, useContext } from 'react';
import { Menu } from 'antd';
import PieChart from '../Charts/PieChart';
import ColumChart from '../Charts/ColumChart';
import ChartRepository from '../Charts/ChartRepository';
import Spin from '../Spin';
import { SessionContext } from '../../store';
import ApiRequest from '../../util/ApiRequest';

const items = [
];

const AdminMenuReports = ({
  metric,
}) => {
    const [selectedItem, setselectedItem] = useState('0');
    const handleItem = ({key}) => setselectedItem(key);

    const newMetrics = metric && metric.map( chart => {
      return <ChartRepository metric={chart} />
    })

    return (
    <div className='menu reports'>
      <Menu className="menu-admin-reports" defaultSelectedKeys={['0']}>
        {metric && metric.map( (item, index) => (
          <Menu.Item 
            key={index}
            onClick={handleItem}
            >
            {item.data.datasets[0].label}
          </Menu.Item>
        ))}
      </Menu>

      <section className="charts">
        {metric 
        ? newMetrics[selectedItem] 
        : <Spin />}
      </section>
    </div>
    );
};

export default AdminMenuReports;