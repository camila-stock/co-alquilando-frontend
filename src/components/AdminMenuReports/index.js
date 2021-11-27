import React, { useState, useEffect, useContext } from 'react';
import { Menu } from 'antd';
import ChartRepository from '../Charts/ChartRepository';

const AdminMenuReports = ({
  data,
  items,
}) => {
    const [selectedItem, setselectedItem] = useState('0');
    const handleItem = ({key}) => setselectedItem(key);

    const newMetrics = data && data.map( d => {
      return (
        <>
          <div style={{ color: "#656565", width: 600}}>
            {Object.keys(d.singleData).map( labels => (
              <div style={{ display: "flex", gap: 8}}>
                <div>{`${labels}:`}</div>
                <div>{d.singleData[labels]}</div>
              </div>
            ))}
          </div>
          {d.charts.map( t => <ChartRepository metric={t} />) }
        </>
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
      </section>
    </div>
    );
};

export default AdminMenuReports;