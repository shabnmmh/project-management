import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

const STATUS_CHART_COLORS = {
    Backlog: { main: "#0B76B7" },
    InProgress: { main: "#FD8F02" },
    Done: { main: "#22AD5C" },
};



export const AppTaskProgressMiniChart = ({ value, status}) => {
    const colors = STATUS_CHART_COLORS[status];
    const emptyColor = "#DCF0F9";
    const gapColor = "#ffffff";

    const data = {
        datasets: [
            {
                data: [value, 100 - value],
                backgroundColor: [colors.main, emptyColor],
                weight: 12,
                borderWidth: 0,
                borderRadius: 0,
                borderSkipped: false,
            },
            {
                data: [100],
                backgroundColor: [gapColor],
                weight: 3,
                borderWidth: 0,
            },
            {
                data: [value, 100 - value],
                backgroundColor: [colors.main, emptyColor],
                weight: 12,
                borderWidth: 0,
                borderRadius: 0,
                borderSkipped: false,
            },
        ],
    };

    const options = {
        cutout: "55%",
        rotation: -90,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
            datalabels: { display: false },
        },
    };

    return (
        <div className="relative w-20 h-20">
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold" style={{ color: colors.main }}>
          {value}%
        </span>
            </div>
        </div>
    );
};