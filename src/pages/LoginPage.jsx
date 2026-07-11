import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../store/authSlice';

const TABS = [
    { id: 'password', label: 'ورود با رمز' },
    { id: 'otp', label: 'ورود با OTP' },
    { id: 'register', label: 'ثبت‌نام' },
    { id: 'forgot', label: 'فراموشی رمز' },
];

// ─── Shared Input ─────────────────────────────────────────────────────────────
const Input = ({ label, ...props }) => (
    <div className="flex flex-col gap-1">
        {label && <label className="text-xs text-gray-500 font-medium">{label}</label>}
        <input
            {...props}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all placeholder:text-gray-300"
        />
    </div>
);

// ─── Submit Button ────────────────────────────────────────────────────────────
const SubmitButton = ({ loading, children }) => (
    <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all"
        style={{
            background: loading
                ? '#F48FB5'
                : '#E91E8C',
            cursor: loading ? 'not-allowed' : 'pointer',
        }}
    >
        {loading ? 'لطفاً صبر کنید...' : children}
    </button>
);

// ─── Login With Password ──────────────────────────────────────────────────────
const LoginWithPassword = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { status, error } = useSelector(s => s.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ username, password }));
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs border border-red-100"
                     onClick={() => dispatch(clearError())}>
                    {error}
                </div>
            )}
            <Input label="نام کاربری" type="text" placeholder="milad" value={username} onChange={e => setUsername(e.target.value)} />
            <Input label="رمز عبور" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            <SubmitButton loading={status === 'loading'}>ورود</SubmitButton>
        </form>
    );
};

// ─── Login With OTP ───────────────────────────────────────────────────────────
const LoginWithOtp = () => {
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const handleSend = (e) => {
        e.preventDefault();
        if (!mobile) return;
        setOtpSent(true);
    };

    const handleVerify = (e) => {
        e.preventDefault();
        alert(`OTP تأیید شد: ${otp}`);
    };

    return (
        <form onSubmit={otpSent ? handleVerify : handleSend} className="flex flex-col gap-4">
            <Input label="شماره موبایل" type="text" placeholder="09123456789" value={mobile} onChange={e => setMobile(e.target.value)} />
            {otpSent && (
                <Input label="کد OTP" type="text" placeholder="کد ارسال شده را وارد کنید" value={otp} onChange={e => setOtp(e.target.value)} />
            )}
            {otpSent && (
                <p className="text-xs text-gray-400 text-center">
                    کد به {mobile} ارسال شد.{' '}
                    <button type="button" onClick={() => setOtpSent(false)} className="text-primary-400 underline">ارسال مجدد</button>
                </p>
            )}
            <SubmitButton loading={false}>{otpSent ? 'تأیید کد' : 'ارسال کد'}</SubmitButton>
        </form>
    );
};

// ─── Register ─────────────────────────────────────────────────────────────────
const Register = () => {
    const [form, setForm] = useState({ firstName: '', lastName: '', mobile: '', email: '', password: '', confirm: '' });
    const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.password !== form.confirm) { alert('رمزها یکسان نیستند'); return; }
        alert('ثبت‌نام موفق');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
                <Input label="نام" type="text" placeholder="علی" value={form.firstName} onChange={set('firstName')} />
                <Input label="نام خانوادگی" type="text" placeholder="رضایی" value={form.lastName} onChange={set('lastName')} />
            </div>
            <Input label="موبایل" type="text" placeholder="09123456789" value={form.mobile} onChange={set('mobile')} />
            <Input label="ایمیل" type="email" placeholder="example@email.com" value={form.email} onChange={set('email')} />
            <Input label="رمز عبور" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} />
            <Input label="تکرار رمز عبور" type="password" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} />
            <SubmitButton loading={false}>ثبت‌نام</SubmitButton>
        </form>
    );
};

