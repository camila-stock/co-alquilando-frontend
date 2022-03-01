import React, { useState } from 'react';
import { Menu } from 'antd';
import ChartRepository from '../Charts/ChartRepository';

const AdminMenuReports = ({
  data,
  items,
  error,
}) => {
    const [selectedItem, setselectedItem] = useState('0');
    const handleItem = ({key}) => setselectedItem(key);

    const newMetrics = data && data.map((d, index) => {
      return (
        <div key={index} style={{ width:'100%', margin: 'auto' }}>
          <div className="metric-tab">
            {Object.keys(d.singleData).map( labels => (
              <div key={labels} style={{ display: "flex", gap: 8}}>
                <div>{`${labels}:`}</div>
                <div>{d.singleData[labels]}</div>
              </div>
            ))}
          </div>
          {d.charts.map((t, index) => <ChartRepository key={index} metric={t} />) }
        </div>
      )
    })

    return (
    <div className='menu reports'>
      <Menu className="menu-admin-reports" defaultSelectedKeys={['0']}>
        {items.map( (item, index) => (
          <Menu.Item 
            key={index}
            onClick={handleItem}
            >
            {item}
          </Menu.Item>
        ))}
      </Menu>
      <section className="charts">
        {data 
          ? newMetrics[selectedItem] 
          : "Ingrese fechas" }
        {error 
        ? <div style={{color: 'red'}}>{error}</div>
        : null}
      </section>
    </div>
    );
};

export default AdminMenuReports;