import { useState } from "react";
import { FaClock, FaHome, FaProjectDiagram, FaTasks, FaUserCheck } from "react-icons/fa";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice.js";
import { FiUsers } from "react-icons/fi";
import {ProjectManagementLogo} from "./ProjectManagementLogo.jsx";
import {PMLogoCompact} from "./PMLogoCompact.jsx";

const menuItems = [
    { id: "dashboard", label: "داشبورد", path: "/dashboard", icon: <FaHome /> },
    { id: "projects", label: "پروژه ها", path: "/projects", icon: <FaProjectDiagram /> },
    { id: "my-board", label: "برد من", path: "/my-board", icon: <FaUserCheck /> },
    { id: "my-tasklist", label: "لیست تسک های من", path: "/my-tasklist", icon: <FaTasks /> },
    { id: "timesheets", label: "زمان بندی پروژه ها", path: "/timesheets", icon: <FaClock /> },
    { id: "coworkers", label: "همکاران", path: "/coworkers", icon: <FiUsers /> },
];

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className={`relative h-screen bg-primary-50 shadow-lg transition-all duration-300 flex flex-col ${isExpanded ? "w-56" : "w-20"}`}>

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute -left-3 top-20 bg-white rounded-full p-1 shadow-md border border-gray-200 z-10"
            >
                {isExpanded ? <HiChevronRight size={18} /> : <HiChevronLeft size={18} />}
            </button>

            {/* Logo */}
            <div className={`flex items-center justify-center py-5 px-3 border-b border-gray-100 transition-all duration-300 ${isExpanded ? "h-24" : "h-20"}`}>
                {isExpanded ? (
                    <ProjectManagementLogo/>
                ) : (
                  <PMLogoCompact/>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 pt-4 px-2 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                            ${isActive(item.path)
                            ? "text-white"
                            : "text-gray-500 hover:bg-primary-150 hover:text-gray-800"}
                            ${!isExpanded && "justify-center"}`}
                        style={isActive(item.path) ? {
                            background: "var(--color-primary-500)"
                        } : {}}
                        title={!isExpanded ? item.label : ""}
                    >
                        <span className="text-lg flex-shrink-0">{item.icon}</span>
                        {isExpanded && <span className="text-sm font-medium">{item.label}</span>}
                    </button>
                ))}
            </nav>

            {/* Bottom */}
            <div className="border-t border-gray-100 p-2 space-y-1">
                <button
                    onClick={() => navigate("/settings")}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-gray-500 hover:bg-gray-50 hover:text-gray-800 ${!isExpanded && "justify-center"}`}
                    title={!isExpanded ? "Settings" : ""}
                >
                    <IoSettingsOutline className="text-lg flex-shrink-0" />
                    {isExpanded && <span className="text-sm font-medium">تنظیمات</span>}
                </button>
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-red-400 hover:bg-red-50 ${!isExpanded && "justify-center"}`}
                    title={!isExpanded ? "Logout" : ""}
                >
                    <IoLogOutOutline className="text-lg flex-shrink-0" />
                    {isExpanded && <span className="text-sm font-medium">خروج</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;