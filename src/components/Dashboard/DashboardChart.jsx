import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const DATASET_COLORS = [
    { bg: "#C7F0DB", border: "#1D9E75" },
    { bg: "#FDE8B0", border: "#BA7517" },
    { bg: "#F5C6C6", border: "#E24B4A" },
];

export const DashboardChart = () => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom", labels: { usePointStyle: true, pointStyle: "circle", font: { size: 11 } } },
            datalabels: { display: false },
            tooltip: { enabled: true },
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: "#9CA3AF", font: { size: 11 } } },
            y: { max: 60, grid: { color: "#F3F4F6" }, ticks: { stepSize: 20, color: "#9CA3AF", font: { size: 11 } } },
        },
    };

    const labels = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور"];
    const datasets = [
        { label: "پروژه ۱", data: [20, 30, 10, 15, 5, 25], backgroundColor: DATASET_COLORS[0].bg, borderColor: DATASET_COLORS[0].border, borderWidth: 1.5, borderRadius: 6 },
        { label: "پروژه ۲", data: [10, 15, 55, 5, 30, 10], backgroundColor: DATASET_COLORS[1].bg, borderColor: DATASET_COLORS[1].border, borderWidth: 1.5, borderRadius: 6 },
        { label: "پروژه ۳", data: [20, 25, 42, 10, 15, 5], backgroundColor: DATASET_COLORS[2].bg, borderColor: DATASET_COLORS[2].border, borderWidth: 1.5, borderRadius: 6 },
    ];

    return <Bar data={{ labels, datasets }} options={options} />;
};