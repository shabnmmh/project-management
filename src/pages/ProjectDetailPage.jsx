import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {addTask, moveTask, deleteTask, updateTask} from "../store/tasksSlice";
import { recalculateProgress } from "../store/projectsSlice";
import {FiArrowRight, FiClock, FiTrash2, FiUsers, FiList, FiLayout, FiEdit2, FiCalendar, FiCheckCircle} from "react-icons/fi";
import { Add, ArrowDown2, ArrowUp2 } from "iconsax-reactjs";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import AppDatePicker from "../components/AppDatePicker";

const MEMBER_PHOTOS = {
    "Milad Soleymani": "https://i.pravatar.cc/150?img=3",
    "Ahmad Hosseini":  "https://i.pravatar.cc/150?img=11",
    "shabnam mahmoudi":   "https://i.pravatar.cc/150?img=41",
    "Ali Rezaei":      "https://i.pravatar.cc/150?img=14",
    "Mina Karimi":     "https://i.pravatar.cc/150?img=49",
    "Reza Mohammadi":  "https://i.pravatar.cc/150?img=52",
    "Fatemeh Moradi":  "https://i.pravatar.cc/150?img=44",
    "Hossein Ahmadi":  "https://i.pravatar.cc/150?img=53",
};
const getMemberPhoto = (name) =>
    MEMBER_PHOTOS[name] || `https://i.pravatar.cc/150?img=${Math.abs(name?.charCodeAt(0) % 50) + 1}`;

