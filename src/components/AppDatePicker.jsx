import { useState } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const PERSIAN_MONTHS = [
    "فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور",
    "مهر","آبان","آذر","دی","بهمن","اسفند"
];

const PERSIAN_DAYS = ["ش","ی","د","س","چ","پ","ج"];

function toJalali(gy, gm, gd) {
    let g_d_no, j_d_no, j_np, i;
    const g_days_in_month = [31,28,31,30,31,30,31,31,30,31,30,31];
    const j_days_in_month = [31,31,31,31,31,31,30,30,30,30,30,29];
    gy -= 1600; gm -= 1; gd -= 1;
    g_d_no = 365*gy + Math.floor((gy+3)/4) - Math.floor((gy+99)/100) + Math.floor((gy+399)/400);
    for(i=0; i<gm; i++) g_d_no += g_days_in_month[i];
    if(gm>1 && ((gy%4===0 && gy%100!==0) || gy%400===0)) g_d_no++;
    g_d_no += gd;
    j_d_no = g_d_no - 79;
    j_np = Math.floor(j_d_no/12053); j_d_no %= 12053;
    let jy = 979 + 33*j_np + 4*Math.floor(j_d_no/1461);
    j_d_no %= 1461;
    if(j_d_no >= 366){ jy += Math.floor((j_d_no-1)/365); j_d_no = (j_d_no-1)%365; }
    for(i=0; i<11 && j_d_no >= j_days_in_month[i]; i++) j_d_no -= j_days_in_month[i];
    return [jy, i+1, j_d_no+1];
}

function toGregorian(jy, jm, jd) {
    jy += 1595; jd -= 1; jm -= 1;
    let jDNO = 365*jy + Math.floor(jy/33)*8 + Math.floor((jy%33+3)/4) + jd;
    for(let i=0; i<jm; i++) jDNO += i<6 ? 31 : 30;
    jDNO += 1948320;
    let l = jDNO + 68569, n = Math.floor(4*l/146097);
    l -= Math.floor((146097*n+3)/4);
    let i2 = Math.floor(4000*(l+1)/1461001);
    l -= Math.floor(1461*i2/4) - 31;
    let j2 = Math.floor(80*l/2447), k = l - Math.floor(2447*j2/80);
    l = Math.floor(j2/11); j2 += 2 - 12*l;
    i2 += 100*(n-49) + l;
    return [i2, j2, k];
}

function jalaliDaysInMonth(jy, jm) {
    if(jm <= 6) return 31;
    if(jm <= 11) return 30;
    const [gy] = toGregorian(jy, 12, 29);
    const isLeap = (gy%4===0 && gy%100!==0) || gy%400===0;
    return isLeap ? 30 : 29;
}

function getFirstDayOfMonth(jy, jm) {
    const [gy, gm, gd] = toGregorian(jy, jm, 1);
    const date = new Date(gy, gm-1, gd);
    return (date.getDay() + 1) % 7;
}

export default function AppDatePicker({ label, value, onChange, disabled, error }) {
    const [open, setOpen] = useState(false);

    const today = new Date();
    const [ty, tm, td] = toJalali(today.getFullYear(), today.getMonth()+1, today.getDate());

    let initY = ty, initM = tm;
    if (value) {
        const parts = value.split("/");
        if (
            parts.length === 3 &&
            !isNaN(parseInt(parts[0])) &&
            !isNaN(parseInt(parts[1])) &&
            parseInt(parts[1]) >= 1 &&
            parseInt(parts[1]) <= 12
        ) {
            initY = parseInt(parts[0]);
            initM = parseInt(parts[1]);
        }
    }


    const [viewY, setViewY] = useState(initY);
    const [viewM, setViewM] = useState(initM);

    const prevMonth = () => {
        if(viewM === 1) { setViewM(12); setViewY(y => y-1); }
        else setViewM(m => m-1);
    };
    const nextMonth = () => {
        if(viewM === 12) { setViewM(1); setViewY(y => y+1); }
        else setViewM(m => m+1);
    };

    const daysInMonth = jalaliDaysInMonth(viewY, viewM);
    const firstDay = getFirstDayOfMonth(viewY, viewM);
    const cells = Array(firstDay).fill(null).concat(Array.from({length: daysInMonth}, (_,i) => i+1));

    const handleSelect = (day) => {
        if(!day) return;
        const m = String(viewM).padStart(2,"0");
        const d = String(day).padStart(2,"0");
        onChange(`${viewY}/${m}/${d}`);
        setOpen(false);
    };

    const isSelected = (day) => {
        if(!day || !value) return false;
        const parts = value.split("/");
        return parseInt(parts[0])===viewY && parseInt(parts[1])===viewM && parseInt(parts[2])===day;
    };

    const isToday = (day) => day && viewY===ty && viewM===tm && day===td;

    return (
        <div className="flex flex-col gap-1 w-full relative" dir="rtl">
            {label && <label className="text-xs text-gray-500 font-medium">{label}</label>}
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen(o => !o)}
                className={`w-full flex items-center justify-between border rounded-lg px-3 py-2 text-sm bg-white text-right
                    ${error ? "border-red-400" : "border-gray-300"}
                    ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-300"}`}
            >
                <span className={value ? "text-gray-800" : "text-gray-400"}>{value || label}</span>
                <FiCalendar size={15} className="text-gray-400 mr-2 flex-shrink-0" />
            </button>

            {open && (
                <div className="absolute top-full mt-1 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-72">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <button type="button" onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-lg">
                            <FiChevronRight size={16} />
                        </button>
                        <span className="text-sm font-bold text-gray-800">
                            {PERSIAN_MONTHS[viewM-1]} {viewY}
                        </span>
                        <button type="button" onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-lg">
                            <FiChevronLeft size={16} />
                        </button>
                    </div>

                    {/* Day names */}
                    <div className="grid grid-cols-7 mb-1">
                        {PERSIAN_DAYS.map(d => (
                            <div key={d} className="text-center text-[11px] text-gray-400 font-medium py-1">{d}</div>
                        ))}
                    </div>

                    {/* Days */}
                    <div className="grid grid-cols-7 gap-0.5">
                        {cells.map((day, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleSelect(day)}
                                disabled={!day}
                                className={`h-8 w-full rounded-lg text-xs font-medium transition-colors
                                    ${!day ? "invisible" : ""}
                                    ${isSelected(day) ? "text-white" : ""}
                                    ${isToday(day) && !isSelected(day) ? "border border-pink-400 text-pink-600" : ""}
                                    ${!isSelected(day) && day ? "hover:bg-pink-50 text-gray-700" : ""}
                                `}
                                style={isSelected(day) ? { background: "linear-gradient(135deg, #E91E8C, #9C27B0)" } : {}}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    {/* Clear */}
                    {value && (
                        <button type="button" onClick={() => { onChange(""); setOpen(false); }}
                                className="w-full mt-2 text-xs text-gray-400 hover:text-red-500 text-center py-1">
                            پاک کردن
                        </button>
                    )}
                </div>
            )}
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}