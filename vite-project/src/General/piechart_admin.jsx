import React from 'react'


import { Pie } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js'
Chart.register(ArcElement);


function Piechart({ answered, unattempted, incorrect }) {
    
    const data = {
        labels: ['Answered', 'Unattempted', 'Incorrect'],
        datasets: [
          {
            data: [answered, unattempted, incorrect],
            backgroundColor: ['#00FF00', '#808080', '#FF0000'],
            hoverBackgroundColor: ['#00FF00', '#808080', '#FF0000'],
          },
        ],
      };
      
      return <Pie  data={data} />;
}

export default Piechart