import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import Layout from "./layout/Layout";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import MyBoardPage from "./pages/MyBoardPage.jsx";
import MyTasklistPage from "./pages/MyTaskListPage.jsx";
import ProjectTimeSheetsPage from "./pages/ProjectTimeSheetsPage.jsx";
import CoWorkersPage from "./pages/CoWorkersPage.jsx";
import ProjectDetailPage from "./pages/ProjectDetailPage.jsx";

const SettingsPage = () => <div className="p-4">تنظیمات</div>;

const ProtectedRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    return user ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/projects/:id" element={<ProjectDetailPage />} />
                    <Route path="/my-board" element={<MyBoardPage />} />
                    <Route path="/my-tasklist" element={<MyTasklistPage />} />
                    <Route path="/timesheets" element={<ProjectTimeSheetsPage />} />
                    <Route path="/coworkers" element={<CoWorkersPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </HashRouter>
    );
}

export default App;