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
    options: {
      ...commonsProps.options,
      ...metric?.data?.datasets?.[0]?.options,
      ...metric?.options,
    },
  };

	const data = {
		labels: metric.data.labels,
		datasets : [{
			label: metric.data.datasets[0].label,
			data: metric.data.datasets[0].data,
			backgroundColor: metric.data.datasets[0].backgroundColor,
		}],
	}

	const repository = {
		line: (
			<div className="metric-graphic">
				<Line data={data} {...props}/>
			</div>
		),
		bar: (
			<div className="metric-graphic">
				<Bar data={data} {...props} />
			</div>
		),
		doughnut:	(
			<div className="metric-graphic--doughnut">
				<h1>{metric.data.datasets[0].label}</h1>
				<Doughnut data={data} {...props} style={{ width: "50%" }} />
			</div>
		),
	}

	return (
		<div className="metric-container">
			{repository[metric.type] || metric.doughnut}
		</div>
	);
};

export default ChartRepository
