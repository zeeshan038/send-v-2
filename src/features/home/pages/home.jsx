import React, { useState, useRef } from 'react';
import {
    Plus, DownloadCloud, ChevronRight, X,
    File, Folder, Mail, Link as LinkIcon, Video,
    FileText, CheckCircle2
} from 'lucide-react';
import SettingsModal from '../components/SettingsModal';
import { motion, AnimatePresence } from 'framer-motion';

const TRANSFER_METHODS = [
    {
        id: 'email',
        label: 'Email',
        icon: Mail,
        desc: 'Send to an email address',
        lightBg: 'bg-blue-50',
        lightText: 'text-blue-700',
        ring: 'ring-blue-500/20',
    },
    {
        id: 'link',
        label: 'Link',
        icon: LinkIcon,
        desc: 'Share a download link',
        lightBg: 'bg-blue-50',
        lightText: 'text-blue-700',
        ring: 'ring-blue-500/20',
    },
    {
        id: 'video',
        label: 'Video',
        icon: Video,
        desc: 'Send as a video message',
        lightBg: 'bg-blue-50',
        lightText: 'text-blue-700',
        ring: 'ring-blue-500/20',
    },
];

const Home = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [transferType, setTransferType] = useState('files'); // 'files' | 'folders'
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null); // null | 'email' | 'link' | 'video'
    const fileInputRef = useRef(null);

    const hasFiles = uploadedFiles.length > 0;

    const handleFiles = (files) => {
        const newFiles = Array.from(files);
        setUploadedFiles(prev => [...prev, ...newFiles]);
        // Reset method selection when new files are added if none chosen yet
        if (!selectedMethod) setSelectedMethod(null);
    };

    const removeFile = (idx) => {
        setUploadedFiles(prev => {
            const next = prev.filter((_, i) => i !== idx);
            if (next.length === 0) setSelectedMethod(null);
            return next;
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);

    const formatBytes = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="relative min-h-screen w-full font-sans text-gray-900 overflow-hidden bg-gradient-to-br from-[#f0f4f9] to-[#d6e4f9] pt-[85px] lg:pt-[90px]">
            {/* Abstract floating shapes */}
            <motion.div
                animate={{ rotate: [0, 90, 180, 270, 360], scale: [1, 1.1, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-400 opacity-20 rounded-full blur-[100px] pointer-events-none"
            />
            <motion.div
                animate={{ rotate: [360, 270, 180, 90, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500 opacity-15 rounded-full blur-[80px] pointer-events-none"
            />

            {/* Main Container */}
            <main className="relative z-10 flex items-center h-[calc(100vh-140px)] px-6 md:px-12 lg:px-24 pointer-events-none pb-20 md:pb-0">

                {/* Hero Text - Right side on desktop */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute right-24 pointer-events-none hidden lg:flex flex-col items-end gap-6 z-0 max-w-xl"
                >
                    <h1 className="text-6xl font-black tracking-tight text-[#1e2a6a] text-right leading-[1.1]">
                        Send large files with <br /> absolute <span className="relative inline-block"><span className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 blur-lg opacity-30"></span><span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">simplicity</span></span>.
                    </h1>
                    <p className="text-lg font-medium text-gray-600 text-right max-w-sm">
                        Fast, secure and beautifully designed. Share your heaviest projects without breaking a sweat.
                    </p>
                </motion.div>

                {/* Transfer Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                    className={`w-[320px] bg-white/95 backdrop-blur-2xl border border-white shadow-[0_40px_100px_rgba(43,58,140,0.15)] flex flex-col pointer-events-auto relative z-20 transition-all duration-500 ring-1 ring-black/5 ${isSettingsOpen ? 'rounded-l-[24px] rounded-r-none' : 'rounded-[24px]'}`}
                >
                    <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

                    <div className="p-4 md:p-5 flex flex-col h-full relative z-10 bg-white/40 rounded-[inherit] overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-1.5 pb-1.5 border-b border-gray-100/80">
                            <h2 className="text-[14px] font-extrabold text-[#1e2a6a] flex items-center gap-1.5">
                                <div className="bg-blue-100/50 p-1.5 rounded-xl text-blue-600 shadow-inner">
                                    <DownloadCloud className="w-4 h-4" />
                                </div>
                                Transfer files
                            </h2>
                        </div>

                        {/* Upload Type Toggle */}
                        <div className="flex gap-3 mb-3 p-1 bg-gray-50/80 rounded-2xl border border-gray-100/50 relative overflow-hidden">
                            {['files', 'folders'].map((type) => (
                                <motion.button
                                    key={type}
                                    onClick={() => setTransferType(type)}
                                    className={`relative z-10 cursor-pointer flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-colors ${transferType === type ? 'text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {transferType === type && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-1.5">
                                        {type === 'files' ? <File className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Drop Zone */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={`group relative border-2 border-dashed rounded-[20px] py-3 flex flex-col items-center justify-center text-center mb-3 transition-all cursor-pointer overflow-hidden
                                ${isDragging
                                    ? 'border-blue-500 bg-blue-50 scale-[1.02]'
                                    : 'border-blue-200/80 bg-gradient-to-b from-[#f8fbff] to-white hover:border-blue-400 hover:bg-blue-50/50'
                                }`}
                        >
                            <div className="absolute inset-0 bg-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div
                                className="w-9 h-9 bg-white rounded-full flex items-center justify-center mb-1.5 shadow-[0_8px_16px_rgba(30,66,159,0.08)] group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 ring-1 ring-black/5"
                            >
                                <Plus className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-[13px] font-bold text-gray-800 mb-0.5 group-hover:text-blue-700 transition-colors">
                                {isDragging ? 'Drop to upload' : `Upload ${transferType}`}
                            </span>
                            <span className="text-[11px] text-gray-500 font-medium px-4">
                                Fast transfer up to <strong className="text-gray-700">50 GB</strong>
                            </span>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple={transferType === 'files'}
                                className="hidden"
                                onChange={(e) => handleFiles(e.target.files)}
                            />
                        </motion.div>

                        {/* Uploaded Files List */}
                        <AnimatePresence>
                            {hasFiles && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-3 overflow-hidden"
                                >
                                    <div className="flex flex-col gap-1.5 max-h-[90px] overflow-y-auto pr-1">
                                        {uploadedFiles.map((file, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ delay: idx * 0.04 }}
                                                className="flex items-center gap-2 bg-blue-50/80 border border-blue-100 rounded-xl px-2.5 py-1.5"
                                            >
                                                <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                <span className="text-[11px] font-semibold text-gray-700 flex-1 truncate">{file.name}</span>
                                                <span className="text-[10px] text-gray-400 shrink-0">{formatBytes(file.size)}</span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Transfer Method Options — shown only when files are added */}
                        <AnimatePresence>
                            {hasFiles && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="mb-3"
                                >
                                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">How to share?</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {TRANSFER_METHODS.map(({ id, label, icon: Icon, lightBg, lightText, ring, color }) => {
                                            const isActive = selectedMethod === id;
                                            return (
                                                <motion.button
                                                    key={id}
                                                    whileHover={{ scale: 1.04 }}
                                                    whileTap={{ scale: 0.96 }}
                                                    onClick={() => setSelectedMethod(prev => prev === id ? null : id)}
                                                    className={`cursor-pointer relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border transition-all font-semibold text-[12px]
                                                        ${isActive
                                                            ? `${lightBg} ${lightText} border-transparent ring-2 ${ring} shadow-sm`
                                                            : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100 hover:text-gray-700'
                                                        }`}
                                                >
                                                    {isActive && (
                                                        <motion.div
                                                            layoutId="methodGlow"
                                                            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} opacity-10`}
                                                            transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                                                        />
                                                    )}
                                                    <Icon className="w-4 h-4 relative z-10" />
                                                    <span className="relative z-10">{label}</span>
                                                    {isActive && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="absolute top-1 right-1"
                                                        >
                                                            <CheckCircle2 className={`w-3 h-3 ${lightText}`} />
                                                        </motion.div>
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Email Form — shown only when email method is selected */}
                        <AnimatePresence>
                            {selectedMethod === 'email' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.35, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="flex flex-col gap-2 mb-3 overflow-y-auto max-h-[200px] pr-1">
                                        {/* Email to */}
                                        <div className="relative group/input">
                                            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 group-focus-within/input:border-blue-400 group-focus-within/input:bg-white group-hover/input:border-gray-300" />
                                            <input type="email" placeholder="Email to" className="relative w-full bg-transparent outline-none text-[13px] text-gray-800 placeholder-gray-400 font-semibold px-3 py-2.5 z-10" />
                                        </div>
                                        {/* Your email */}
                                        <div className="relative group/input">
                                            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 group-focus-within/input:border-blue-400 group-focus-within/input:bg-white group-hover/input:border-gray-300" />
                                            <input type="email" placeholder="Your email" className="relative w-full bg-transparent outline-none text-[13px] text-gray-800 placeholder-gray-400 font-semibold px-3 py-2.5 z-10" />
                                        </div>
                                        {/* Title */}
                                        <div className="relative group/input">
                                            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 group-focus-within/input:border-blue-400 group-focus-within/input:bg-white group-hover/input:border-gray-300" />
                                            <input type="text" placeholder="Title" className="relative w-full bg-transparent outline-none text-[13px] text-gray-800 placeholder-gray-400 font-semibold px-3 py-2.5 z-10" />
                                        </div>
                                        {/* Message */}
                                        <div className="relative group/input">
                                            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-xl transition-all group-focus-within/input:ring-4 group-focus-within/input:ring-blue-100 group-focus-within/input:border-blue-400 group-focus-within/input:bg-white group-hover/input:border-gray-300" />
                                            <textarea placeholder="Message" className="relative w-full bg-transparent outline-none text-[13px] text-gray-800 placeholder-gray-400 font-medium px-3 py-2.5 z-10 resize-none h-[70px]" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Link info — shown when link method is selected */}
                        <AnimatePresence>
                            {selectedMethod === 'link' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.35, ease: "easeInOut" }}
                                    className="overflow-hidden mb-3"
                                >
                                    <div className="bg-blue-50 border border-blue-100 rounded-2xl px-3 py-3 text-center">
                                        <LinkIcon className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                                        <p className="text-[12px] font-semibold text-blue-700">A shareable link will be generated after upload.</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Video info — shown when video method is selected */}
                        <AnimatePresence>
                            {selectedMethod === 'video' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.35, ease: "easeInOut" }}
                                    className="overflow-hidden mb-3"
                                >
                                    <div className="bg-blue-50 border border-blue-100 rounded-2xl px-3 py-3 text-center">
                                        <Video className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                                        <p className="text-[12px] font-semibold text-blue-700">Record a short video message to send with your files.</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit + Settings Buttons */}
                        <div className="flex items-center gap-3 mt-auto pt-2">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="cursor-pointer flex-1 text-white rounded-2xl h-11 font-bold text-[14px] flex items-center justify-center gap-2 transition-all border bg-gradient-to-r from-[#2b3a8c] to-[#1e2a6a] hover:from-[#1e2a6a] hover:to-[#151e4d] shadow-[0_8px_20px_rgba(43,58,140,0.3)] hover:shadow-[0_12px_25px_rgba(43,58,140,0.4)] border-[#2b3a8c]"
                            >
                                Transfer
                            </motion.button>

                            {/* <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`cursor-pointer w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center transition-all ${isSettingsOpen ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500/20 shadow-inner' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 shadow-sm border border-gray-200/50'}`}
                                onClick={() => setIsSettingsOpen(prev => !prev)}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={isSettingsOpen ? 'close' : 'open'}
                                        initial={{ opacity: 0, rotate: -90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: 90 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        {isSettingsOpen ? <X className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.button> */}
                        </div>

                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Home;