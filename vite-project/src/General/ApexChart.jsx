import React, { useState,useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = ({ coursesWithTotalAmount }) => {
    const [chartData, setChartData] = useState({
      series: [{
        name: 'Revenue',
        data: coursesWithTotalAmount.map(course => course.total_amount_received || 0),
      }],
      options: {
        chart: {
          height: 350,
          type: 'bar',
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            columnWidth: '30%',
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 2
        },
        grid: {
          row: {
            colors: ['#fff', '#f2f2f2']
          }
        },
        xaxis: {
          labels: {
            rotate: -45
          },
          categories: coursesWithTotalAmount.map(course => course.name),
          tickPlacement: 'on'
        },
        yaxis: {
          title: {
            text: 'Revenue',
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100]
          },
        }
      },
    });
    useEffect(() => {
        setChartData({
          ...chartData,
          series: [{
            name: 'Revenue',
            data: coursesWithTotalAmount.map(course => course.total_amount_received || 0),
          }],
          options: {
            ...chartData.options,
            xaxis: {
              ...chartData.options.xaxis,
              categories: coursesWithTotalAmount.map(course => course.name),
            },
          },
        });
      }, [coursesWithTotalAmount]);
    
  

  return (
    <div id="chart">
      <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={350} />
    </div>
  );
};

export default ApexChart;
