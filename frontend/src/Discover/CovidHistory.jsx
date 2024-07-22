import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { useInView } from 'react-intersection-observer';
import { PuffLoader } from 'react-spinners';
import 'chart.js/auto';
import './CovidHistory.css';

export default function CovidHistory() {
  const [data, setData] = useState(null);
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://disease.sh/v3/covid-19/historical/all?lastdays=all');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching historical COVID-19 data:', error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="loading-container">
        <PuffLoader color={"#123abc"} loading={true} size={350} />
      </div>
    );
  }

  const chartData = {
    labels: Object.keys(data.cases),
    datasets: [
      {
        label: 'New Cases',
        data: Object.values(data.cases),
        fill: false,
        borderColor: 'blue',
        borderWidth: 1,
      },
      {
        label: 'Deaths',
        data: Object.values(data.deaths),
        fill: false,
        borderColor: 'red',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 10,
        },
      },
      y: {
        grid: {
          display: true,
        },
        ticks: {
          maxTicksLimit: 5,
          callback: function(value) {
            return value / 1000000 + 'M';
          },
        },
      },
    },

    animation: {
      delay: 2000,
      duration: 2000,
    },
  };

  return (
    <div ref={ref} className={`covid-history-container ${inView ? 'animate' : ''}`}>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
