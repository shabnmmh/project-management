import { useSelector } from "react-redux";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

const STATUS_CONFIG = {
    Done: { label: "تکمیل", bg: "#EAF3DE", color: "#3B6D11" },
    InProgress: { label: "در حال انجام", bg: "#FAEEDA", color: "#854F0B" },
    Backlog: { label: "در انتظار", bg: "#FCE4F0", color: "#C2185B" },
    Overdue: { label: "تاخیر", bg: "#FEE2E2", color: "#7F1D1D" },
};

const AVATAR_COLORS = [
    { bg: "#FCE4F0", color: "#C2185B" },
    { bg: "#EAF3DE", color: "#3B6D11" },
    { bg: "#FAEEDA", color: "#854F0B" },
    { bg: "#F3E5F5", color: "#7B1FA2" },
];

const SortableTaskCard = ({ task, colorIdx }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    const sc = STATUS_CONFIG[task.status] || STATUS_CONFIG.Backlog;
    const ac = AVATAR_COLORS[colorIdx % AVATAR_COLORS.length];
    const initials = task.assignee.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}
             className="flex items-center gap-3 py-2.5 border-b border-gray-50 cursor-move last:border-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium flex-shrink-0"
                 style={{ backgroundColor: ac.bg, color: ac.color }}>{initials}</div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">{task.title}</p>
                <p className="text-xs text-gray-400">{task.assignee}</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: sc.bg, color: sc.color }}>{sc.label}</span>
        </div>
    );
};

export default function DashboardTasksList() {
    const allTasks = useSelector(s => s.tasks.list);
    const [order, setOrder] = useState(null);

    const tasks = order
        ? order.map(id => allTasks.find(t => t.id === id)).filter(Boolean)
        : allTasks.slice(0, 8);

    function handleDragEnd({ active, over }) {
        if (active.id !== over?.id) {
            const ids = tasks.map(t => t.id);
            const oi = ids.indexOf(active.id);
            const ni = ids.indexOf(over.id);
            setOrder(arrayMove(ids, oi, ni));
        }
    }

    return (
        <div className="h-full overflow-y-auto pl-2 custom-scrollbar">
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    <div>
                        {tasks.map((task, i) => <SortableTaskCard key={task.id} task={task} colorIdx={i} />)}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}