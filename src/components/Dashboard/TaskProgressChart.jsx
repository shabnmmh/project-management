import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ITEMS = [
    { label: "در انتظار", value: 40, color: "#378ADD" },
    { label: "انجام شده", value: 30, color: "#1D9E75" },
    { label: "در حال انجام", value: 20, color: "#BA7517" },
    { label: "تاخیر", value: 10, color: "#E24B4A" },
];

export const TaskProgressChart = () => {
    const data = {
        labels: ITEMS.map(i => i.label),
        datasets: [{
            data: ITEMS.map(i => i.value),
            backgroundColor: ITEMS.map(i => i.color),
            borderWidth: 0,
        }],
    };

    const options = {
        cutout: "65%",
        plugins: {
            legend: { display: false },
            datalabels: { color: "#fff", font: { weight: "500", size: 11 }, formatter: v => `${v}%` },
        },
    };

    return (
        <div className="flex items-center md:justify-around gap-6 h-full">
            <div className="w-auto h-auto max-h-52 max-w-52 flex-shrink-0" dir="ltr">
                <Doughnut data={data} options={options} />
            </div>
            <div className="flex flex-col gap-4">
                {ITEMS.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-base text-gray-600">{item.label}</span>
                        <span className="text-base font-medium text-gray-800 mr-auto">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};