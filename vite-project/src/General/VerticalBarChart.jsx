import React from 'react';
import { Bar } from 'react-chartjs-2';

function VerticalBarChart({ users, paiduser }) {
  const data = {
    labels: ['Users', 'Paid Users'],
    datasets: [
      {
        label: 'User Count',
        data: [users, paiduser],
        backgroundColor: ['#808080', '#00cc00'],
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'category', // Use 'category' scale for X-axis
        labels: ['Users', 'Paid Users'],
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}

export default VerticalBarChart;
