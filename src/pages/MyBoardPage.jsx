import { useMemo, useState, useRef, useEffect } from "react";
import { Add, ArrowDown2, ArrowUp2, SearchNormal1, Candle2 } from "iconsax-reactjs";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock } from "react-icons/fi";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaUserCheck } from "react-icons/fa";
import { useSelector } from "react-redux";

const MEMBER_PHOTOS = {
    "Milad Soleymani": "https://i.pravatar.cc/150?img=3",
    "Ahmad Hosseini":  "https://i.pravatar.cc/150?img=11",
    "Sara Hosseini":   "https://i.pravatar.cc/150?img=41",
    "Ali Rezaei":      "https://i.pravatar.cc/150?img=14",
    "Mina Karimi":     "https://i.pravatar.cc/150?img=49",
    "Reza Mohammadi":  "https://i.pravatar.cc/150?img=52",
    "Fatemeh Moradi":  "https://i.pravatar.cc/150?img=44",
    "Hossein Ahmadi":  "https://i.pravatar.cc/150?img=53",
};
const getMemberPhoto = (name) =>
    MEMBER_PHOTOS[name] || `https://i.pravatar.cc/150?img=${Math.abs((name?.charCodeAt(0) || 1) % 50) + 1}`;

const COLUMNS = [
    { key: "Backlog",     label: "در انتظار",     accentColor: "#1E3363", columnBg: "bg-[#DEE1E899]", borderColor: "border-[#1E3363]", scrollbarColor: "#1E3363", circleColor: "bg-[#DEE1E8]" },
    { key: "InProgress",  label: "در حال انجام",  accentColor: "#FD8F02", columnBg: "bg-[#FEDFB699]", borderColor: "border-[#FD8F02]", scrollbarColor: "#FD8F02", circleColor: "bg-[#FEEFDA]" },
    { key: "Done",        label: "انجام شده",      accentColor: "#22AD5C", columnBg: "bg-[#DFF3E799]", borderColor: "border-[#22AD5C]", scrollbarColor: "#22AD5C", circleColor: "bg-[#DFF3E7]" },
    { key: "Overdue",     label: "تاخیر",          accentColor: "#FD1B51", columnBg: "bg-[#FEDEE699]", borderColor: "border-[#FD1B51]", scrollbarColor: "#FD1B51", circleColor: "bg-[#FEDEE6]" },
];

const STATUS_LABEL = {
    Backlog:    { label: "در انتظار",    color: "#1E3363", bg: "#DEE1E8" },
    InProgress: { label: "در حال انجام", color: "#C05621", bg: "#FEEBC8" },
    Done:       { label: "انجام شده",    color: "#276749", bg: "#C6F6D5" },
    Overdue:    { label: "تاخیر",        color: "#9B2C2C", bg: "#FED7D7" },
};

const DroppableColumn = ({ id, children, className, style }) => {
    const { setNodeRef } = useDroppable({ id });
    return <div ref={setNodeRef} className={className} style={style}>{children}</div>;
};

