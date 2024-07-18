// src/Discover/CovidWorldwide.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { PuffLoader } from 'react-spinners';
import 'chart.js/auto';

export default function CovidWorldwide() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://disease.sh/v3/covid-19/all');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching COVID-19 data:', error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="loading-container">
        <PuffLoader color={"#123abc"} loading={true} size={150} />
      </div>
    );
  }

  const chartData = {
    labels: ['Cases', 'Deaths', 'Recovered'],
    datasets: [
      {
        data: [data.cases, data.deaths, data.recovered],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      },
    ],
  };

  return (
    <div className='covid-usa-complete'>
    <div className='coid-usa-data'>
        <p>Cases: {data.cases}</p>
        <p>Today's Cases: {data.todayCases}</p>
        <p>Recoveries: {data.recovered}</p>
        <p>Today's Recoveries: {data.todayRecovered}</p>
        <p>Deaths: {data.deaths}</p>
        <p>Tests: {data.tests}</p>
        <p>Population: {data.population}</p>
        <p>Affected Countries: {data.affectedCountries}</p>
    </div>
    <div className='covid-usa-graph'>
        <Doughnut data={chartData} />
    </div>
</div>
  );
}
