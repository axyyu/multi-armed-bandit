import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart } from "react-google-charts";

export default function Histogram({ data, color }) {
  const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

  return (
    <div>
      <p>Average: {data.length === 0 ? "N/A" : average(data).toFixed(4)}</p>
      {data.length == 0 ? (
        <div className={"placeholder"}>
          <p>Select this arm once to view a histogram.</p>
        </div>
      ) : (
        <Chart
          width={"300px"}
          height={"300px"}
          chartType="Histogram"
          loader={<div className={"placeholder"}>Loading Chart</div>}
          data={[["Reward"], ...data.map((d) => [d])]}
          options={{
            legend: { position: "none" },
            colors: [color],
            vAxis: { title: "Frequency" },
            hAxis: { title: "Reward Range" },
          }}
          rootProps={{ "data-testid": "1" }}
        ></Chart>
      )}
    </div>
  );
}

// export default function Histogram({ data, color }) {
//   const [labels, setLabels] = useState([]);
//   const [chartData, setChartData] = useState([]);

//   useEffect(() => {
//     const N = data.length;
//     const numBins = Math.ceil(Math.sqrt(N));
//     const max = Math.max(...data);
//     const min = Math.min(...data);

//     let binWidth = (max - min) / numBins;
//     binWidth = binWidth == 0 ? 1 : binWidth;

//     const newLabels = [];
//     const newChartData = [];
//     let prev = min === Infinity ? 0 : min;

//     for (let i = 0; i < numBins; i++) {
//       newLabels.push(prev.toFixed(4));
//       newChartData.push(
//         data.filter((val) => {
//           if (i === numBins - 1) return val >= prev;
//           return val >= prev && val < prev + binWidth;
//         }).length
//       );
//       prev += binWidth;
//     }
//     newLabels.push(prev.toFixed(4));

//     setLabels(newLabels);
//     setChartData(newChartData);
//   }, [data]);

//   return (
//     <div>
//       <Bar
//         datatype="bar"
//         data={{
//           labels: labels,
//           datasets: [
//             {
//               label: "Rewards",
//               data: chartData,
//               backgroundColor: color,
//             },
//           ],
//         }}
//         options={{
//           scales: {
//             y: {
//               title: {
//                 display: true,
//                 text: "Frequency",
//               },
//               beginAtZero: true,
//               ticks: {
//                 callback: (val) => (val % 1 == 0 ? val : null),
//               },
//             },
//             x: {
//               title: {
//                 display: true,
//                 text: "Reward",
//               },
//             },
//           },
//           plugins: {
//             legend: {
//               display: false,
//             },
//           },
//           maintainAspectRatio: false,
//         }}
//         width={300}
//         height={300}
//       ></Bar>
//     </div>
//   );
// }
