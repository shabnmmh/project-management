import { createSlice } from "@reduxjs/toolkit";

const initialTasks = [
    { id: 1,  projectId: 1, title: "طراحی سیستم احراز هویت",       assignee: "Milad Soleymani",  role: "Frontend",       status: "Done",       dateAdded: "۱۴۰۴/۱۰/۱۱", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۱۰/۱۱", endTime: "۱۴۰۴/۱۰/۲۰" },
    { id: 2,  projectId: 1, title: "پیاده‌سازی API لاگین",          assignee: "Ahmad Hosseini",   role: "Tech Lead",      status: "Done",       dateAdded: "۱۴۰۴/۱۰/۱۲", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۱۰/۱۲", endTime: "۱۴۰۴/۱۰/۲۲" },
    { id: 3,  projectId: 1, title: "طراحی داشبورد مدیریت",         assignee: "Sara Hosseini",    role: "UI/UX",          status: "InProgress", dateAdded: "۱۴۰۴/۱۰/۱۳", deadline: "۷ روز باقی مانده",   startTime: null, endTime: null },
    { id: 4,  projectId: 1, title: "وصل کردن API های جا افتاده",   assignee: "Ali Rezaei",       role: "Backend",        status: "Backlog",    dateAdded: "۱۴۰۴/۱۰/۱۴", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 5,  projectId: 1, title: "تست یونیت ماژول کاربران",      assignee: "Milad Soleymani",  role: "Frontend",       status: "Overdue",    dateAdded: "۱۴۰۴/۱۰/۱۵", deadline: "تاخیر دارد",          startTime: "۱۴۰۴/۱۰/۱۵", endTime: null },
    { id: 6,  projectId: 1, title: "بهینه‌سازی کوئری‌های دیتابیس", assignee: "Ali Rezaei",       role: "Backend",        status: "Done",       dateAdded: "۱۴۰۴/۱۰/۱۶", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۱۰/۱۶", endTime: "۱۴۰۴/۱۰/۲۵" },
    { id: 7,  projectId: 1, title: "ریفکتور کامپوننت‌های UI",      assignee: "Sara Hosseini",    role: "UI/UX",          status: "InProgress", dateAdded: "۱۴۰۴/۱۰/۱۷", deadline: "۵ روز باقی مانده",   startTime: null, endTime: null },
    { id: 8,  projectId: 1, title: "مستندسازی API",                assignee: "Ahmad Hosseini",   role: "Tech Lead",      status: "Backlog",    dateAdded: "۱۴۰۴/۱۰/۱۸", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 9,  projectId: 1, title: "رفع باگ صفحه پروفایل",         assignee: "Milad Soleymani",  role: "Frontend",       status: "Overdue",    dateAdded: "۱۴۰۴/۱۰/۱۹", deadline: "تاخیر دارد",          startTime: "۱۴۰۴/۱۰/۱۹", endTime: null },
    { id: 10, projectId: 1, title: "پیاده‌سازی نوتیفیکیشن",       assignee: "Ali Rezaei",       role: "Backend",        status: "Backlog",    dateAdded: "۱۴۰۴/۱۰/۲۰", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 11, projectId: 1, title: "طراحی صفحه تنظیمات",           assignee: "Mina Karimi",      role: "UI/UX Designer", status: "InProgress", dateAdded: "۱۴۰۴/۱۰/۲۱", deadline: "۱۰ روز باقی مانده",  startTime: null, endTime: null },
    { id: 12, projectId: 1, title: "ادغام سرویس پرداخت",           assignee: "Ahmad Hosseini",   role: "Tech Lead",      status: "Overdue",    dateAdded: "۱۴۰۴/۱۰/۲۲", deadline: "تاخیر دارد",          startTime: "۱۴۰۴/۱۰/۲۲", endTime: null },
    { id: 13, projectId: 1, title: "پیاده‌سازی جستجو",             assignee: "Milad Soleymani",  role: "Frontend",       status: "Done",       dateAdded: "۱۴۰۴/۱۰/۲۳", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۱۰/۲۳", endTime: "۱۴۰۴/۱۱/۰۱" },
    { id: 14, projectId: 1, title: "تست امنیت سیستم",              assignee: "Ali Rezaei",       role: "Backend",        status: "Backlog",    dateAdded: "۱۴۰۴/۱۰/۲۴", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 15, projectId: 1, title: "بهینه‌سازی لود صفحات",         assignee: "Sara Hosseini",    role: "UI/UX",          status: "InProgress", dateAdded: "۱۴۰۴/۱۰/۲۵", deadline: "۳ روز باقی مانده",   startTime: null, endTime: null },
    { id: 16, projectId: 1, title: "راه‌اندازی CI/CD",             assignee: "Ahmad Hosseini",   role: "Tech Lead",      status: "Overdue",    dateAdded: "۱۴۰۴/۱۰/۲۶", deadline: "تاخیر دارد",          startTime: "۱۴۰۴/۱۰/۲۶", endTime: null },
    { id: 17, projectId: 1, title: "ساخت کامپوننت جدول",           assignee: "Milad Soleymani",  role: "Frontend",       status: "Done",       dateAdded: "۱۴۰۴/۱۰/۲۷", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۱۰/۲۷", endTime: "۱۴۰۴/۱۱/۰۳" },

// پروژه ۲
    { id: 18, projectId: 2, title: "طراحی موکاپ صفحه اصلی",        assignee: "Mina Karimi",      role: "UI/UX Designer", status: "Backlog",    dateAdded: "۱۴۰۴/۱۰/۳۰", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 19, projectId: 2, title: "ساخت نمودار فروش",             assignee: "Milad Soleymani",  role: "Frontend",       status: "Backlog",    dateAdded: "۱۴۰۴/۱۱/۰۱", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 20, projectId: 2, title: "طراحی فیلترهای گزارش",         assignee: "Mina Karimi",      role: "UI/UX Designer", status: "InProgress", dateAdded: "۱۴۰۴/۱۱/۰۲", deadline: "۱۲ روز باقی مانده",  startTime: null, endTime: null },
    { id: 21, projectId: 2, title: "ادغام با سیستم CRM",           assignee: "Ali Rezaei",       role: "Backend",        status: "InProgress", dateAdded: "۱۴۰۴/۱۱/۰۳", deadline: "۱۵ روز باقی مانده",  startTime: null, endTime: null },
    { id: 22, projectId: 2, title: "پیاده‌سازی اکسپورت Excel",     assignee: "Milad Soleymani",  role: "Frontend",       status: "Backlog",    dateAdded: "۱۴۰۴/۱۱/۰۴", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 23, projectId: 2, title: "طراحی API گزارش‌ها",           assignee: "Ahmad Hosseini",   role: "Tech Lead",      status: "Overdue",    dateAdded: "۱۴۰۴/۱۱/۰۵", deadline: "تاخیر دارد",          startTime: "۱۴۰۴/۱۱/۰۵", endTime: null },
    { id: 24, projectId: 2, title: "ساخت صفحه داشبورد مدیر",      assignee: "Sara Hosseini",    role: "UI/UX",          status: "Done",       dateAdded: "۱۴۰۴/۱۱/۰۶", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۱۱/۰۶", endTime: "۱۴۰۴/۱۱/۱۶" },
    { id: 25, projectId: 2, title: "تست عملکرد زیر بار",           assignee: "Ali Rezaei",       role: "Backend",        status: "Overdue",    dateAdded: "۱۴۰۴/۱۱/۰۷", deadline: "تاخیر دارد",          startTime: "۱۴۰۴/۱۱/۰۷", endTime: null },
    { id: 26, projectId: 2, title: "پیاده‌سازی احراز هویت SSO",    assignee: "Ahmad Hosseini",   role: "Tech Lead",      status: "Done",       dateAdded: "۱۴۰۴/۱۱/۰۸", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۱۱/۰۸", endTime: "۱۴۰۴/۱۱/۱۹" },
    { id: 27, projectId: 2, title: "طراحی صفحه کاربران",           assignee: "Mina Karimi",      role: "UI/UX Designer", status: "InProgress", dateAdded: "۱۴۰۴/۱۱/۰۹", deadline: "۸ روز باقی مانده",   startTime: null, endTime: null },
    { id: 28, projectId: 2, title: "ساخت API مدیریت نقش‌ها",       assignee: "Ali Rezaei",       role: "Backend",        status: "Done",       dateAdded: "۱۴۰۴/۱۱/۱۰", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۱۱/۱۰", endTime: "۱۴۰۴/۱۱/۲۱" },

// پروژه ۳
    { id: 29, projectId: 3, title: "پیاده‌سازی صفحه لاگین موبایل", assignee: "Milad Soleymani",  role: "Frontend",       status: "Done",       dateAdded: "۱۴۰۴/۰۹/۰۱", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۰۹/۰۱", endTime: "۱۴۰۴/۰۹/۰۵" },
    { id: 30, projectId: 3, title: "ساخت API حضور و غیاب",        assignee: "Ali Rezaei",       role: "Backend",        status: "Done",       dateAdded: "۱۴۰۴/۰۹/۰۲", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۰۹/۰۲", endTime: "۱۴۰۴/۰۹/۰۸" },
    { id: 31, projectId: 3, title: "طراحی UI صفحه گزارش",         assignee: "Sara Hosseini",    role: "UI/UX",          status: "Done",       dateAdded: "۱۴۰۴/۰۹/۰۳", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۰۹/۰۳", endTime: "۱۴۰۴/۰۹/۰۹" },
    { id: 32, projectId: 3, title: "تست عملکرد روی iOS",           assignee: "Milad Soleymani",  role: "Frontend",       status: "Done",       dateAdded: "۱۴۰۴/۰۹/۰۴", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۰۹/۰۴", endTime: "۱۴۰۴/۰۹/۱۰" },
    { id: 33, projectId: 3, title: "انتشار نسخه ۱.۰",             assignee: "Ahmad Hosseini",   role: "Tech Lead",      status: "Done",       dateAdded: "۱۴۰۴/۰۹/۰۵", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۰۹/۰۵", endTime: "۱۴۰۴/۰۹/۱۲" },
    { id: 34, projectId: 3, title: "رفع باگ‌های گزارش‌شده",       assignee: "Ali Rezaei",       role: "Backend",        status: "Done",       dateAdded: "۱۴۰۴/۰۹/۰۶", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۰۹/۰۶", endTime: "۱۴۰۴/۰۹/۱۴" },
    { id: 35, projectId: 3, title: "طراحی آیکون‌های اپلیکیشن",    assignee: "Mina Karimi",      role: "UI/UX Designer", status: "Done",       dateAdded: "۱۴۰۴/۰۹/۰۷", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۰۹/۰۷", endTime: "۱۴۰۴/۰۹/۱۵" },
    { id: 36, projectId: 3, title: "مستندسازی فنی پروژه",         assignee: "Ahmad Hosseini",   role: "Tech Lead",      status: "Done",       dateAdded: "۱۴۰۴/۰۹/۰۸", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۰۹/۰۸", endTime: "۱۴۰۴/۰۹/۱۶" },

// پروژه ۴
    { id: 37, projectId: 4, title: "ریسپانسیو هدر",                assignee: "Ahmad Hosseini",   role: "Tech Lead",      status: "InProgress", dateAdded: "۱۴۰۴/۱۰/۱۰", deadline: "۵ روز باقی مانده",   startTime: null, endTime: null },
    { id: 38, projectId: 4, title: "فیکس باگ منوی موبایل",        assignee: "Milad Soleymani",  role: "Frontend",       status: "InProgress", dateAdded: "۱۴۰۴/۱۰/۱۱", deadline: "۳ روز باقی مانده",   startTime: null, endTime: null },
    { id: 39, projectId: 4, title: "تست روی مرورگرهای مختلف",     assignee: "Sara Hosseini",    role: "UI/UX",          status: "Backlog",    dateAdded: "۱۴۰۴/۱۰/۱۲", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 40, projectId: 4, title: "بهینه‌سازی تصاویر",           assignee: "Ali Rezaei",       role: "Backend",        status: "Overdue",    dateAdded: "۱۴۰۴/۱۰/۱۳", deadline: "تاخیر دارد",          startTime: "۱۴۰۴/۱۰/۱۳", endTime: null },
    { id: 41, projectId: 4, title: "ریسپانسیو فوتر",              assignee: "Milad Soleymani",  role: "Frontend",       status: "Done",       dateAdded: "۱۴۰۴/۱۰/۱۴", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۱۰/۱۴", endTime: "۱۴۰۴/۱۰/۱۸" },
    { id: 42, projectId: 4, title: "تنظیم breakpoint های Tailwind", assignee: "Sara Hosseini",   role: "UI/UX",          status: "InProgress", dateAdded: "۱۴۰۴/۱۰/۱۵", deadline: "۶ روز باقی مانده",   startTime: null, endTime: null },
    { id: 43, projectId: 4, title: "ریسپانسیو صفحه لاگین",        assignee: "Milad Soleymani",  role: "Frontend",       status: "Backlog",    dateAdded: "۱۴۰۴/۱۰/۱۶", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 44, projectId: 4, title: "تست دستگاه‌های مختلف",        assignee: "Mina Karimi",      role: "UI/UX Designer", status: "Overdue",    dateAdded: "۱۴۰۴/۱۰/۱۷", deadline: "تاخیر دارد",          startTime: "۱۴۰۴/۱۰/۱۷", endTime: null },
    { id: 45, projectId: 4, title: "بهینه‌سازی فونت‌ها",          assignee: "Ahmad Hosseini",   role: "Tech Lead",      status: "Done",       dateAdded: "۱۴۰۴/۱۰/۱۸", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۱۰/۱۸", endTime: "۱۴۰۴/۱۰/۲۲" },
    { id: 46, projectId: 4, title: "رفع مشکل overflow افقی",      assignee: "Ali Rezaei",       role: "Backend",        status: "Backlog",    dateAdded: "۱۴۰۴/۱۰/۱۹", deadline: "شروع نشده",           startTime: null, endTime: null },

// پروژه ۵
    { id: 47, projectId: 5, title: "تحلیل نیازمندی‌های SSO",       assignee: "Ahmad Hosseini",   role: "Tech Lead",      status: "Backlog",    dateAdded: "۱۴۰۴/۱۱/۰۱", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 48, projectId: 5, title: "طراحی معماری احراز هویت",      assignee: "Ali Rezaei",       role: "Backend",        status: "Backlog",    dateAdded: "۱۴۰۴/۱۱/۰۲", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 49, projectId: 5, title: "طراحی صفحه لاگین یکپارچه",    assignee: "Mina Karimi",      role: "UI/UX Designer", status: "Backlog",    dateAdded: "۱۴۰۴/۱۱/۰۳", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 50, projectId: 5, title: "پیاده‌سازی OAuth2",            assignee: "Ali Rezaei",       role: "Backend",        status: "Backlog",    dateAdded: "۱۴۰۴/۱۱/۰۴", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 51, projectId: 5, title: "ساخت SDK احراز هویت",          assignee: "Milad Soleymani",  role: "Frontend",       status: "Backlog",    dateAdded: "۱۴۰۴/۱۱/۰۵", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 52, projectId: 5, title: "تست امنیت JWT",                assignee: "Ahmad Hosseini",   role: "Tech Lead",      status: "Backlog",    dateAdded: "۱۴۰۴/۱۱/۰۶", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 53, projectId: 5, title: "مستندسازی پروتکل",            assignee: "Sara Hosseini",    role: "UI/UX",          status: "Backlog",    dateAdded: "۱۴۰۴/۱۱/۰۷", deadline: "شروع نشده",           startTime: null, endTime: null },

// پروژه ۶
    { id: 54, projectId: 6, title: "طراحی موتور قاعده‌محور",       assignee: "Ahmad Hosseini",   role: "Tech Lead",      status: "Done",       dateAdded: "۱۴۰۴/۰۸/۱۰", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۰۸/۱۰", endTime: "۱۴۰۴/۰۸/۲۰" },
    { id: 55, projectId: 6, title: "ساخت API گزارش‌ساز",          assignee: "Ali Rezaei",       role: "Backend",        status: "Done",       dateAdded: "۱۴۰۴/۰۸/۱۱", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۰۸/۱۱", endTime: "۱۴۰۴/۰۸/۲۲" },
    { id: 56, projectId: 6, title: "طراحی قالب‌های گزارش",        assignee: "Mina Karimi",      role: "UI/UX Designer", status: "Done",       dateAdded: "۱۴۰۴/۰۸/۱۲", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۰۸/۱۲", endTime: "۱۴۰۴/۰۸/۲۴" },
    { id: 57, projectId: 6, title: "اکسپورت PDF/Excel",            assignee: "Milad Soleymani",  role: "Frontend",       status: "Done",       dateAdded: "۱۴۰۴/۰۸/۱۳", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۰۸/۱۳", endTime: "۱۴۰۴/۰۸/۲۵" },
    { id: 58, projectId: 6, title: "فیلترهای پیشرفته گزارش",      assignee: "Sara Hosseini",    role: "UI/UX",          status: "Done",       dateAdded: "۱۴۰۴/۰۸/۱۴", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۰۸/۱۴", endTime: "۱۴۰۴/۰۸/۲۶" },
    { id: 59, projectId: 6, title: "تست یکپارچگی گزارش‌ها",       assignee: "Ali Rezaei",       role: "Backend",        status: "Done",       dateAdded: "۱۴۰۴/۰۸/۱۵", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۰۸/۱۵", endTime: "۱۴۰۴/۰۸/۲۸" },

// پروژه ۷
    { id: 60, projectId: 7, title: "ادغام GitHub Actions",         assignee: "Ahmad Hosseini",   role: "Tech Lead",      status: "InProgress", dateAdded: "۱۴۰۴/۱۱/۱۰", deadline: "۸ روز باقی مانده",   startTime: null, endTime: null },
    { id: 61, projectId: 7, title: "اتصال AWS S3",                 assignee: "Ali Rezaei",       role: "Backend",        status: "InProgress", dateAdded: "۱۴۰۴/۱۱/۱۱", deadline: "۱۰ روز باقی مانده",  startTime: null, endTime: null },
    { id: 62, projectId: 7, title: "ساخت webhook های پایش",       assignee: "Ali Rezaei",       role: "Backend",        status: "Backlog",    dateAdded: "۱۴۰۴/۱۱/۱۲", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 63, projectId: 7, title: "طراحی داشبورد یکپارچگی",      assignee: "Mina Karimi",      role: "UI/UX Designer", status: "InProgress", dateAdded: "۱۴۰۴/۱۱/۱۳", deadline: "۷ روز باقی مانده",   startTime: null, endTime: null },
    { id: 64, projectId: 7, title: "پیاده‌سازی رویداد‌های Slack", assignee: "Milad Soleymani",  role: "Frontend",       status: "Overdue",    dateAdded: "۱۴۰۴/۱۱/۱۴", deadline: "تاخیر دارد",          startTime: "۱۴۰۴/۱۱/۱۴", endTime: null },
    { id: 65, projectId: 7, title: "تست اتصال به Jira",           assignee: "Ahmad Hosseini",   role: "Tech Lead",      status: "Done",       dateAdded: "۱۴۰۴/۱۱/۱۵", deadline: "تکمیل شده",           startTime: "۱۴۰۴/۱۱/۱۵", endTime: "۱۴۰۴/۱۱/۲۰" },
    { id: 66, projectId: 7, title: "مستندسازی API های خارجی",     assignee: "Sara Hosseini",    role: "UI/UX",          status: "Backlog",    dateAdded: "۱۴۰۴/۱۱/۱۶", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 67, projectId: 7, title: "پیاده‌سازی retry منطق",       assignee: "Ali Rezaei",       role: "Backend",        status: "Overdue",    dateAdded: "۱۴۰۴/۱۱/۱۷", deadline: "تاخیر دارد",          startTime: "۱۴۰۴/۱۱/۱۷", endTime: null },

// پروژه ۸
    { id: 68, projectId: 8, title: "بررسی درگاه‌های پرداخت",      assignee: "Ahmad Hosseini",   role: "Tech Lead",      status: "Backlog",    dateAdded: "۱۴۰۴/۱۲/۰۱", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 69, projectId: 8, title: "طراحی flow پرداخت",           assignee: "Mina Karimi",      role: "UI/UX Designer", status: "Backlog",    dateAdded: "۱۴۰۴/۱۲/۰۲", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 70, projectId: 8, title: "ادغام با Zarinpal",            assignee: "Ali Rezaei",       role: "Backend",        status: "Backlog",    dateAdded: "۱۴۰۴/۱۲/۰۳", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 71, projectId: 8, title: "پیاده‌سازی صفحه پرداخت",     assignee: "Milad Soleymani",  role: "Frontend",       status: "Backlog",    dateAdded: "۱۴۰۴/۱۲/۰۴", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 72, projectId: 8, title: "ادغام با Idpay",              assignee: "Ali Rezaei",       role: "Backend",        status: "Backlog",    dateAdded: "۱۴۰۴/۱۲/۰۵", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 73, projectId: 8, title: "طراحی رسید پرداخت",           assignee: "Sara Hosseini",    role: "UI/UX",          status: "Backlog",    dateAdded: "۱۴۰۴/۱۲/۰۶", deadline: "شروع نشده",           startTime: null, endTime: null },
    { id: 74, projectId: 8, title: "تست sandbox درگاه",           assignee: "Ahmad Hosseini",   role: "Tech Lead",      status: "Backlog",    dateAdded: "۱۴۰۴/۱۲/۰۷", deadline: "شروع نشده",           startTime: null, endTime: null },
];

const tasksSlice = createSlice({
    name: "tasks",
    initialState: { list: initialTasks },
    reducers: {
        addTask: (state, action) => { state.list.unshift(action.payload); },
        updateTask: (state, action) => {
            const idx = state.list.findIndex(t => t.id === action.payload.id);
            if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload };
        },
        deleteTask: (state, action) => { state.list = state.list.filter(t => t.id !== action.payload); },
        moveTask: (state, action) => {
            const { taskId, newStatus } = action.payload;
            const task = state.list.find(t => t.id === taskId);
            if (!task) return;

            task.status = newStatus;

            if (newStatus === "Done") {
                task.deadline = "تکمیل شده";
            } else if (newStatus === "Overdue") {
                task.deadline = "تاخیر دارد";
            } else if (newStatus === "Backlog") {
                task.deadline = "شروع نشده";
            }
        },
    },
});

export const { addTask, updateTask, deleteTask, moveTask } = tasksSlice.actions;
export default tasksSlice.reducer;