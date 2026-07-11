import { useState } from "react";
import { Candle2, Add, SearchNormal1 } from "iconsax-reactjs";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaTasks } from "react-icons/fa";
import { useSelector } from "react-redux";
import AppDatePicker from "../components/AppDatePicker.jsx";

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

const STATUS_CONFIG = {
    Done:       { label: "انجام شده",    color: "#22AD5C" },
    InProgress: { label: "در حال انجام", color: "#FD8F02" },
    Backlog:    { label: "در انتظار",    color: "#1E3363" },
    Overdue:    { label: "تاخیر",        color: "#FD1B51" },
};

const ITEMS_PER_PAGE = 8;

const AddTaskModal = ({ isOpen, onClose, onAdd }) => {
    const [form, setForm] = useState({ taskName: "", jobTitle: "", startDate: "", deadLineDate: "", status: "Backlog" });
    if (!isOpen) return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.taskName.trim()) return;
        onAdd({ ...form, id: Date.now() });
        setForm({ taskName: "", jobTitle: "", startDate: "", deadLineDate: "", status: "Backlog" });
        onClose();
    };
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" dir="rtl">
            <div className="bg-white rounded-xl p-6 w-[480px] max-w-full shadow-xl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Candle2 size={18} /> افزودن تسک جدید</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input type="text" placeholder="نام تسک" className="border rounded-lg p-2 text-sm"
                           value={form.taskName} onChange={e => setForm(f => ({ ...f, taskName: e.target.value }))} required />
                    <input type="text" placeholder="نقش" className="border rounded-lg p-2 text-sm"
                           value={form.jobTitle} onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))} />
                    <AppDatePicker label="تاریخ شروع" value={form.startDate}
                                   onChange={val => setForm(f => ({ ...f, startDate: val }))} />
                    <AppDatePicker label="ددلاین" value={form.deadLineDate}
                                   onChange={val => setForm(f => ({ ...f, deadLineDate: val }))} />
                    <select className="border rounded-lg p-2 text-sm" value={form.status}
                            onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                        <option value="Backlog">در انتظار</option>
                        <option value="InProgress">در حال انجام</option>
                        <option value="Done">انجام شده</option>
                        <option value="Overdue">تاخیر</option>
                    </select>
                    <div className="col-span-2 flex justify-end gap-2 mt-1">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-sm">انصراف</button>
                        <button type="submit" className="px-4 py-2 text-white rounded-lg text-sm"
                                style={{ background: "linear-gradient(135deg, #E91E8C, #9C27B0)" }}>افزودن</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DeleteModal = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" dir="rtl">
        <div className="bg-white rounded-xl p-6 w-[380px] max-w-full shadow-xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <FiTrash2 size={24} className="text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">حذف تسک</h2>
            <p className="text-sm text-gray-500 mb-6">آیا از حذف این تسک اطمینان دارید؟ این عمل قابل بازگشت نیست.</p>
            <div className="flex justify-center gap-3">
                <button onClick={onCancel} className="px-6 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">برگشت</button>
                <button onClick={onConfirm} className="px-6 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">حذف</button>
            </div>
        </div>
    </div>
);

