import { Outlet } from "react-router-dom";
    import AppSidebar from "../components/Sidebar.jsx";

const Layout = () => {
    return (
        <div className="flex h-screen bg-[url('/panel-bg.png')] bg-cover">
            <AppSidebar />
            <main className="flex-1 overflow-auto p-4">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;