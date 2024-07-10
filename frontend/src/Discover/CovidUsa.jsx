import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import './CovidUsa.css'

export default function CovidUsa() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://disease.sh/v3/covid-19/countries/usa');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching COVID-19 data:', error);
      }
    };

    fetchData();
  }, []);

  if (!data) return <div>Loading...</div>;

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
            <p>Critical: {data.critical}</p>
            <p>Cases per Million: {data.casesPerOneMillion}</p>
            <p>Deaths per Million: {data.deathsPerOneMillion}</p>
            <p>Tests: {data.tests}</p>
            <p>Population: {data.population}</p>
            <p>Continent: {data.continent}</p>
            <p>Active Cases per Million: {data.activePerOneMillion}</p>
            <p>Recovered per Million: {data.recoveredPerOneMillion}</p>
            <p>Critical per Million: {data.criticalPerOneMillion}</p>
        </div>
        <div className='covid-usa-graph'>
            <Doughnut data={chartData} />
        </div>
    </div>
  );
}