export default function MyTasklistPage() {
    const currentUser = useSelector(s => s.auth.user);
    const allTasks    = useSelector(s => s.tasks.list);
    const projects    = useSelector(s => s.projects.list);

    const myReduxTasks = allTasks.filter(t => t.assignee === currentUser?.displayName);

    const [localTasks,     setLocalTasks]     = useState([]);
    const [selected,       setSelected]       = useState([]);
    const [currentPage,    setCurrentPage]    = useState(1);
    const [search,         setSearch]         = useState("");
    const [isSearchOpen,   setIsSearchOpen]   = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [deletingId,     setDeletingId]     = useState(null);
    const [editingTask,    setEditingTask]     = useState(null);
    const [editForm,       setEditForm]       = useState({});

    const allMyTasks = [
        ...myReduxTasks.map(t => ({
            id:          t.id,
            taskName:    t.title,
            photo:       getMemberPhoto(t.assignee),
            projectId:   t.projectId,
            jobTitle:    t.role,
            startDate:   t.dateAdded,
            deadLineDate:t.deadline,
            status:      t.status,
            isRedux:     true,
        })),
        ...localTasks,
    ];

    const filtered   = allMyTasks.filter(t => t.taskName.toLowerCase().includes(search.toLowerCase()));
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    const toggleAll    = () => setSelected(selected.length === paginated.length ? [] : paginated.map(t => t.id));

    const handleDelete = () => {
        setLocalTasks(prev => prev.filter(t => t.id !== deletingId));
        setSelected(prev => prev.filter(i => i !== deletingId));
        setDeletingId(null);
    };

    const handleEditOpen = (task) => {
        setEditingTask(task);
        setEditForm({
            taskName:    task.taskName,
            jobTitle:    task.jobTitle,
            startDate:   task.startDate,
            deadLineDate:task.deadLineDate,
            status:      task.status,
        });
    };

    const handleEditSave = (e) => {
        e.preventDefault();
        let deadLineDate = editForm.deadLineDate;
        if (editForm.status === "Done")    deadLineDate = "تکمیل شده";
        if (editForm.status === "Overdue") deadLineDate = "تاخیر دارد";
        if (editForm.status === "Backlog") deadLineDate = "شروع نشده";
        setLocalTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...editForm, deadLineDate } : t));
        setEditingTask(null);
    };

    return (
        <div className="w-full flex flex-col gap-4 p-4 overflow-hidden" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-center flex-wrap gap-3 flex-shrink-0">
                <h1 className="p-2 px-4 rounded-lg flex items-center gap-2 text-white text-xl font-normal w-fit"
                    style={{ background: "linear-gradient(135deg, #E91E8C, #AD1457)" }}>
                    <FaTasks size={20} /> تسک‌های من
                </h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 px-3 py-2 border border-primary-400 rounded-lg bg-white text-gray-700 text-sm">
                        <Add size={18} /> افزودن تسک
                    </button>
                    <AnimatePresence>
                        {isSearchOpen ? (
                            <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "220px" }}
                                        exit={{ opacity: 0, width: 0 }} className="overflow-hidden flex items-center gap-2">
                                <div className="relative w-full">
                                    <SearchNormal1 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input autoFocus type="text" placeholder="جستجو..." value={search}
                                           onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                                           className="w-full pr-9 p-2 border border-primary-400 rounded-lg text-sm focus:outline-none" />
                                </div>
                                <button onClick={() => { setIsSearchOpen(false); setSearch(""); }} className="text-gray-500 text-sm">✕</button>
                            </motion.div>
                        ) : (
                            <button onClick={() => setIsSearchOpen(true)}
                                    className="p-2 border border-primary-400 rounded-lg bg-white text-gray-700">
                                <SearchNormal1 size={18} />
                            </button>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Table */}
            <div className="border border-primary-400 rounded-2xl overflow-hidden flex flex-col flex-1 min-h-0"
                 style={{ backgroundColor: "rgba(252,228,240,0.1)" }}>
                <div className="overflow-auto flex-1">
                    <table className="w-full text-sm min-w-[900px]">
                        <thead className="sticky top-0 z-10">
                        <tr style={{ backgroundColor: "var(--color-primary-500)" }}>
                            <th className="px-4 py-3 w-10">
                                <input type="checkbox" checked={selected.length === paginated.length && paginated.length > 0}
                                       onChange={toggleAll} className="accent-white w-4 h-4 rounded cursor-pointer" />
                            </th>
                            <th className="px-4 py-3 text-right text-white font-medium">#</th>
                            <th className="px-4 py-3 text-right text-white font-medium">نام تسک</th>
                            <th className="px-4 py-3 text-right text-white font-medium">عکس</th>
                            <th className="px-4 py-3 text-right text-white font-medium">نام پروژه</th>
                            <th className="px-4 py-3 text-right text-white font-medium">نقش</th>
                            <th className="px-4 py-3 text-right text-white font-medium">تاریخ شروع</th>
                            <th className="px-4 py-3 text-right text-white font-medium">ددلاین</th>
                            <th className="px-4 py-3 text-right text-white font-medium">وضعیت</th>
                            <th className="px-4 py-3 text-right text-white font-medium">عملیات</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginated.map((task, idx) => {
                            const sc      = STATUS_CONFIG[task.status] || STATUS_CONFIG.Backlog;
                            const project = projects.find(p => p.id === task.projectId);
                            return (
                                <tr key={task.id} className={`border-b border-gray-100 transition-colors ${selected.includes(task.id) ? "bg-pink-50" : "bg-white hover:bg-gray-50"}`}>
                                    <td className="px-4 py-3">
                                        <input type="checkbox" checked={selected.includes(task.id)}
                                               onChange={() => toggleSelect(task.id)}
                                               className="accent-primary-400 w-4 h-4 rounded cursor-pointer" />
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{task.taskName}</td>
                                    <td className="px-4 py-3">
                                        <img src={task.photo || getMemberPhoto(currentUser?.displayName)}
                                             alt="" className="w-9 h-9 rounded-lg object-cover" />
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{project?.title || "—"}</td>
                                    <td className="px-4 py-3 text-gray-500">{task.jobTitle}</td>
                                    <td className="px-4 py-3 text-gray-600">{task.startDate}</td>
                                    <td className="px-4 py-3 text-gray-600">{task.deadLineDate}</td>
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
                                            <button onClick={() => setDeletingId(task.id)}
                                                    className="p-1.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-500">
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {paginated.length === 0 && (
                            <tr><td colSpan={10} className="text-center py-10 text-gray-400">تسکی یافت نشد</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0">
                    <span className="text-sm text-gray-500">{filtered.length} تسک</span>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 disabled:opacity-40 hover:bg-gray-100">‹</button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button key={p} onClick={() => setCurrentPage(p)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${p === currentPage ? "text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-100"}`}
                                    style={p === currentPage ? { background: "linear-gradient(135deg, #E91E8C, #9C27B0)" } : {}}>
                                {p}
                            </button>
                        ))}
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 disabled:opacity-40 hover:bg-gray-100">›</button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddTaskModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}
                          onAdd={t => setLocalTasks(prev => [{
                              ...t,
                              photo: getMemberPhoto(currentUser?.displayName),
                          }, ...prev])} />

            {deletingId && (
                <DeleteModal onConfirm={handleDelete} onCancel={() => setDeletingId(null)} />
            )}

            {editingTask && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" dir="rtl">
                    <div className="bg-white rounded-xl p-6 w-[440px] max-w-full shadow-xl">
                        <h2 className="text-lg font-bold mb-4">ویرایش تسک</h2>
                        <form onSubmit={handleEditSave} className="flex flex-col gap-3">
                            <input type="text" placeholder="نام تسک" className="border rounded-lg p-2 text-sm"
                                   value={editForm.taskName}
                                   onChange={e => setEditForm(f => ({ ...f, taskName: e.target.value }))} required />
                            <input type="text" placeholder="نقش" className="border rounded-lg p-2 text-sm"
                                   value={editForm.jobTitle}
                                   onChange={e => setEditForm(f => ({ ...f, jobTitle: e.target.value }))} />
                            <select className="border rounded-lg p-2 text-sm" value={editForm.status}
                                    onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}>
                                <option value="Backlog">در انتظار</option>
                                <option value="InProgress">در حال انجام</option>
                                <option value="Done">انجام شده</option>
                                <option value="Overdue">تاخیر</option>
                            </select>
                            {editForm.status === "InProgress" && (
                                <AppDatePicker label="ددلاین" value={editForm.deadLineDate}
                                               onChange={val => setEditForm(f => ({ ...f, deadLineDate: val }))} />
                            )}
                            {editForm.status !== "InProgress" && (
                                <div className="border rounded-lg p-2 text-sm bg-gray-50 text-gray-500">
                                    {editForm.status === "Done" ? "تکمیل شده" :
                                        editForm.status === "Overdue" ? "تاخیر دارد" : "شروع نشده"}
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
        </div>
    );
}