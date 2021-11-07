import React, { useState } from 'react';
import { DatePicker, Button } from 'antd';
const { RangePicker } = DatePicker;

const FilterNav = ({ onSearch }) => {
    const [date, setDate] = useState();

    const handleOnSearch = () => {
        const dates = date.map( d => new Date(d).toISOString());
        onSearch(dates);
    }

	return (
		<div className="filter-nav">
			<RangePicker onChange={setDate} placeholder={["Fecha Inicio", "Fecha Fin"]} />
            <Button onClick={handleOnSearch}>Filtrar</Button>
		</div>
	);
};

export default FilterNav;
