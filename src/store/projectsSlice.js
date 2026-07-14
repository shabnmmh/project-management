import { createSlice } from "@reduxjs/toolkit";

const TEAM = {
  milad: {
    id: 1,
    name: "Milad Soleymani",
    role: "backend Developer",
    photo: "https://i.pravatar.cc/150?img=3",
  },
  ahmad: {
    id: 2,
    name: "Ahmad Hosseini",
    role: "Tech Lead",
    photo: "https://i.pravatar.cc/150?img=11",
  },
  shabnam: {
    id: 3,
    name: "shabnam mahmoudi",
    role: "frontend developer",
    photo: "https://i.pravatar.cc/150?img=41",
  },
  ali: {
    id: 4,
    name: "Ali Rezaei",
    role: "Backend Developer",
    photo: "https://i.pravatar.cc/150?img=14",
  },
  mina: {
    id: 5,
    name: "Mina Karimi",
    role: "UI/UX Designer",
    photo: "https://i.pravatar.cc/150?img=49",
  },
  reza: {
    id: 6,
    name: "Reza Mohammadi",
    role: "Project Manager",
    photo: "https://i.pravatar.cc/150?img=52",
  },
  fatemeh: {
    id: 7,
    name: "Fatemeh Moradi",
    role: "QA Engineer",
    photo: "https://i.pravatar.cc/150?img=44",
  },
  hossein: {
    id: 8,
    name: "Hossein Ahmadi",
    role: "Senior Backend",
    photo: "https://i.pravatar.cc/150?img=53",
  },
};

const FULL_TEAM = Object.values(TEAM);

const initialProjects = [
  {
    id: 1,
    title: "پلتفرم مدیریت منابع انسانی",
    status: "InProgress",
    startDate: "۱۴۰۳/۱۱/۰۱",
    deadline: "۲۳ روز و ۱۲ ساعت باقی مانده",
    progress: 60,
    members: FULL_TEAM,
  },
  {
    id: 2,
    title: "سامانه فروش و CRM سازمانی",
    status: "Backlog",
    startDate: "۱۴۰۳/۱۰/۲۰",
    deadline: "شروع نشده",
    progress: 5,
    members: [
      TEAM.reza,
      TEAM.milad,
      TEAM.mina,
      TEAM.ali,
      TEAM.ahmad,
      TEAM.shabnam,
    ],
  },
  {
    id: 3,
    title: "اپلیکیشن موبایل حضور و غیاب",
    status: "Done",
    startDate: "۱۴۰۳/۰۹/۱۵",
    deadline: "تکمیل شده",
    progress: 100,
    members: [
      TEAM.reza,
      TEAM.milad,
      TEAM.ali,
      TEAM.shabnam,
      TEAM.fatemeh,
      TEAM.ahmad,
    ],
  },
  {
    id: 4,
    title: "پورتال خدمات پس از فروش",
    status: "InProgress",
    startDate: "۱۴۰۳/۱۰/۲۵",
    deadline: "۱۰ روز باقی مانده",
    progress: 45,
    members: [
      TEAM.reza,
      TEAM.milad,
      TEAM.shabnam,
      TEAM.ali,
      TEAM.mina,
      TEAM.hossein,
    ],
  },
  {
    id: 5,
    title: "زیرساخت احراز هویت مرکزی",
    status: "Backlog",
    startDate: "نامشخص",
    deadline: "شروع نشده",
    progress: 0,
    members: [
      TEAM.reza,
      TEAM.ahmad,
      TEAM.ali,
      TEAM.hossein,
      TEAM.milad,
      TEAM.fatemeh,
    ],
  },
  {
    id: 6,
    title: "موتور گزارش‌ساز هوشمند",
    status: "Done",
    startDate: "۱۴۰۳/۰۸/۰۱",
    deadline: "تکمیل شده",
    progress: 100,
    members: [
      TEAM.reza,
      TEAM.ahmad,
      TEAM.ali,
      TEAM.mina,
      TEAM.shabnam,
      TEAM.fatemeh,
    ],
  },
  {
    id: 7,
    title: "یکپارچه‌سازی با سرویس‌های ابری",
    status: "InProgress",
    startDate: "۱۴۰۳/۱۲/۰۱",
    deadline: "۷ روز باقی مانده",
    progress: 75,
    members: [
      TEAM.reza,
      TEAM.ahmad,
      TEAM.ali,
      TEAM.hossein,
      TEAM.milad,
      TEAM.fatemeh,
    ],
  },
  {
    id: 8,
    title: "درگاه پرداخت چندکاناله",
    status: "Backlog",
    startDate: "۱۴۰۴/۰۱/۱۰",
    deadline: "۳۰ روز باقی مانده",
    progress: 10,
    members: [
      TEAM.reza,
      TEAM.ahmad,
      TEAM.ali,
      TEAM.milad,
      TEAM.mina,
      TEAM.fatemeh,
    ],
  },
];

const projectsSlice = createSlice({
  name: "projects",
  initialState: { list: initialProjects },
  reducers: {
    addProject: (state, action) => {
      state.list.unshift(action.payload);
    },
    updateProject: (state, action) => {
      const idx = state.list.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1)
        state.list[idx] = { ...state.list[idx], ...action.payload };
    },
    deleteProject: (state, action) => {
      state.list = state.list.filter((p) => p.id !== action.payload);
    },
    recalculateProgress: (state, action) => {
      const { projectId, tasks } = action.payload;
      const idx = state.list.findIndex((p) => p.id === projectId);
      if (idx === -1) return;
      const projectTasks = tasks.filter((t) => t.projectId === projectId);
      if (projectTasks.length === 0) return;
      const done = projectTasks.filter((t) => t.status === "Done").length;
      state.list[idx].progress = Math.round((done / projectTasks.length) * 100);
    },
  },
});

export const { addProject, updateProject, deleteProject, recalculateProgress } =
  projectsSlice.actions;
export default projectsSlice.reducer;