const SortableTaskCard = ({ task, isOpen, onToggle, projectName }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
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
                            <div className="flex items-center gap-2 text-gray-700 font-medium">
                                <span className="text-gray-400">پروژه:</span>
                                <span>{projectName || "—"}</span>
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

const AddTaskModal = ({ isOpen, onClose, onAdd }) => {
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("Backlog");
    const [deadline, setDeadline] = useState("");
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAdd({ id: Date.now(), title, status, deadline, dateAdded: new Date().toLocaleDateString("fa-IR") });
        setTitle(""); setDeadline("");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[440px] max-w-full shadow-xl" dir="rtl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Candle2 size={18} /> افزودن تسک جدید</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input type="text" placeholder="عنوان تسک" className="border rounded-lg p-2 text-sm"
                           value={title} onChange={e => setTitle(e.target.value)} required />
                    <select className="border rounded-lg p-2 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
                        <option value="Backlog">در انتظار</option>
                        <option value="InProgress">در حال انجام</option>
                        <option value="Overdue">تاخیر</option>
                        <option value="Done">انجام شده</option>
                    </select>
                    <input type="text" placeholder="ددلاین" className="border rounded-lg p-2 text-sm"
                           value={deadline} onChange={e => setDeadline(e.target.value)} />
                    <div className="flex justify-end gap-2 mt-1">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-sm">انصراف</button>
                        <button type="submit" className="px-4 py-2 text-white rounded-lg text-sm"
                                style={{ background: "linear-gradient(135deg, #E91E8C, #9C27B0)" }}>افزودن</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function MyBoardPage() {
    const currentUser = useSelector(s => s.auth.user);
    const allTasks    = useSelector(s => s.tasks.list);
    const projects    = useSelector(s => s.projects.list);

    const myTasks = allTasks.filter(t => t.assignee === currentUser?.displayName);

    const [localTasks,        setLocalTasks]        = useState([]);
    const [openCard,          setOpenCard]           = useState(null);
    const [columnSearches,    setColumnSearches]     = useState({});
    const [searchOpen,        setSearchOpen]         = useState({});
    const [globalSearch,      setGlobalSearch]       = useState("");
    const [isGlobalSearchOpen,setIsGlobalSearchOpen] = useState(false);
    const [isAddModalOpen,    setIsAddModalOpen]     = useState(false);
    const searchInputRefs = useRef({});

    const allMyTasks = useMemo(() => {
        const localIds = new Set(localTasks.map(t => t.id));
        const reduxFiltered = myTasks.filter(t => !localIds.has(t.id));
        return [...reduxFiltered, ...localTasks];
    }, [myTasks, localTasks]);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    const toggleColumnSearch = (colKey) => {
        setSearchOpen(prev => {
            const willOpen = !prev[colKey];
            if (!willOpen) setColumnSearches(s => ({ ...s, [colKey]: "" }));
            else setTimeout(() => searchInputRefs.current[colKey]?.focus(), 150);
            return { ...prev, [colKey]: willOpen };
        });
    };

    const grouped = useMemo(() => {
        const filtered = globalSearch
            ? allMyTasks.filter(t => t.title.toLowerCase().includes(globalSearch.toLowerCase()))
            : allMyTasks;
        return COLUMNS.map(col => {
            const colSearch = columnSearches[col.key]?.toLowerCase() ?? "";
            const items = filtered
                .filter(t => t.status === col.key)
                .filter(t => !colSearch || t.title.toLowerCase().includes(colSearch));
            return { ...col, items };
        });
    }, [allMyTasks, globalSearch, columnSearches]);

    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;
        const overColumn = COLUMNS.find(c => c.key === over.id);
        const overTask   = allMyTasks.find(t => t.id === over.id);
        const newStatus  = overColumn?.key || overTask?.status;
        if (!newStatus) return;
        const activeTask = allMyTasks.find(t => t.id === active.id);
        if (!activeTask || activeTask.status === newStatus) return;

        setLocalTasks(prev => {
            const exists = prev.find(t => t.id === active.id);
            if (exists) return prev.map(t => t.id === active.id ? { ...t, status: newStatus } : t);
            const reduxTask = myTasks.find(t => t.id === active.id);
            if (reduxTask) return [...prev, { ...reduxTask, status: newStatus }];
            return prev;
        });
    };

    useEffect(() => {
        const style = document.createElement("style");
        style.id = "myboard-scrollbar";
        style.textContent = COLUMNS.map(col => `
            .scrollbar-my-${col.key}::-webkit-scrollbar { width: 5px; }
            .scrollbar-my-${col.key}::-webkit-scrollbar-track { background: transparent; }
            .scrollbar-my-${col.key}::-webkit-scrollbar-thumb { background: ${col.scrollbarColor}; border-radius: 10px; }
            .scrollbar-my-${col.key} { scrollbar-width: thin; scrollbar-color: ${col.scrollbarColor} transparent; }
        `).join("");
        document.head.appendChild(style);
        return () => document.getElementById("myboard-scrollbar")?.remove();
    }, []);

    return (
        <div className="w-full h-full flex flex-col gap-4 p-4" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-center flex-wrap gap-3 flex-shrink-0">
                <h1 className="p-2 px-4 rounded-lg flex items-center gap-2 text-white text-xl font-normal w-fit"
                    style={{ background: "linear-gradient(135deg, #E91E8C, #AD1457)" }}>
                    <FaUserCheck size={20} /> برد من
                </h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 px-3 py-2 border border-primary-400 rounded-lg bg-white text-gray-700 text-sm">
                        <Add size={18} /> افزودن تسک
                    </button>
                    <AnimatePresence>
                        {isGlobalSearchOpen ? (
                            <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "220px" }}
                                        exit={{ opacity: 0, width: 0 }} className="overflow-hidden flex items-center gap-2">
                                <div className="relative w-full">
                                    <SearchNormal1 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" placeholder="جستجو..." value={globalSearch}
                                           onChange={e => setGlobalSearch(e.target.value)}
                                           className="w-full pr-9 p-2 border border-primary-400 rounded-lg text-sm focus:outline-none" autoFocus />
                                </div>
                                <button onClick={() => { setIsGlobalSearchOpen(false); setGlobalSearch(""); }} className="text-gray-500 text-sm">✕</button>
                            </motion.div>
                        ) : (
                            <button onClick={() => setIsGlobalSearchOpen(true)}
                                    className="p-2 border border-primary-400 rounded-lg bg-white text-gray-700">
                                <SearchNormal1 size={18} />
                            </button>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Board */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="flex gap-4 2xl:gap-10 mx-auto flex-1 overflow-x-auto overflow-y-hidden p-4 border border-primary-400 rounded-2xl min-h-0"
                     style={{ backgroundColor: "rgba(252,228,240,0.15)" }}>
                    {grouped.map(column => (
                        <div key={column.key}
                             className={`flex-shrink-0 w-[280px] 2xl:min-w-[320px] h-full rounded-xl flex flex-col shadow-sm border ${column.borderColor} ${column.columnBg}`}>
                            {/* Header */}
                            <div className="px-4 py-3 flex justify-between items-center shrink-0">
                                <AnimatePresence mode="wait" initial={false}>
                                    {searchOpen[column.key] ? (
                                        <motion.div key="search" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -6 }}
                                                    className="flex-1 flex items-center gap-2 rounded-lg px-3 py-1.5 shadow-sm border border-gray-200 bg-white">
                                            <SearchNormal1 size={13} color={column.accentColor} />
                                            <input
                                                ref={el => { searchInputRefs.current[column.key] = el; }}
                                                type="text" value={columnSearches[column.key] ?? ""}
                                                onChange={e => setColumnSearches(prev => ({ ...prev, [column.key]: e.target.value }))}
                                                onKeyDown={e => { if (e.key === "Escape") toggleColumnSearch(column.key); }}
                                                placeholder={`جستجو در ${column.label}…`}
                                                className="flex-1 text-sm outline-none bg-transparent text-gray-700" />
                                            {columnSearches[column.key] && (
                                                <button onClick={() => setColumnSearches(prev => ({ ...prev, [column.key]: "" }))}
                                                        className="text-gray-400 text-xs">✕</button>
                                            )}
                                            <button onClick={() => toggleColumnSearch(column.key)}>
                                                <ArrowUp2 size={13} color={column.accentColor} />
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="title" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 6 }} className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.accentColor }} />
                                            <span className="font-bold text-sm" style={{ color: column.accentColor }}>{column.label}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full text-gray-500 shadow-sm ${column.circleColor}`}>
                                                {column.items.length}
                                            </span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {!searchOpen[column.key] && (
                                    <div className="flex items-center gap-2">
                                        <Add size={16} color={column.accentColor} className="cursor-pointer" onClick={() => setIsAddModalOpen(true)} />
                                        <SearchNormal1 size={14} color={column.accentColor} className="cursor-pointer" onClick={() => toggleColumnSearch(column.key)} />
                                    </div>
                                )}
                            </div>

                            <div className="border-t-2 mx-4 shrink-0" style={{ borderColor: column.accentColor }} />

                            <SortableContext items={column.items.map(t => t.id)} strategy={verticalListSortingStrategy}>
                                <DroppableColumn id={column.key}
                                                 className={`flex-1 overflow-y-auto flex flex-col gap-3 pt-2 px-3 pb-3 scrollbar-my-${column.key}`}>
                                    {column.items.map(task => {
                                        const project = projects.find(p => p.id === task.projectId);
                                        return (
                                            <SortableTaskCard key={task.id} task={task}
                                                              isOpen={openCard === task.id}
                                                              onToggle={() => setOpenCard(openCard === task.id ? null : task.id)}
                                                              projectName={project?.title} />
                                        );
                                    })}
                                    {column.items.length === 0 && (
                                        <div className="flex-1 flex items-center justify-center text-xs opacity-30"
                                             style={{ color: column.accentColor }}>بدون تسک</div>
                                    )}
                                </DroppableColumn>
                            </SortableContext>
                        </div>
                    ))}
                </div>
            </DndContext>

            <AddTaskModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}
                          onAdd={task => setLocalTasks(prev => [{ ...task, assignee: currentUser?.displayName }, ...prev])} />
        </div>
    );
}