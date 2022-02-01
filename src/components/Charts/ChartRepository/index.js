import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

const ChartRepository = ({ metric }) => {
	
	const commonsProps = {
		height: 400,
		width: 600,
		options: {
			responsive: true,
			plugins: {
				legend: {
					position: 'top',
				}
			}
		},
	}

	const props = {
		...commonsProps,
		options:{
			...commonsProps.options,
			...metric?.data?.datasets?.[0]?.options
		}
		
	}

	const data = {
		labels: metric.data.labels,
		datasets : [{
			label: metric.data.datasets[0].label,
			data: metric.data.datasets[0].data,
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)',
			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
			],
		}],
	}

	const repository = {
		line:			<Line data={data} {...props}  />,
		bar:			<Bar data={data} {...props}  />,
		doughnut:	<Doughnut data={data} {...props} style={{ width: "50%" }} />,
	}

	return (
		<div style={{ textAlign: 'center', padding: '36px 0' }}>
			{repository[metric.type] || metric.doughnut}
		</div>
	);
};

export default ChartRepository
