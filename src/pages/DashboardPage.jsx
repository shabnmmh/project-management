import { useSelector } from "react-redux";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { DashboardChart } from "../components/Dashboard/DashboardChart.jsx";
import DashboardTasksList from "../components/Dashboard/DashboardTasksList.jsx";
import { TaskProgressChart } from "../components/Dashboard/TaskProgressChart.jsx";
import { DashboardCoWorkers } from "../components/Dashboard/DashboardCoWorkers.jsx";

export default function DashboardPage() {
    const projects = useSelector(s => s.projects.list);
    const tasks = useSelector(s => s.tasks.list);

    const activeProjects = projects.filter(p => p.status === "InProgress").length;
    const doneTasks = tasks.filter(t => t.status === "Done").length;
    const inProgressTasks = tasks.filter(t => t.status === "InProgress").length;
    const overdueTasks = tasks.filter(t => t.status === "Overdue").length;

    const metrics = [
        { label: "پروژه‌های فعال", value: activeProjects, sub: `از ${projects.length} پروژه`, accent: "#E91E8C" },
        { label: "تسک‌های تکمیل‌شده", value: doneTasks, sub: `از ${tasks.length} تسک`, accent: "#1D9E75" },
        { label: "در حال انجام", value: inProgressTasks, sub: `${overdueTasks} تسک در تاخیر`, accent: "#BA7517" },
        { label: "همکاران", value: 16, sub: "4 آنلاین", accent: "#9C27B0" },
    ];

    return (
        <div className="w-full h-full p-4 flex flex-col gap-4" dir="rtl">
            <h1 className="p-2 px-4 rounded-lg flex items-center gap-2 text-white text-xl font-normal w-fit"
                style={{ background: "linear-gradient(135deg, #E91E8C, #AD1457)" }}>
                <FaHome size={20} /> داشبورد
            </h1>

            <div className="grid grid-cols-4 gap-3">
                {metrics.map((m, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
                         style={{ borderRight: `3px solid ${m.accent}` }}>
                        <p className="text-xs text-gray-500 mb-1">{m.label}</p>
                        <p className="text-3xl font-medium text-gray-800">{m.value}</p>
                        <p className="text-xs text-gray-400 mt-1">{m.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
                <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col min-h-0 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-800">پیشرفت پروژه‌ها</span>
                        <Link to="/projects" className="text-xs" style={{ color: "#E91E8C" }}>بیشتر ←</Link>
                    </div>
                    <div className="flex-1 min-h-0"><DashboardChart /></div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col min-h-0 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-800">وضعیت تسک‌ها</span>
                        <span className="text-xs text-gray-400">{tasks.length} تسک</span>
                    </div>
                    <div className="flex-1 min-h-0"><TaskProgressChart /></div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col min-h-0 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-800">تسک‌های اخیر</span>
                        <Link to="/my-tasklist" className="text-xs" style={{ color: "#E91E8C" }}>همه ←</Link>
                    </div>
                    <div className="flex-1 min-h-0"><DashboardTasksList /></div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col min-h-0 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-800">همکاران</span>
                        <Link to="/coworkers" className="text-xs" style={{ color: "#E91E8C" }}>همه ←</Link>
                    </div>
                    <div className="flex-1 min-h-0"><DashboardCoWorkers /></div>
                </div>
            </div>
        </div>
    );
}