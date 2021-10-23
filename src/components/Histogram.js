import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

export default function Histogram({ data, color }) {
  const [labels, setLabels] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    console.log(data);
    const N = data.length;
    const numBins = Math.ceil(Math.sqrt(N));
    const max = Math.max(...data);
    const min = Math.min(...data);

    let binWidth = (max - min) / numBins;
    binWidth = binWidth == 0 ? 1 : binWidth;

    const newLabels = [];
    const newChartData = [];
    let prev = min;

    for (let i = 0; i < numBins; i++) {
      newLabels.push(prev.toFixed(4));
      newChartData.push(
        data.filter((val) => {
          if (i === numBins - 1) return val >= prev;
          return val >= prev && val < prev + binWidth;
        }).length
      );
      prev += binWidth;
    }

    setLabels(newLabels);
    setChartData(newChartData);
  }, [data]);

  return (
    <div>
      <Bar
        datatype="bar"
        data={{
          labels: labels,
          datasets: [
            {
              label: "Rewards",
              data: chartData,
              backgroundColor: color,
            },
          ],
        }}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (val) => (val % 1 == 0 ? val : null),
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
          maintainAspectRatio: false,
        }}
        width={300}
        height={300}
      ></Bar>
    </div>
  );
}
