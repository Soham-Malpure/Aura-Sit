import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

function PostureChart() {

  const data = {
    labels: ["0", "5", "10", "15", "20", "25"],

    datasets: [
      {
        label: "Chest Distance",
        data: [55, 53, 52, 48, 45, 44],
        borderColor: "#3498db",
        tension: 0.4
      },
      {
        label: "Face Distance",
        data: [52, 51, 49, 46, 43, 41],
        borderColor: "#2ecc71",
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      }
    }
  };

  return <Line data={data} options={options} />;
}

export default PostureChart;