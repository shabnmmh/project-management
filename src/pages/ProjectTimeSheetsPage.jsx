// TimesheetsPage.jsx

import { useState, useRef, useEffect } from "react";
import { ArrowDown2, ArrowUp2, ArrowLeft2, ArrowRight2, Profile } from "iconsax-reactjs";
import { FaClock } from "react-icons/fa";
import { useSelector } from "react-redux";

const sampleTasks = [
    { projectId: 1, tasks: [ { id: 1, taskName: "Frontend Development", employeeName: "dual user", time: "9 hours and 35 minutes", subUsers: [{ name: "Alireza Saeedi", time: "4 hours" }, { name: "Amin Rostami", time: "5 hours and 35 minutes" }] }, { id: 2, taskName: "UI Implementation", employeeName: "Alireza", time: "2 hours and 5 minutes" } ], totalProjectTime: "11 hours and 40 minutes" },
    { projectId: 2, tasks: [ { id: 1, taskName: "UI/UX Design", employeeName: "Sara Ahmadi", time: "7 hours and 20 minutes" }, { id: 2, taskName: "Backend API", employeeName: "dual user", time: "12 hours and 45 minutes", subUsers: [{ name: "Reza Karimi", time: "6 hours and 10 minutes" }, { name: "Mina Hosseini", time: "6 hours and 35 minutes" }] } ], totalProjectTime: "20 hours and 5 minutes" },
    { projectId: 3, tasks: [ { id: 1, taskName: "Database Design", employeeName: "Mohammad Rezaei", time: "5 hours and 15 minutes" }, { id: 2, taskName: "Patient Portal", employeeName: "Fatemeh Hosseini", time: "8 hours and 30 minutes" } ], totalProjectTime: "13 hours and 45 minutes" },
    { projectId: 4, tasks: [ { id: 1, taskName: "Data Analysis", employeeName: "dual user", time: "10 hours and 20 minutes", subUsers: [{ name: "Dariush Nejad", time: "5 hours and 50 minutes" }, { name: "Leila Moradi", time: "4 hours and 30 minutes" }] }, { id: 2, taskName: "Dashboard Development", employeeName: "Kamran Sharifi", time: "6 hours and 10 minutes" } ], totalProjectTime: "16 hours and 30 minutes" },
    { projectId: 5, tasks: [ { id: 1, taskName: "Requirements Gathering", employeeName: "Nastaran Ebadi", time: "3 hours and 45 minutes" }, { id: 2, taskName: "Backend Services", employeeName: "dual user", time: "14 hours and 0 minutes", subUsers: [{ name: "Arman Taheri", time: "8 hours" }, { name: "Golnaz Sadeghi", time: "6 hours" }] }, { id: 3, taskName: "Testing & QA", employeeName: "Babak Fattahi", time: "4 hours and 20 minutes" } ], totalProjectTime: "22 hours and 5 minutes" },
    { projectId: 6, tasks: [ { id: 1, taskName: "Model Training", employeeName: "dual user", time: "18 hours and 30 minutes", subUsers: [{ name: "Sina Rashidi", time: "10 hours and 15 minutes" }, { name: "Parisa Nouri", time: "8 hours and 15 minutes" }] }, { id: 2, taskName: "API Integration", employeeName: "Hossein Mohammadi", time: "5 hours and 0 minutes" } ], totalProjectTime: "23 hours and 30 minutes" },
    { projectId: 7, tasks: [ { id: 1, taskName: "UX Research", employeeName: "Mahsa Kazemi", time: "4 hours and 40 minutes" }, { id: 2, taskName: "Frontend Rebuild", employeeName: "dual user", time: "11 hours and 15 minutes", subUsers: [{ name: "Yasaman Kargar", time: "5 hours and 30 minutes" }, { name: "Omid Nazari", time: "5 hours and 45 minutes" }] } ], totalProjectTime: "15 hours and 55 minutes" },
    { projectId: 8, tasks: [ { id: 1, taskName: "Database Schema", employeeName: "Saeed Ghorbani", time: "6 hours and 0 minutes" }, { id: 2, taskName: "Module Development", employeeName: "dual user", time: "9 hours and 50 minutes", subUsers: [{ name: "Neda Ahmadi", time: "4 hours and 50 minutes" }, { name: "Pouya Samadi", time: "5 hours" }] } ], totalProjectTime: "15 hours and 50 minutes" },
];

const DualUserTooltip = ({ subUsers, anchorRect }) => {
    const tooltipRef = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    useEffect(() => {
        if (tooltipRef.current)
            setSize({ width: tooltipRef.current.offsetWidth, height: tooltipRef.current.offsetHeight });
    }, []);
    return (
        <div ref={tooltipRef} style={{ position: "fixed", top: size.height === 0 ? -9999 : anchorRect.top - size.height - 14, left: anchorRect.left, zIndex: 9999, pointerEvents: "none" }}>
            <div style={{ background: "#fff", borderRadius: "16px", padding: "18px 28px", minWidth: "280px", boxShadow: "0 4px 24px rgba(0,0,0,0.13)", position: "relative" }}>
                {subUsers.map((user, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "10px", marginBottom: idx < subUsers.length - 1 ? "14px" : 0, direction: "ltr" }}>
                        <span style={{ fontSize: "15px", color: "#1a1a2e" }}>{user.name}</span>
                        <span style={{ fontSize: "15px", color: "#1e3a5f", fontWeight: 700 }}>{user.time}</span>
                    </div>
                ))}
                <div style={{ position: "absolute", bottom: "-15px", left: "20px", width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderTop: "16px solid #fff" }} />
            </div>
        </div>
    );
};

