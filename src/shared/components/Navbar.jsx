import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu } from 'lucide-react';
import logo from '../../assets/logo2.png';

const navItems = [
    { name: "My Account", path: "/my-account" },
    { name: "About Us", path: "/about" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Contact Us", path: "/contact" },
];

const drawerVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { duration: 0.38, ease: [0.76, 0, 0.24, 1] } },
    exit: { x: '100%', transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] } },
};

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.25 } },
};

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) =>
        location.pathname === path || location.pathname.startsWith(path + '/');

    return (
        <>
            {/* ── Top Bar ── */}
            <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-transparent">
                <Link to="/" className="flex items-center p-2 bg-white rounded-xl shadow-md hover:scale-105 transition-transform">
                    <img src={logo} alt="Logo" className="w-8 h-auto object-contain" />
                </Link>

                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100/80 p-1 gap-1">
                        <Link to="/login" className="px-4 py-2 rounded-lg text-[14px] font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#2b3a8c] transition-all">
                            Sign in
                        </Link>
                        <Link to="/register"
                            className="px-4 py-2 rounded-lg text-[14px] font-semibold text-white transition-all hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg, #2b3a8c, #1e2a6a)', boxShadow: '0 4px 12px rgba(43,58,140,0.3)' }}>
                            Sign up
                        </Link>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setIsOpen(v => !v)}
                        className="w-11 h-11 rounded-xl shadow-md border border-gray-100/80 flex items-center justify-center transition-colors"
                        style={{ background: isOpen ? 'linear-gradient(135deg, #2b3a8c, #1e2a6a)' : 'rgba(255,255,255,0.9)' }}
                        aria-label="Toggle navigation"
                    >
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.span key="close"
                                    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                                    <X className="w-5 h-5 text-white" />
                                </motion.span>
                            ) : (
                                <motion.span key="open"
                                    initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                                    <Menu className="w-5 h-5 text-gray-700" />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </nav>

            {/* ── Drawer ── */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            variants={backdropVariants}
                            initial="hidden" animate="visible" exit="exit"
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-[59] bg-black/20 backdrop-blur-[2px]"
                        />

                        {/* Panel */}
                        <motion.div
                            key="drawer"
                            variants={drawerVariants}
                            initial="hidden" animate="visible" exit="exit"
                            className="fixed top-0 right-0 h-full z-[60] w-[260px] bg-white flex flex-col"
                            style={{ boxShadow: '-12px 0 40px rgba(0,0,0,0.08)' }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                                <img src={logo} alt="Logo" className="w-24 h-auto object-contain" />
                                <motion.button
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsOpen(false)}
                                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </motion.button>
                            </div>

                            {/* Nav Links */}
                            <div className="flex flex-col px-3 py-6 gap-1 flex-1">
                                {navItems.map((item, i) => (
                                    <motion.div
                                        key={item.path}
                                        initial={{ opacity: 0, x: 16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.08 + i * 0.06, duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                                    >
                                        <Link
                                            to={item.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`block px-4 py-3 rounded-xl text-[14px] font-semibold transition-all
                                                ${isActive(item.path)
                                                    ? 'text-[#2b3a8c] bg-blue-50'
                                                    : 'text-gray-600 hover:text-[#1e2a6a] hover:bg-gray-50'
                                                }`}
                                        >
                                            {item.name}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-5 border-t border-gray-100">
                                <p className="text-[11px] text-gray-300 font-medium">© {new Date().getFullYear()} SendByCloud</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;