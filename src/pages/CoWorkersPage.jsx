import { useState } from "react";
import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";
import { FiUsers as FiUsersIcon } from "react-icons/fi";

export const sampleCoWorkers = [
    { id: 1, name: "Parisa Babayee", role: "CEO", photo: "https://i.pravatar.cc/150?img=47" },
    { id: 2, name: "Jahan Hatami", role: "Mentor", photo: "https://i.pravatar.cc/150?img=11" },
    { id: 3, name: "Minoo Amiri", role: "Psychologist", photo: "https://i.pravatar.cc/150?img=45" },
    { id: 4, name: "Amir Miri", role: "Industrial Designer", photo: "https://i.pravatar.cc/150?img=12" },
    { id: 5, name: "Ali Shabani", role: "Developer", photo: "https://i.pravatar.cc/150?img=13" },
    { id: 6, name: "Farhad Aria", role: "UIUX Designer", photo: "https://i.pravatar.cc/150?img=53" },
    { id: 7, name: "Elham Davodi", role: "UIUX Designer", photo: "https://i.pravatar.cc/150?img=44" },
    { id: 8, name: "Farzane Farhodi", role: "Lawyer", photo: "https://i.pravatar.cc/150?img=48" },
    { id: 9, name: "Amir Miri", role: "Industrial Designer", photo: "https://i.pravatar.cc/150?img=15" },
    { id: 10, name: "Ali Shabani", role: "Developer", photo: "https://i.pravatar.cc/150?img=14" },
    { id: 11, name: "Siyavash Ilyasi", role: "UIUX Designer", photo: "https://i.pravatar.cc/150?img=17" },
    { id: 12, name: "Minoo Amiri", role: "Psychologist", photo: "https://i.pravatar.cc/150?img=49" },
    { id: 13, name: "Parisa Babayee", role: "CEO", photo: "https://i.pravatar.cc/150?img=47" },
    { id: 14, name: "Mobina Karimi", role: "UIUX Designer", photo: "https://i.pravatar.cc/150?img=46" },
    { id: 15, name: "Vina Abedi", role: "UIUX Designer", photo: "https://i.pravatar.cc/150?img=41" },
    { id: 16, name: "Jahan Hatami", role: "Mentor", photo: "https://i.pravatar.cc/150?img=52" },
    ...Array.from({ length: 48 }, (_, i) => ({
        id: 17 + i,
        name: ["Sara Ahmadi", "Reza Karimi", "Mina Hosseini", "Dariush Nejad"][i % 4],
        role: ["Developer", "UI/UX Designer", "CEO", "Mentor"][i % 4],
        photo: `https://i.pravatar.cc/150?img=${30 + (i % 30)}`,
    })),
];

const ITEMS_PER_PAGE = 16;