const TaskListTab = ({ tasks, dispatch }) => {
    const [editingTask, setEditingTask] = useState(null);
    const [deletingTaskId, setDeletingTaskId] = useState(null);
    const [editForm, setEditForm] = useState({});


    const STATUS_CONFIG = {
        Done: { label: "انجام شده", color: "#22AD5C" },
        InProgress: { label: "در حال انجام", color: "#FD8F02" },
        Backlog: { label: "در انتظار", color: "#1E3363" },
        Overdue: { label: "تاخیر", color: "#FD1B51" },
    };

    const handleEditOpen = (task) => {
        setEditingTask(task);
        setEditForm({
            title:    task.title,
            assignee: task.assignee,
            role:     task.role,
            status:   task.status,
            deadline: task.deadline,
            deadlineFromPicker: false,
        });
    };

    const handleEditSave = (e) => {
        e.preventDefault();
        let deadline = editForm.deadline;
        if (!editForm.deadlineFromPicker) {
            if (editForm.status === "Done")    deadline = "تکمیل شده";
            if (editForm.status === "Overdue") deadline = "تاخیر دارد";
            if (editForm.status === "Backlog") deadline = "شروع نشده";
        }
        dispatch(updateTask({ id: editingTask.id, ...editForm, deadline }));
        setEditingTask(null);
    };

    return (
        <>
            <div className="border border-primary-400 rounded-2xl overflow-hidden flex flex-col"
                 style={{ backgroundColor: "rgba(252,228,240,0.1)", maxHeight: "calc(100vh - 260px)" }}>
                <div className="overflow-auto flex-1">
                    <table className="w-full text-sm min-w-[800px]">
                        <thead className="sticky top-0 z-10">
                        <tr style={{ backgroundColor: "var(--color-primary-500)" }}>
                        <th className="px-4 py-3 text-right text-white font-medium">#</th>
                        <th className="px-4 py-3 text-right text-white font-medium">نام تسک</th>
                        <th className="px-4 py-3 text-right text-white font-medium">مسئول</th>
                        <th className="px-4 py-3 text-right text-white font-medium">نقش</th>
                        <th className="px-4 py-3 text-right text-white font-medium">افزوده شده</th>
                        <th className="px-4 py-3 text-right text-white font-medium">ددلاین</th>
                        <th className="px-4 py-3 text-right text-white font-medium">وضعیت</th>
                        <th className="px-4 py-3 text-right text-white font-medium">عملیات</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.map((task, idx) => {
                        const sc = STATUS_CONFIG[task.status] || { label: task.status, color: "#666" };
                        return (
                            <tr key={task.id} className="border-b border-gray-100 bg-white hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                                <td className="px-4 py-3 font-medium text-gray-800">{task.title}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <img src={getMemberPhoto(task.assignee)} className="w-8 h-8 rounded-lg object-cover" alt="" />
                                        <span className="text-gray-700">{task.assignee}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-500">{task.role}</td>
                                <td className="px-4 py-3 text-gray-600">{task.dateAdded}</td>
                                <td className="px-4 py-3 text-gray-600">{task.deadline}</td>
                                <td className="px-4 py-3">
                                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium text-white whitespace-nowrap"
                                              style={{ backgroundColor: sc.color }}>
                                            {sc.label}
                                        </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleEditOpen(task)}
                                                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600">
                                            <FiEdit2 size={14} />
                                        </button>
                                        <button onClick={() => setDeletingTaskId(task.id)}
                                                className="p-1.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-500">
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    {tasks.length === 0 && (
                        <tr><td colSpan={8} className="text-center py-10 text-gray-400">تسکی ثبت نشده</td></tr>
                    )}
                    </tbody>
                </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingTask && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" dir="rtl">
                    <div className="bg-white rounded-xl p-6 w-[440px] max-w-full shadow-xl">
                        <h2 className="text-lg font-bold mb-4">ویرایش تسک</h2>
                        <form onSubmit={handleEditSave} className="flex flex-col gap-3">
                            <input type="text" placeholder="عنوان تسک" className="border rounded-lg p-2 text-sm"
                                   value={editForm.title}
                                   onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} required />
                            <input type="text" placeholder="مسئول" className="border rounded-lg p-2 text-sm"
                                   value={editForm.assignee}
                                   onChange={e => setEditForm(f => ({ ...f, assignee: e.target.value }))} />
                            <input type="text" placeholder="نقش" className="border rounded-lg p-2 text-sm"
                                   value={editForm.role}
                                   onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))} />
                            <select className="border rounded-lg p-2 text-sm"
                                    value={editForm.status}
                                    onChange={e => {
                                        const newStatus = e.target.value;
                                        let autoDeadline = editForm.deadline;
                                        if (!editForm.deadlineFromPicker) {
                                            if (newStatus === "Done")    autoDeadline = "تکمیل شده";
                                            if (newStatus === "Overdue") autoDeadline = "تاخیر دارد";
                                            if (newStatus === "Backlog") autoDeadline = "شروع نشده";
                                            if (newStatus === "InProgress") autoDeadline = "";
                                        }
                                        setEditForm(f => ({ ...f, status: newStatus, deadline: autoDeadline }));
                                    }}>
                                <option value="Backlog">در انتظار</option>
                                <option value="InProgress">در حال انجام</option>
                                <option value="Done">انجام شده</option>
                                <option value="Overdue">تاخیر</option>
                            </select>

                            {editForm.status === "InProgress" ? (
                                <AppDatePicker
                                    label="ددلاین"
                                    value={editForm.deadlineFromPicker ? editForm.deadline : ""}
                                    onChange={val => setEditForm(f => ({ ...f, deadline: val, deadlineFromPicker: true }))}
                                    placeholder="تاریخ ددلاین را انتخاب کنید"
                                />
                            ) : (
                                <div className="border rounded-lg p-2 text-sm bg-gray-50 text-gray-500">
                                    {editForm.deadline || "—"}
                                </div>
                            )}

                            <div className="flex justify-end gap-2 mt-1">
                                <button type="button" onClick={() => setEditingTask(null)}
                                        className="px-4 py-2 border rounded-lg text-sm">انصراف</button>
                                <button type="submit" className="px-4 py-2 text-white rounded-lg text-sm"
                                        style={{ background: "linear-gradient(135deg, #E91E8C, #9C27B0)" }}>ذخیره</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deletingTaskId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" dir="rtl">
                    <div className="bg-white rounded-xl p-6 w-[380px] max-w-full shadow-xl text-center">
                        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <FiTrash2 size={24} className="text-red-500" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800 mb-2">حذف تسک</h2>
                        <p className="text-sm text-gray-500 mb-6">آیا از حذف این تسک اطمینان دارید؟ این عمل قابل بازگشت نیست.</p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setDeletingTaskId(null)}
                                    className="px-6 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                                برگشت
                            </button>
                            <button onClick={() => { dispatch(deleteTask(deletingTaskId)); setDeletingTaskId(null); }}
                                    className="px-6 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">
                                حذف
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const COLUMNS = [
    {
        key: "Backlog",
        label: "در انتظار",
        accentColor: "#1E3363",
        columnBg: "bg-[#DEE1E899]",
        borderColor: "border-[#1E3363]",
        scrollbarColor: "#1E3363",
        circleColor: "bg-[#DEE1E8]",
    },
    {
        key: "InProgress",
        label: "در حال انجام",
        accentColor: "#FD8F02",
        columnBg: "bg-[#FEDFB699]",
        borderColor: "border-[#FD8F02]",
        scrollbarColor: "#FD8F02",
        circleColor: "bg-[#FEEFDA]",
    },
    {
        key: "Done",
        label: "انجام شده",
        accentColor: "#22AD5C",
        columnBg: "bg-[#DFF3E799]",
        borderColor: "border-[#22AD5C]",
        scrollbarColor: "#22AD5C",
        circleColor: "bg-[#DFF3E7]",
    },
    {
        key: "Overdue",
        label: "تاخیر",
        accentColor: "#FD1B51",
        columnBg: "bg-[#FEDEE699]",
        borderColor: "border-[#FD1B51]",
        scrollbarColor: "#FD1B51",
        circleColor: "bg-[#FEDEE6]",
    },
];