// ─── Forgot Password ──────────────────────────────────────────────────────────
const ForgotPassword = ({ onBack }) => {
    const [step, setStep] = useState(1);
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const handleStep1 = (e) => { e.preventDefault(); setStep(2); };
    const handleStep2 = (e) => { e.preventDefault(); setStep(3); };
    const handleStep3 = (e) => {
        e.preventDefault();
        if (password !== confirm) { alert('رمزها یکسان نیستند'); return; }
        alert('رمز با موفقیت تغییر کرد');
        onBack();
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Steps indicator */}
            <div className="flex items-center justify-center gap-2 mb-2">
                {[1, 2, 3].map(s => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'text-white' : 'bg-gray-100 text-gray-400'}`}
                             style={step >= s ? { background: '#E91E8C' } : {}}>
                            {s}
                        </div>
                        {s < 3 && <div className={`w-8 h-0.5 rounded ${step > s ? 'bg-primary-400' : 'bg-gray-200'}`} />}
                    </div>
                ))}
            </div>

            {step === 1 && (
                <form onSubmit={handleStep1} className="flex flex-col gap-4">
                    <p className="text-xs text-gray-500 text-center">شماره موبایل یا نام کاربری خود را وارد کنید</p>
                    <Input label="موبایل / نام کاربری" type="text" placeholder="09123456789" value={mobile} onChange={e => setMobile(e.target.value)} />
                    <SubmitButton loading={false}>ارسال کد بازیابی</SubmitButton>
                </form>
            )}
            {step === 2 && (
                <form onSubmit={handleStep2} className="flex flex-col gap-4">
                    <p className="text-xs text-gray-500 text-center">کد ارسال شده به {mobile} را وارد کنید</p>
                    <Input label="کد تأیید" type="text" placeholder="کد ۶ رقمی" value={otp} onChange={e => setOtp(e.target.value)} />
                    <SubmitButton loading={false}>تأیید کد</SubmitButton>
                </form>
            )}
            {step === 3 && (
                <form onSubmit={handleStep3} className="flex flex-col gap-4">
                    <Input label="رمز جدید" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                    <Input label="تکرار رمز جدید" type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} />
                    <SubmitButton loading={false}>ثبت رمز جدید</SubmitButton>
                </form>
            )}
        </div>
    );
};

// ─── Main LoginPage ───────────────────────────────────────────────────────────
const LoginPage = () => {
    const [activeTab, setActiveTab] = useState('password');
    const navigate = useNavigate();
    const { user } = useSelector(s => s.auth);

    if (user) { navigate('/dashboard'); return null; }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('/login-bg3.png')] bg-cover" dir="rtl">
            {/* Card */}
            <div className="bg-white rounded-2xl shadow-xl w-[420px] max-w-full overflow-hidden">
                {/* Top gradient bar */}
                <div className="h-1.5 w-full" style={{ background: '#E91E8C' }} />

                <div className="p-8">
                    {/* Logo / Title */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3"
                             style={{ background: '#E91E8C' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h1 className="text-lg font-bold text-gray-800">مدیریت پروژه</h1>
                        <p className="text-xs text-gray-400 mt-0.5">به حساب خود وارد شوید</p>
                    </div>

                    {/* Tabs — فقط ۳ تا اول نشون بده، forgot رو جدا */}
                    {activeTab !== 'forgot' && (
                        <div className="flex bg-gray-50 rounded-xl p-1 mb-6 gap-1">
                            {TABS.filter(t => t.id !== 'forgot').map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                                    style={activeTab === tab.id
                                        ? { background: '#E91E8C', color: '#fff' }
                                        : { color: '#9CA3AF' }
                                    }
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Content */}
                    {activeTab === 'password' && <LoginWithPassword />}
                    {activeTab === 'otp' && <LoginWithOtp />}
                    {activeTab === 'register' && <Register />}
                    {activeTab === 'forgot' && <ForgotPassword onBack={() => setActiveTab('password')} />}

                    {/* Footer link */}
                    {activeTab === 'password' && (
                        <p className="text-center text-xs text-gray-400 mt-4">
                            رمز خود را فراموش کردید؟{' '}
                            <button onClick={() => setActiveTab('forgot')} className="text-primary-400 font-medium underline">
                                بازیابی رمز
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;