export default function CoWorkersPage() {
    const [selectedWorkers, setSelectedWorkers] = useState([2, 3, 4, 9]);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(sampleCoWorkers.length / ITEMS_PER_PAGE);
    const currentWorkers = sampleCoWorkers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleToggleSelect = (id) => {
        setSelectedWorkers(prev =>
            prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
        );
    };

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
        <div className="w-full p-4 flex flex-col gap-4" dir="rtl">
            <h1 className="p-2 px-4 rounded-lg flex items-center gap-2 text-white text-xl font-normal w-fit "
                style={{background: "linear-gradient(135deg, #E91E8C, #AD1457)"}}

            >
                <FiUsersIcon size={20} /> همکاران
            </h1>

            <div className="border border-primary-400 rounded-2xl p-4"
                 style={{ backgroundColor: "rgba(252, 228, 240, 0.2)" }}>
                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    {currentWorkers.map(worker => {
                        const isSelected = selectedWorkers.includes(worker.id);
                        return (
                            <div
                                key={worker.id}
                                onClick={() => handleToggleSelect(worker.id)}
                                className="relative flex flex-col items-center bg-white rounded-2xl border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-all"
                                style={isSelected ? { borderColor: "#E91E8C" } : {}}
                            >
                                {/* Selection Badge */}
                                <div className="absolute top-2 right-2">
                                    {isSelected ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M21.56 10.7405L20.2 9.16055C19.94 8.86055 19.73 8.30055 19.73 7.90055V6.20055C19.73 5.14055 18.86 4.27055 17.8 4.27055H16.1C15.71 4.27055 15.14 4.06055 14.84 3.80055L13.26 2.44055C12.57 1.85055 11.44 1.85055 10.74 2.44055L9.17 3.81055C8.87 4.06055 8.3 4.27055 7.91 4.27055H6.18C5.12 4.27055 4.25 5.14055 4.25 6.20055V7.91055C4.25 8.30055 4.04 8.86055 3.79 9.16055L2.44 10.7505C1.86 11.4405 1.86 12.5605 2.44 13.2505L3.79 14.8405C4.04 15.1405 4.25 15.7005 4.25 16.0905V17.8005C4.25 18.8605 5.12 19.7305 6.18 19.7305H7.91C8.3 19.7305 8.87 19.9405 9.17 20.2005L10.75 21.5605C11.44 22.1505 12.57 22.1505 13.27 21.5605L14.85 20.2005C15.15 19.9405 15.71 19.7305 16.11 19.7305H17.81C18.87 19.7305 19.74 18.8605 19.74 17.8005V16.1005C19.74 15.7105 19.95 15.1405 20.21 14.8405L21.57 13.2605C22.15 12.5705 22.15 11.4305 21.56 10.7405ZM16.16 10.1105L11.33 14.9405C11.19 15.0805 11 15.1605 10.8 15.1605C10.6 15.1605 10.41 15.0805 10.27 14.9405L7.85 12.5205C7.56 12.2305 7.56 11.7505 7.85 11.4605C8.14 11.1705 8.62 11.1705 8.91 11.4605L10.8 13.3505L15.1 9.05055C15.39 8.76055 15.87 8.76055 16.16 9.05055C16.45 9.34055 16.45 9.82055 16.16 10.1105Z"
                                                  fill="#E91E8C" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M21.56 10.7405L20.2 9.16055C19.94 8.86055 19.73 8.30055 19.73 7.90055V6.20055C19.73 5.14055 18.86 4.27055 17.8 4.27055H16.1C15.71 4.27055 15.14 4.06055 14.84 3.80055L13.26 2.44055C12.57 1.85055 11.44 1.85055 10.74 2.44055L9.17 3.81055C8.87 4.06055 8.3 4.27055 7.91 4.27055H6.18C5.12 4.27055 4.25 5.14055 4.25 6.20055V7.91055C4.25 8.30055 4.04 8.86055 3.79 9.16055L2.44 10.7505C1.86 11.4405 1.86 12.5605 2.44 13.2505L3.79 14.8405C4.04 15.1405 4.25 15.7005 4.25 16.0905V17.8005C4.25 18.8605 5.12 19.7305 6.18 19.7305H7.91C8.3 19.7305 8.87 19.9405 9.17 20.2005L10.75 21.5605C11.44 22.1505 12.57 22.1505 13.27 21.5605L14.85 20.2005C15.15 19.9405 15.71 19.7305 16.11 19.7305H17.81C18.87 19.7305 19.74 18.8605 19.74 17.8005V16.1005C19.74 15.7105 19.95 15.1405 20.21 14.8405L21.57 13.2605C22.15 12.5705 22.15 11.4305 21.56 10.7405ZM16.16 10.1105L11.33 14.9405C11.19 15.0805 11 15.1605 10.8 15.1605C10.6 15.1605 10.41 15.0805 10.27 14.9405L7.85 12.5205C7.56 12.2305 7.56 11.7505 7.85 11.4605C8.14 11.1705 8.62 11.1705 8.91 11.4605L10.8 13.3505L15.1 9.05055C15.39 8.76055 15.87 8.76055 16.16 9.05055C16.45 9.34055 16.45 9.82055 16.16 10.1105Z"
                                                  fill="#CCCCCC" />
                                        </svg>
                                    )}
                                </div>

                                {/* Photo */}
                                <div className="w-full aspect-[3/4] rounded-xl overflow-hidden mb-2 mt-1">
                                    <img src={worker.photo} alt={worker.name} className="w-full h-full object-cover" />
                                </div>

                                {/* Name */}
                                <p className="text-xs font-semibold text-gray-800 text-center leading-tight mb-1.5">
                                    {worker.name}
                                </p>

                                {/* Role Badge */}
                                <span className="text-[11px] rounded-full px-2 py-0.5 text-center leading-tight"
                                      style={{ backgroundColor: "rgba(233, 30, 140, 0.08)", color: "#E91E8C" }}>
                                    {worker.role}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-start gap-1.5 mt-8">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:border-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                        <ArrowRight2 size={16} />
                    </button>

                    {renderPageNumbers().map((page, idx) => (
                        <button
                            key={idx}
                            onClick={() => typeof page === "number" && setCurrentPage(page)}
                            disabled={page === "..."}
                            className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                                page === currentPage ? "text-white" : page === "..." ? "text-gray-400 cursor-default" : "border border-gray-300 text-gray-600 hover:bg-gray-100 bg-white"
                            }`}
                            style={page === currentPage ? { background: "var(--color-primary-400)" } : {}}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:border-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}