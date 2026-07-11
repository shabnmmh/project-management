import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProject, updateProject } from "../store/projectsSlice";
import { FiClipboard, FiClock, FiEdit, FiArrowLeft } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { Add, SearchNormal1, Candle2 } from "iconsax-reactjs";
import { motion, AnimatePresence } from "framer-motion";
import { AppTaskProgressMiniChart } from "../components/AppTaskProgressMiniChart.jsx";
import AppDatePicker from "../components/AppDatePicker.jsx";

const STATUS_CONFIG = {
    Backlog:    { label: "در انتظار",    color: "#0B76B7", bgLight: "#DCEBF4" },
    InProgress: { label: "در حال انجام", color: "#FD8F02", bgLight: "#FFE5CC" },
    Done:       { label: "انجام شده",    color: "#22AD5C", bgLight: "#DFF3E7" },
};

// ─── Edit Modal ───────────────────────────────────────────────────────────────
const EditProjectModal = ({ project, onClose, onSave }) => {
    const [form, setForm] = useState({
        title:     project.title,
        status:    project.status,
        startDate: project.startDate,
        deadline:  project.deadline,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...project, ...form });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" dir="rtl">
            <div className="bg-white rounded-xl p-6 w-[500px] max-w-full shadow-xl">
                <h2 className="text-lg font-bold mb-1">ویرایش پروژه</h2>
                <p className="text-xs text-gray-400 mb-4">میزان پیشرفت به صورت خودکار از تسک‌های تکمیل‌شده محاسبه می‌شود.</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="عنوان پروژه"
                        className="border rounded-lg p-2 text-sm"
                        value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        required
                    />
                    <select
                        className="border rounded-lg p-2 text-sm"
                        value={form.status}
                        onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    >
                        <option value="Backlog">در انتظار</option>
                        <option value="InProgress">در حال انجام</option>
                        <option value="Done">انجام شده</option>
                    </select>
                    <AppDatePicker
                        label="تاریخ شروع"
                        value={form.startDate}
                        onChange={val => setForm(f => ({ ...f, startDate: val }))}
                        placeholder="تاریخ شروع را انتخاب کنید"
                    />
                    <AppDatePicker
                        label="ددلاین"
                        value={form.deadline}
                        onChange={val => setForm(f => ({ ...f, deadline: val }))}
                        placeholder="تاریخ ددلاین را انتخاب کنید"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-sm">
                            انصراف
                        </button>
                        <button type="submit" className="px-4 py-2 text-white rounded-lg text-sm"
                                style={{ background: "linear-gradient(135deg, #E91E8C, #9C27B0)" }}>
                            ذخیره
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Add Modal ────────────────────────────────────────────────────────────────
const AddProjectModal = ({ isOpen, onClose, onAdd }) => {
    const [form, setForm] = useState({
        title: "", status: "Backlog", startDate: "", deadline: "",
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim()) return;
        onAdd({ id: Date.now(), ...form, progress: 0, members: [] });
        setForm({ title: "", status: "Backlog", startDate: "", deadline: "" });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" dir="rtl">
            <div className="bg-white rounded-xl p-6 w-[500px] max-w-full shadow-xl">
                <h2 className="text-lg font-bold mb-4">افزودن پروژه جدید</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="عنوان پروژه"
                        className="border rounded-lg p-2 text-sm"
                        value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        required
                    />
                    <select
                        className="border rounded-lg p-2 text-sm"
                        value={form.status}
                        onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    >
                        <option value="Backlog">در انتظار</option>
                        <option value="InProgress">در حال انجام</option>
                        <option value="Done">انجام شده</option>
                    </select>
                    <AppDatePicker
                        label="تاریخ شروع"
                        value={form.startDate}
                        onChange={val => setForm(f => ({ ...f, startDate: val }))}
                        placeholder="تاریخ شروع را انتخاب کنید"
                    />
                    <AppDatePicker
                        label="ددلاین"
                        value={form.deadline}
                        onChange={val => setForm(f => ({ ...f, deadline: val }))}
                        placeholder="تاریخ ددلاین را انتخاب کنید"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-sm">
                            انصراف
                        </button>
                        <button type="submit" className="px-4 py-2 text-white rounded-lg text-sm"
                                style={{ background: "linear-gradient(135deg, #E91E8C, #9C27B0)" }}>
                            افزودن
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
    const dispatch  = useDispatch();
    const navigate  = useNavigate();
    const projects  = useSelector(s => s.projects.list);

    const [hoveredId,       setHoveredId]       = useState(null);
    const [searchTerm,      setSearchTerm]       = useState("");
    const [isSearchOpen,    setIsSearchOpen]     = useState(false);
    const [isAddModalOpen,  setIsAddModalOpen]   = useState(false);
    const [editingProject,  setEditingProject]   = useState(null);

    const filtered = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full h-full p-4" dir="rtl">
            <div className="flex flex-col gap-4">

                {/* ─── Header ─── */}
                <div className="flex justify-between items-center flex-wrap gap-3 mb-2">
                    <h1 className="p-2 px-4 rounded-lg flex items-center gap-2 text-white text-xl font-normal"
                        style={{ background: "linear-gradient(135deg, #E91E8C, #AD1457)" }}>
                        <Candle2 size={22} /> همه پروژه‌ها
                    </h1>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 px-3 py-2 border border-primary-400 rounded-lg bg-white text-gray-700 text-sm"
                        >
                            <Add size={18} /> افزودن پروژه
                        </button>

                        <AnimatePresence>
                            {isSearchOpen ? (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "220px" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="overflow-hidden flex items-center gap-2"
                                >
                                    <div className="relative w-full">
                                        <SearchNormal1 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="جستجو..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            className="w-full pr-9 p-2 border border-primary-400 rounded-lg text-sm focus:outline-none"
                                        />
                                    </div>
                                    <button
                                        onClick={() => { setIsSearchOpen(false); setSearchTerm(""); }}
                                        className="text-gray-500 text-sm"
                                    >✕</button>
                                </motion.div>
                            ) : (
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="p-2 border border-primary-400 rounded-lg bg-white text-gray-700"
                                >
                                    <SearchNormal1 size={18} />
                                </button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ─── Grid ─── */}
                <div className="rounded-xl border border-primary-400 p-5"
                     style={{ backgroundColor: "rgba(252,228,240,0.15)" }}>
                    {filtered.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">پروژه‌ای یافت نشد</div>
                    ) : (
                        <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-6">
                            {filtered.map(project => {
                                const config    = STATUS_CONFIG[project.status] || STATUS_CONFIG.Backlog;
                                const isHovered = hoveredId === project.id;

                                return (
                                    <div
                                        key={project.id}
                                        className="rounded-xl shadow-md p-5 border w-full transition-all duration-200"
                                        style={{
                                            backgroundColor: isHovered ? config.bgLight : "#ffffff",
                                            borderColor:     isHovered ? config.color   : "transparent",
                                        }}
                                        onMouseEnter={() => setHoveredId(project.id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                    >
                                        <div className="flex flex-col gap-4">

                                            {/* Title + Buttons */}
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-center gap-2 flex-1">
                                                    <FiClipboard className="text-gray-600 flex-shrink-0" size={18} />
                                                    <span className="text-sm font-semibold text-gray-800 break-words leading-tight">
                                                        {project.title}
                                                    </span>
                                                </div>
                                                <div
                                                    className={`flex gap-2 flex-shrink-0 transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                                                    style={{ minWidth: "90px" }}
                                                >
                                                    <button
                                                        onClick={() => navigate(`/projects/${project.id}`)}
                                                        className="flex items-center gap-1 px-2 py-1 text-xs border border-primary-400 rounded bg-white text-gray-700 hover:bg-primary-400 hover:text-white"
                                                    >
                                                        Board <FiArrowLeft size={11} />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingProject(project)}
                                                        className="p-1 border border-primary-400 rounded bg-white hover:bg-primary-400 hover:text-white"
                                                    >
                                                        <FiEdit size={13} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="h-px w-full bg-gray-100" />

                                            <div className="flex flex-col gap-3">
                                                {/* Status + Chart */}
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2">
                                                        <GoDotFill color={config.color} size={13} />
                                                        <span className="text-sm font-medium" style={{ color: config.color }}>
                                                            {config.label}
                                                        </span>
                                                    </div>
                                                    <AppTaskProgressMiniChart
                                                        value={project.progress}
                                                        status={project.status}
                                                        isHovered={isHovered}
                                                    />
                                                </div>

                                                {/* Start Date */}
                                                <div className="flex items-center gap-2 text-sm">
                                                    <FiClock size={13} className="text-gray-500" />
                                                    <span className="text-gray-600">شروع:</span>
                                                    <span className="text-gray-800 font-medium">
                                                        {project.startDate || "—"}
                                                    </span>
                                                </div>

                                                {/* Deadline */}
                                                <div className="flex items-center gap-2 text-sm">
                                                    <FiClock size={13} className="text-red-500" />
                                                    <span className="text-red-500">ددلاین:</span>
                                                    <span className="text-gray-700 font-medium">
                                                        {project.deadline || "—"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <AddProjectModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={p => dispatch(addProject(p))}
            />

            {editingProject && (
                <EditProjectModal
                    project={editingProject}
                    onClose={() => setEditingProject(null)}
                    onSave={p => dispatch(updateProject(p))}
                />
            )}
        </div>
    );
}