const STATUS_BADGE = {
    InProgress: { label: "در حال انجام", color: "#C05621", bg: "#FEEBC8" },
    Done: { label: "انجام شده", color: "#276749", bg: "#C6F6D5" },
    Backlog: { label: "در انتظار", color: "#4A5568", bg: "#E2E8F0" },
    Overdue: { label: "تاخیر", color: "#9B2C2C", bg: "#FED7D7" },
};

const TABS = [
    { id: "board", label: "برد پروژه", icon: <FiLayout size={14} /> },
    { id: "tasklist", label: "تسک لیست", icon: <FiList size={14} /> },
    { id: "members", label: "اعضای تیم", icon: <FiUsers size={14} /> },
    { id: "timing", label: "تایمینگ", icon: <FiClock size={14} /> },
];

const DroppableColumn = ({ id, children, className, style }) => {
    const { setNodeRef } = useDroppable({ id });
    return <div ref={setNodeRef} className={className} style={style}>{children}</div>;
};

const SortableTaskCard = ({ task, isOpen, onToggle }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

    const STATUS_LABEL = {
        Backlog: { label: "در انتظار", color: "#1E3363", bg: "#DEE1E8" },
        InProgress: { label: "در حال انجام", color: "#C05621", bg: "#FEEBC8" },
        Done: { label: "انجام شده", color: "#276749", bg: "#C6F6D5" },
        Overdue: { label: "تاخیر", color: "#9B2C2C", bg: "#FED7D7" },
    };
    const sl = STATUS_LABEL[task.status] || STATUS_LABEL.Backlog;

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
            {...attributes} {...listeners}
            className="bg-white rounded-xl shadow-sm cursor-move overflow-hidden border border-white/80"
        >
            <div className="p-3 flex flex-col gap-2">
                <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <img src={getMemberPhoto(task.assignee)}
                             className="w-7 h-7 rounded-md object-cover flex-shrink-0" alt="" />
                        <span className="text-sm font-medium text-gray-800 truncate">{task.title}</span>
                    </div>
                    <button className="text-gray-400 flex-shrink-0"
                            onClick={e => { e.stopPropagation(); onToggle(); }}>
                        {isOpen ? <ArrowUp2 size={15} color="#E91E8C" /> : <ArrowDown2 size={15} />}
                    </button>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded-full w-fit font-medium"
                      style={{ backgroundColor: sl.bg, color: sl.color }}>
                    {sl.label}
                </span>

                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col gap-1.5 pt-2 border-t border-gray-100 text-xs"
                        >
                            <div className="flex justify-between text-gray-600">
                                <span className="font-medium text-gray-800">{task.assignee}</span>
                                <span>{task.role}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500">
                                <FiClock size={11} />
                                <span>افزوده شده: {task.dateAdded}</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-medium"
                                 style={{ color: task.status === "Overdue" ? "#E53E3E" : "#718096" }}>
                                <FiClock size={11} />
                                <span>{task.deadline}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default function ProjectDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const project = useSelector(s => s.projects.list.find(p => p.id === Number(id)));
    const allTasks = useSelector(s => s.tasks.list);
    const tasks = allTasks.filter(t => t.projectId === Number(id));

    const [activeTab, setActiveTab] = useState("board");
    const [openCard, setOpenCard] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", assignee: "", role: "", status: "Backlog", deadline: "" });
    const [timingModal, setTimingModal] = useState(null);
    const [timingForm, setTimingForm] = useState({ startTime: "", endTime: "" });

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    useEffect(() => {
        dispatch(recalculateProgress({ projectId: Number(id), tasks: allTasks }));
    }, [allTasks, id, dispatch]);

    useEffect(() => {
        const style = document.createElement("style");
        style.id = "board-scrollbar";
        style.textContent = COLUMNS.map(col => `
        .scrollbar-${col.key}::-webkit-scrollbar { width: 5px; }
        .scrollbar-${col.key}::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-${col.key}::-webkit-scrollbar-thumb { background: ${col.scrollbarColor}; border-radius: 10px; }
        .scrollbar-${col.key} { scrollbar-width: thin; scrollbar-color: ${col.scrollbarColor} transparent; }
        `).join("");
        document.head.appendChild(style);
        return () => document.getElementById("board-scrollbar")?.remove();
    }, []);

    if (!project) return (
        <div className="p-8 text-center text-gray-500" dir="rtl">
            پروژه یافت نشد
            <button onClick={() => navigate("/projects")} className="mr-3 text-pink-500 underline">بازگشت</button>
        </div>
    );

    const statusBadge = STATUS_BADGE[project.status] || STATUS_BADGE.Backlog;
    const grouped = COLUMNS.map(col => ({ ...col, items: tasks.filter(t => t.status === col.key) }));

    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;

        const overColumn = COLUMNS.find(c => c.key === over.id);
        const overTask = tasks.find(t => t.id === over.id);
        const newStatus = overColumn?.key || overTask?.status;
        if (!newStatus) return;

        const activeTask = tasks.find(t => t.id === active.id);
        if (!activeTask || activeTask.status === newStatus) return;

        if (newStatus === "InProgress") {
            setTimingForm({
                startTime: activeTask?.startTime || "",
                endTime: activeTask?.endTime || "",
            });
            setTimingModal({ taskId: active.id, newStatus });
        } else {
            dispatch(moveTask({ taskId: active.id, newStatus }));
        }
    };
    const handleAddTask = (e) => {
        e.preventDefault();
        dispatch(addTask({
            id: Date.now(),
            projectId: Number(id),
            ...newTask,
            dateAdded: new Date().toLocaleDateString("fa-IR"),
        }));
        setNewTask({ title: "", assignee: "", role: "", status: "Backlog", deadline: "" });
        setIsAddModalOpen(false);
    };

    const doneTasks = tasks.filter(t => t.status === "Done").length;
    const overdueTasks = tasks.filter(t => t.status === "Overdue").length;
    const inProgressTasks = tasks.filter(t => t.status === "InProgress").length;
    const backlogTasks = tasks.filter(t => t.status === "Backlog").length;

    return (
        <div className="w-full h-full flex flex-col gap-4 p-4" dir="rtl">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate("/projects")}
                            className="p-2 rounded-lg border border-primary-400 bg-primary-50 hover:bg-primary-500 hover:text-white text-gray-700">
                        <FiArrowRight size={18} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">{project.title}</h1>
                    <span className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{ backgroundColor: statusBadge.bg, color: statusBadge.color }}>
                        {statusBadge.label}
                    </span>
                </div>
                <button onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 text-white rounded-lg text-sm border border-primary-400 text-gray-700"
                        style={{ background: "#fff", color: "#374151" }}>
                    <Add size={16} /> افزودن تسک
                </button>
            </div>

            <div className="flex rounded-xl p-1 gap-1 w-fit">
                {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                            style={activeTab === tab.id
                                ? { background: "linear-gradient(135deg, #E91E8C, #AD1457)", color: "#fff" }
                                : { background: "var(--color-primary-50)" }}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab: Board */}
            {activeTab === "board" && (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <div className="flex gap-4 2xl:gap-10 mx-auto overflow-x-auto overflow-y-hidden p-4 border border-primary-400 rounded-2xl min-h-0 flex-1"
                         style={{ backgroundColor: "rgba(252,228,240,0.15)" }}>
                        {grouped.map(column => (
                            <div key={column.key}
                                 className={`flex-shrink-0 w-[280px] 2xl:w-[320px] h-full rounded-xl flex flex-col shadow-sm ${column.borderColor} border ${column.columnBg}`}
                            >

                            {/* Column Header */}
                                <div className="px-4 py-3 flex justify-between items-center shrink-0">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.accentColor }} />
                                        <span className="font-bold text-sm" style={{ color: column.accentColor }}>{column.label}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full text-gray-500 shadow-sm ${column.circleColor}`}>
                                            {column.items.length}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t-2 mx-4 shrink-0" style={{ borderColor: column.accentColor }} />

                                <SortableContext items={column.items.map(t => t.id)} strategy={verticalListSortingStrategy}>
                                    <DroppableColumn
                                        id={column.key}
                                        className={`flex-1 overflow-y-auto flex flex-col gap-3 pt-2 px-3 pb-3 min-h-0 scrollbar-${column.key}`}
                                        style={{ "--scrollbar-color": column.scrollbarColor }}
                                    >
                                        {column.items.map(task => (
                                            <SortableTaskCard
                                                key={task.id}
                                                task={task}
                                                isOpen={openCard === task.id}
                                                onToggle={() => setOpenCard(openCard === task.id ? null : task.id)}
                                            />
                                        ))}
                                        {column.items.length === 0 && (
                                            <div className="flex-1 flex items-center justify-center text-xs opacity-40"
                                                 style={{ color: column.accentColor }}>
                                                بدون تسک
                                            </div>
                                        )}
                                    </DroppableColumn>
                                </SortableContext>
                            </div>
                        ))}
                    </div>
                </DndContext>
            )}

            {/* Tab: Members */}
            {activeTab === "members" && (
                <div className="border border-primary-400 rounded-2xl p-6" style={{ backgroundColor: "rgba(252,228,240,0.1)" }}>
                    {!project.members?.length ? (
                        <p className="text-center text-gray-400 py-8">هیچ عضوی ثبت نشده</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {project.members.map(member => (
                                <div key={member.id} className="bg-white rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm border border-gray-100">
                                    <img src={member.photo} alt={member.name} className="w-16 h-16 rounded-xl object-cover" />
                                    <p className="text-sm font-medium text-gray-800 text-center">{member.name}</p>
                                    <span className="text-xs px-2 py-0.5 rounded-full"
                                          style={{ backgroundColor: "rgba(233,30,140,0.08)", color: "#E91E8C" }}>
                                        {member.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Tab: Tasklist */}
            {/* ✅ FIX: flex flex-col با flex-1 و min-h-0 برای اسکرول صحیح */}
            {activeTab === "tasklist" && (
                <div className="flex flex-col flex-1 min-h-0">
                    <TaskListTab tasks={tasks} dispatch={dispatch} />
                </div>
            )}

            {/* Tab: Timing — improved UI */}
            {activeTab === "timing" && (
                <div className="border border-primary-400 rounded-2xl p-6 flex flex-col gap-5"
                     style={{ backgroundColor: "rgba(252,228,240,0.1)" }}>

                    {/* ردیف بالا: اطلاعات کلی پروژه */}
                    <div className="grid grid-cols-3 gap-4">
                        {/* تاریخ شروع */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                 style={{ background: "linear-gradient(135deg, #1D9E75, #0d7a5a)" }}>
                                <FiCalendar size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">تاریخ شروع</p>
                                <p className="text-sm font-semibold text-gray-800">{project.startDate}</p>
                            </div>
                        </div>

                        {/* ددلاین */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                 style={{ background: "linear-gradient(135deg, #E91E8C, #AD1457)" }}>
                                <FiClock size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">ددلاین</p>
                                <p className="text-sm font-semibold text-gray-800">{project.deadline}</p>
                            </div>
                        </div>

                        {/* پیشرفت */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                 style={{ background: "linear-gradient(135deg, #9C27B0, #6a1b9a)" }}>
                                <FiCheckCircle size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">پیشرفت کلی</p>
                                <p className="text-sm font-semibold" style={{ color: "#9C27B0" }}>{project.progress}%</p>
                            </div>
                        </div>
                    </div>

                    {/* نوار پیشرفت */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-700">پیشرفت کلی پروژه</span>
                            <span className="text-sm font-bold" style={{ color: "#E91E8C" }}>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div className="h-2.5 rounded-full transition-all duration-500"
                                 style={{ width: `${project.progress}%`, background: "linear-gradient(90deg, #E91E8C, #9C27B0)" }} />
                        </div>
                        <p className="text-xs text-gray-400 mt-2.5">
                            {doneTasks} از {tasks.length} تسک تکمیل شده
                        </p>
                    </div>

                    {/* آمار تسک‌ها */}
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { label: "انجام شده",    value: doneTasks,       color: "#22AD5C", bg: "#DFF3E7" },
                            { label: "در حال انجام", value: inProgressTasks, color: "#FD8F02", bg: "#FFE5CC" },
                            { label: "در انتظار",    value: backlogTasks,    color: "#1E3363", bg: "#DEE1E8" },
                            { label: "تاخیر",        value: overdueTasks,    color: "#FD1B51", bg: "#FEDEE6" },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                                <p className="text-2xl font-bold mb-1" style={{ color: item.color }}>{item.value}</p>
                                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                      style={{ backgroundColor: item.bg, color: item.color }}>
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add Task Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[440px] max-w-full shadow-xl" dir="rtl">
                        <h2 className="text-lg font-bold mb-4">افزودن تسک جدید</h2>
                        <form onSubmit={handleAddTask} className="flex flex-col gap-3">
                            <input type="text" placeholder="عنوان تسک" className="border rounded-lg p-2 text-sm"
                                   value={newTask.title} onChange={e => setNewTask(f => ({ ...f, title: e.target.value }))} required />
                            <input type="text" placeholder="مسئول" className="border rounded-lg p-2 text-sm"
                                   value={newTask.assignee} onChange={e => setNewTask(f => ({ ...f, assignee: e.target.value }))} />
                            <input type="text" placeholder="نقش" className="border rounded-lg p-2 text-sm"
                                   value={newTask.role} onChange={e => setNewTask(f => ({ ...f, role: e.target.value }))} />
                            <select className="border rounded-lg p-2 text-sm"
                                    value={newTask.status} onChange={e => setNewTask(f => ({ ...f, status: e.target.value }))}>
                                <option value="Backlog">در انتظار</option>
                                <option value="InProgress">در حال انجام</option>
                                <option value="Done">انجام شده</option>
                                <option value="Overdue">تاخیر</option>
                            </select>
                            <input type="text" placeholder="ددلاین" className="border rounded-lg p-2 text-sm"
                                   value={newTask.deadline} onChange={e => setNewTask(f => ({ ...f, deadline: e.target.value }))} />
                            <div className="flex justify-end gap-2 mt-1">
                                <button type="button" onClick={() => setIsAddModalOpen(false)}
                                        className="px-4 py-2 border rounded-lg text-sm">انصراف</button>
                                <button type="submit" className="px-4 py-2 text-white rounded-lg text-sm"
                                        style={{ background: "linear-gradient(135deg, #E91E8C, #9C27B0)" }}>افزودن</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Timing Modal */}
            {timingModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" dir="rtl">
                    <div className="bg-white rounded-2xl p-6 w-[420px] max-w-full shadow-xl">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                 style={{ background: "linear-gradient(135deg, #E91E8C, #9C27B0)" }}>
                                <FiClock size={18} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-gray-800">تنظیم زمان‌بندی تسک</h2>
                                <p className="text-xs text-gray-400">تاریخ شروع و پایان این تسک را مشخص کنید</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <AppDatePicker
                                label="تاریخ شروع"
                                value={timingForm.startTime}
                                onChange={(val) =>
                                    setTimingForm((f) => ({ ...f, startTime: val }))
                                }
                            />
                            <AppDatePicker
                                label="تاریخ پایان"
                                value={timingForm.endTime}
                                onChange={(val) =>
                                    setTimingForm((f) => ({ ...f, endTime: val }))
                                }
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={() => setTimingModal(null)}
                                className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                                انصراف
                            </button>
                            <button
                                onClick={() => {
                                    dispatch(moveTask({ taskId: timingModal.taskId, newStatus: timingModal.newStatus }));
                                    dispatch(updateTask({
                                        id: timingModal.taskId,
                                        ...timingForm, deadline: timingForm.startTime ? `شروع: ${timingForm.startTime}` : "در حال انجام",
                                    }));
                                    setTimingModal(null);
                                }}
                                className="px-4 py-2 text-white rounded-lg text-sm"
                                style={{ background: "linear-gradient(135deg, #E91E8C, #9C27B0)" }}>
                                تأیید و انتقال
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}