const DualUserCell = ({ employeeName, subUsers }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [anchorRect, setAnchorRect] = useState(null);
    const spanRef = useRef(null);
    const isDual = employeeName === "dual user" && subUsers?.length > 0;
    return (
        <div className="flex-1"
             onMouseEnter={() => { if (!isDual || !spanRef.current) return; setAnchorRect(spanRef.current.getBoundingClientRect()); setShowTooltip(true); }}
             onMouseLeave={() => { setShowTooltip(false); setAnchorRect(null); }}>
            {isDual && showTooltip && anchorRect && <DualUserTooltip subUsers={subUsers} anchorRect={anchorRect} />}
            <span ref={spanRef} className="text-sm text-gray-900"
                  style={{ cursor: isDual ? "pointer" : "default", textDecoration: isDual ? "underline dotted" : "none", textUnderlineOffset: "3px" }}>
                {employeeName}
            </span>
        </div>
    );
};

export default function TimesheetsPage() {
    const projects = useSelector(s => s.projects.list);  // ← از Redux

    const [expandedProjects, setExpandedProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 3;

    // ادغام داده‌های تسک با اسم پروژه از Redux
    const mergedProjects = sampleTasks.map((item, index) => {
        const reduxProject = projects.find(p => p.id === item.projectId);
        return {
            id: item.projectId,
            rowIndex: index + 1,
            projectName: reduxProject?.title ?? `پروژه ${item.projectId}`,
            totalProjectTime: item.totalProjectTime,
            tasks: item.tasks,
        };
    });

    const totalPages = Math.ceil(mergedProjects.length / ITEMS_PER_PAGE);
    const currentProjects = mergedProjects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const toggleProject = (id) => setExpandedProjects(prev => prev.includes(id) ? [] : [id]);

    const renderPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("...");
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="w-full h-full p-4 flex flex-col gap-4" dir="rtl">
            <h1 className="p-2 px-4 rounded-lg flex items-center gap-2 text-white text-xl font-normal w-fit"
                style={{ background: "linear-gradient(135deg, #E91E8C, #AD1457)" }}>
                <FaClock size={20} /> زمان بندی پروژه ها
            </h1>

            <div className="flex-1 bg-[#DCF0F966] rounded-2xl border border-primary-400 p-6 flex flex-col overflow-hidden gap-3">
                {/* Table Header */}
                <div className="bg-primary-600 text-white rounded-lg px-6 py-4 flex items-center gap-4 flex-shrink-0">
                    <span className="w-16 flex-shrink-0 text-sm font-semibold">#</span>
                    <div className="w-16 flex-shrink-0" />
                    <span className="flex-[3.5] text-sm font-semibold">نام پروژه</span>
                    <span className="flex-[2.7] text-sm font-semibold">نام تسک</span>
                    <span className="flex-[4] text-sm font-semibold">نام کارمند</span>
                    <span className="flex-[0.7] text-sm font-semibold">زمان تسک</span>
                </div>

                {/* Rows */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                    {currentProjects.map(project => {
                        const isExpanded = expandedProjects.includes(project.id);
                        return (
                            <div key={project.id} className="flex items-start gap-3">
                                <div className="w-16 h-16 flex-shrink-0 rounded-lg border border-gray-800 flex items-center justify-center text-base font-semibold text-gray-800">
                                    {project.rowIndex.toString().padStart(2, "0")}
                                </div>
                                <div className="flex-1 border border-gray-800 rounded-lg overflow-hidden">
                                    <div onClick={() => toggleProject(project.id)}
                                         className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-black/5 transition-colors">
                                        <div className="flex items-center gap-2">
                                            {isExpanded ? <ArrowUp2 size={20} className="text-gray-500" /> : <ArrowDown2 size={20} className="text-gray-500" />}
                                            <span className="text-sm text-gray-700">
                                                مجموع زمان پروژه: <strong>{project.totalProjectTime}</strong>
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">{project.projectName}</p>
                                    </div>
                                    {isExpanded && (
                                        <div className="space-y-2 px-3 pb-3">
                                            {project.tasks.map(task => (
                                                <div key={task.id} className="flex items-center gap-4 bg-white border border-[#DCF0F9] rounded-lg px-6 py-3">
                                                    <div className="flex items-center gap-2 flex-shrink-0 w-12">
                                                        <span className="text-xs font-medium text-gray-500">{task.id.toString().padStart(2, "0")}</span>
                                                        <Profile size={16} className="text-gray-600" />
                                                    </div>
                                                    <div className="flex-[2]" />
                                                    <span className="flex-[2] text-sm font-medium text-gray-900 truncate">{task.taskName}</span>
                                                    <DualUserCell employeeName={task.employeeName} subUsers={task.subUsers} />
                                                    <span className="flex-[2] text-sm text-gray-700" dir="ltr">{task.time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination — مثل MyTasklistPage */}
                <div className="flex items-center justify-start gap-1.5 flex-shrink-0">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                            className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:border-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed">
                        <ArrowRight2 size={16} />
                    </button>
                    {renderPageNumbers().map((page, idx) => (
                        <button key={idx}
                                onClick={() => typeof page === "number" && setCurrentPage(page)}
                                disabled={page === "..."}
                                className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${page === currentPage ? "text-white" : page === "..." ? "text-gray-400 cursor-default" : "border border-gray-300 text-gray-600 hover:bg-gray-100 bg-white"}`}
                                style={page === currentPage ? { background: "linear-gradient(135deg, #E91E8C, #9C27B0)" } : {}}>
                            {page}
                        </button>
                    ))}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                            className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:border-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed">
                        <ArrowLeft2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}