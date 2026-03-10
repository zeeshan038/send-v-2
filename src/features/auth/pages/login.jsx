import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Zap, Shield, Cloud, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [showPass, setShowPass] = useState(false);

    return (
        <div className="min-h-screen w-full flex items-center justify-center font-sans dark:bg-zinc-950 bg-[#f8faff] transition-colors duration-300 px-4 py-10 relative overflow-hidden">

            {/* Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500 opacity-[0.03] dark:opacity-[0.05] rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500 opacity-[0.03] dark:opacity-[0.05] rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-[450px] relative z-10"
            >
                {/* Back to Home */}
                <Link to="/" className="inline-flex items-center gap-2 text-[13px] font-bold text-gray-400 hover:text-[#2b3a8c] dark:hover:text-blue-400 transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to home
                </Link>

                <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-white dark:border-zinc-800 shadow-[0_40px_100px_rgba(0,0,0,0.05)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.4)] rounded-[32px] p-8 md:p-10">
                    {/* Header */}
                    <div className="mb-10 text-center">
                        <h1 className="text-[32px] font-black text-[#0a0e2e] dark:text-white tracking-tight leading-tight mb-3">
                            Welcome back
                        </h1>
                        <p className="text-[14px] text-gray-500 dark:text-zinc-400 font-medium">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-[#2b3a8c] dark:text-blue-400 font-bold hover:underline underline-offset-4">Sign up free</Link>
                        </p>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {[
                            { label: 'Google', svg: <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg> },
                            { label: 'Microsoft', svg: <svg className="w-5 h-5" viewBox="0 0 24 24"><rect x="1.5" y="1.5" width="9.5" height="9.5" fill="#F25022" /><rect x="1.5" y="12" width="9.5" height="9.5" fill="#00A4EF" /><rect x="12" y="1.5" width="9.5" height="9.5" fill="#7FBA00" /><rect x="12" y="12" width="9.5" height="9.5" fill="#FFB900" /></svg> },
                        ].map(({ label, svg }) => (
                            <button key={label} className="h-14 bg-white dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 hover:border-gray-200 dark:hover:border-zinc-600 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-sm">
                                {svg}
                                <span className="text-[14px] font-bold text-gray-700 dark:text-zinc-200">{label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-8 text-gray-300 dark:text-zinc-800">
                        <div className="flex-1 h-px bg-current" />
                        <span className="text-[11px] text-gray-400 dark:text-zinc-500 uppercase font-black tracking-widest">or email</span>
                        <div className="flex-1 h-px bg-current" />
                    </div>

                    {/* Form */}
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-1.5">
                            <label className="text-[12px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-wider ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                className="w-full h-14 px-5 rounded-2xl bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700/50 focus:border-[#2b3a8c] dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-[15px] dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 font-medium"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[12px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Password</label>
                                <a href="#" className="text-[12px] font-bold text-[#2b3a8c] dark:text-blue-400 hover:underline underline-offset-4">Forgot?</a>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="w-full h-14 px-5 pr-12 rounded-2xl bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700/50 focus:border-[#2b3a8c] dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-[15px] dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 font-medium"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors">
                                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-14 rounded-2xl bg-[#2b3a8c] hover:bg-[#1e2a6a] dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-black text-[15px] transition-all shadow-[0_8px_30px_rgba(43,58,140,0.25)] dark:shadow-[0_8px_30px_rgba(37,99,235,0.25)] flex items-center justify-center gap-2 active:scale-[0.98] mt-2"
                        >
                            Sign in to SendByCloud
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <p className="text-center text-[12px] text-gray-400 dark:text-zinc-500 mt-8 leading-relaxed font-medium">
                        Securely encrypted and compliant with <br />
                        <span className="text-gray-600 dark:text-zinc-300 font-bold">GDPR & ISO 27001 Standards</span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;