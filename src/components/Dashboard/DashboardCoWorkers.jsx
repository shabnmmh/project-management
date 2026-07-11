import { sampleCoWorkers } from "../../pages/CoWorkersPage.jsx";


export const DashboardCoWorkers = () => {
        const COUNT = 8;

        const coWorkers = sampleCoWorkers.slice(0, COUNT);
    return (
        <div className="h-full overflow-y-auto pl-2 custom-scrollbar">
            <div className="grid grid-cols-2 gap-3 content-start">
                {coWorkers.map((w) => (
                    <div key={w.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                        <img src={w.photo} alt={w.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{w.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{w.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
