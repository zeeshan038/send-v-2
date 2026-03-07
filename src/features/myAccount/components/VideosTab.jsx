import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Trash2, HardDrive, Calendar, Video, Play, Pause, X, Clock, ArrowLeft, Volume2, VolumeX, Maximize, Minimize, SlidersHorizontal, Settings, ChevronLeft, ChevronRight, Check, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockVideos = [
    {
        id: 1,
        title: 'Interview_Recording.mp4',
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: '0:10',
        size: '45 MB',
        date: 'Yesterday',
        thumbnail: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=400'
    },
    {
        id: 2,
        title: 'Interview_Recording.mp4',
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: '0:10',
        size: '45 MB',
        date: 'Yesterday',
        thumbnail: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=400'
    },
    {
        id: 3,
        title: 'Tutorial_Screen_Record.mp4',
        src: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: '0:10',
        size: '128 MB',
        date: 'Oct 15, 2023',
        thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=400'
    },
];

const VideoPlayer = ({ videos, initialIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const video = videos[currentIndex];

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState('0:00');
    const [duration, setDuration] = useState('0:00');
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [settingsView, setSettingsView] = useState('main'); // 'main', 'speed', 'quality'
    const [playbackRate, setPlaybackRate] = useState(1);
    const [quality, setQuality] = useState('Auto');
    const [showDetails, setShowDetails] = useState(true);

    const videoRef = useRef(null);
    const playerContainerRef = useRef(null);
    const scrollingRef = useRef(false);

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const togglePlay = (e) => {
        if (e) e.stopPropagation();
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const dur = videoRef.current.duration;
            setCurrentTime(formatTime(current));
            if (dur > 0) {
                setProgress((current / dur) * 100);
            }
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(formatTime(videoRef.current.duration));
        }
    };

    const handleSeek = (e) => {
        if (e) e.stopPropagation();
        const bar = e.currentTarget;
        const clickPosition = e.clientX - bar.getBoundingClientRect().left;
        const percentage = clickPosition / bar.offsetWidth;
        if (videoRef.current) {
            videoRef.current.currentTime = percentage * videoRef.current.duration;
        }
    };

    const toggleMute = (e) => {
        if (e) e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleFullscreen = (e) => {
        if (e) e.stopPropagation();
        if (!document.fullscreenElement) {
            playerContainerRef.current?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Auto play on mount and when video changes
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(() => {
                setIsPlaying(false);
            });
        }
    }, [currentIndex]);

    const handleWheel = (e) => {
        if (scrollingRef.current) return;
        if (e.deltaY > 40) { // scroll down -> next
            if (currentIndex < videos.length - 1) {
                scrollingRef.current = true;
                setCurrentIndex(prev => prev + 1);
                setTimeout(() => scrollingRef.current = false, 800);
            }
        } else if (e.deltaY < -40) { // scroll up -> prev
            if (currentIndex > 0) {
                scrollingRef.current = true;
                setCurrentIndex(prev => prev - 1);
                setTimeout(() => scrollingRef.current = false, 800);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[101] flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-xl gap-6"
            onWheel={handleWheel}
        >
            {/* Random animated background effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/30 opacity-70 pointer-events-none blur-3xl animate-pulse" />

            <div className="relative w-full max-w-5xl aspect-video mx-6 mt-8 z-10 flex items-center justify-center">

                {/* Left Stack (Previous Videos) */}
                {videos.map((vid, i) => {
                    if (i >= currentIndex) return null;
                    const diff = currentIndex - i;
                    if (diff > 3) return null;
                    return (
                        <div
                            key={`left-${i}`}
                            onClick={() => setCurrentIndex(i)}
                            className="absolute inset-0 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-x-6 hover:rotate-[-6deg] group"
                            style={{
                                zIndex: 10 - diff,
                                transform: `translateX(-${diff * 4}%) scale(${1 - diff * 0.06}) rotate(-${diff * 3}deg)`,
                                opacity: 1 - diff * 0.15,
                                boxShadow: '-10px 10px 40px rgba(0,0,0,0.6)',
                                transformOrigin: 'bottom left'
                            }}
                        >
                            <div className="absolute inset-0 bg-black/50 z-10 group-hover:bg-black/30 transition-colors" />
                            {vid.thumbnail ? (
                                <img src={vid.thumbnail} alt="thumb" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 border border-white/10 flex items-center justify-center">
                                    <Video className="w-12 h-12 text-white/20" />
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Right Stack (Next Videos) */}
                {videos.map((vid, i) => {
                    if (i <= currentIndex) return null;
                    const diff = i - currentIndex;
                    if (diff > 3) return null;
                    return (
                        <div
                            key={`right-${i}`}
                            onClick={() => setCurrentIndex(i)}
                            className="absolute inset-0 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:translate-x-6 hover:rotate-[6deg] group"
                            style={{
                                zIndex: 10 - diff,
                                transform: `translateX(${diff * 4}%) scale(${1 - diff * 0.06}) rotate(${diff * 3}deg)`,
                                opacity: 1 - diff * 0.15,
                                boxShadow: '10px 10px 40px rgba(0,0,0,0.6)',
                                transformOrigin: 'bottom right'
                            }}
                        >
                            <div className="absolute inset-0 bg-black/50 z-10 group-hover:bg-black/30 transition-colors" />
                            {vid.thumbnail ? (
                                <img src={vid.thumbnail} alt="thumb" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 border border-white/10 flex items-center justify-center">
                                    <Video className="w-12 h-12 text-white/20" />
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Main Video Player */}
                <div
                    ref={playerContainerRef}
                    className="bg-black w-full h-full absolute inset-0 relative group flex items-center justify-center rounded-3xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.9)] ring-1 ring-white/20 object-contain shrink-0 z-20"
                    onClick={() => { }}
                >
                    {/* Close btn */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors pointer-events-auto shadow-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Video container with AnimatePresence for smooth transitions */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full absolute inset-0"
                        >
                            <video
                                ref={videoRef}
                                className="w-full h-full object-cover cursor-pointer"
                                src={video.src}
                                onTimeUpdate={handleTimeUpdate}
                                onLoadedMetadata={handleLoadedMetadata}
                                onClick={(e) => togglePlay(e)}
                                loop
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Big Play Button (when paused) */}
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                            <div
                                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center pointer-events-auto cursor-pointer transition-transform transform hover:scale-105 shadow-xl border border-white/20"
                                onClick={togglePlay}
                            >
                                <Play className="w-8 h-8 text-white fill-white ml-1.5" />
                            </div>
                        </div>
                    )}



                    {/* Bottom Controls */}
                    <div
                        className="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end bg-gradient-to-t from-black/90 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 w-full px-2">
                            <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors focus:outline-none">
                                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                            </button>

                            <div className="flex-1 h-1.5 bg-white/20 rounded-full relative cursor-pointer group/bar overflow-hidden" onClick={handleSeek}>
                                <div className="absolute left-0 h-1.5 bg-blue-500 rounded-full transition-all duration-75" style={{ width: `${progress}%` }}>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-0 group-hover/bar:opacity-100 transition-opacity translate-x-1/2 pointer-events-none"></div>
                                </div>
                            </div>

                            <div className="text-white/80 text-[10px] font-medium font-mono min-w-[65px] text-center shrink-0 tracking-wider">
                                {currentTime}/{duration}
                            </div>

                            <div className="flex items-center gap-4 ml-4 shrink-0">
                                <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors focus:outline-none">
                                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                </button>
                                <div className="relative flex items-center">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); setSettingsView('main'); }}
                                        className={`text-white hover:text-blue-400 transition-colors focus:outline-none ${showSettings ? 'text-blue-400' : ''}`}
                                    >
                                        <Settings className="w-4 h-4" />
                                    </button>

                                    <AnimatePresence>
                                        {showSettings && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute bottom-full right-0 mb-4 bg-black/95 backdrop-blur-xl rounded-xl border border-white/10 w-[260px] overflow-hidden z-[110] text-white shadow-2xl origin-bottom-right"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {settingsView === 'main' && (
                                                    <div className="py-2">
                                                        <button className="w-full px-5 py-3 hover:bg-white/10 flex items-center justify-between text-[13px] font-medium transition-colors"
                                                            onClick={() => setSettingsView('quality')}
                                                        >
                                                            <span className="flex items-center gap-3">Quality</span>
                                                            <span className="flex items-center text-white/50 text-[12px]">
                                                                {quality} <ChevronRight className="w-4 h-4 ml-1 text-white/60" />
                                                            </span>
                                                        </button>
                                                        <button className="w-full px-5 py-3 hover:bg-white/10 flex items-center justify-between text-[13px] font-medium transition-colors"
                                                            onClick={() => setSettingsView('speed')}
                                                        >
                                                            <span className="flex items-center gap-3">Playback speed</span>
                                                            <span className="flex items-center text-white/50 text-[12px]">
                                                                {playbackRate === 1 ? 'Normal' : `${playbackRate}x`} <ChevronRight className="w-4 h-4 ml-1 text-white/60" />
                                                            </span>
                                                        </button>
                                                    </div>
                                                )}
                                                {settingsView === 'speed' && (
                                                    <div className="py-2 flex flex-col max-h-[300px] overflow-y-auto custom-scrollbar">
                                                        <div className="px-3 pb-2 mb-2 border-b border-white/10 sticky top-0 bg-black/95 z-10 backdrop-blur-md">
                                                            <button className="flex items-center gap-2 text-[13px] hover:text-white/70 transition-colors py-1 px-2 font-medium" onClick={() => setSettingsView('main')}>
                                                                <ChevronLeft className="w-4 h-4 -ml-1" /> Playback speed
                                                            </button>
                                                        </div>
                                                        {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(rate => (
                                                            <button key={rate} className="w-full px-5 py-2.5 hover:bg-white/10 flex items-center gap-2 text-[13px] transition-colors"
                                                                onClick={() => {
                                                                    setPlaybackRate(rate);
                                                                    if (videoRef.current) videoRef.current.playbackRate = rate;
                                                                    setShowSettings(false);
                                                                }}
                                                            >
                                                                <span className="w-5 flex justify-center">{playbackRate === rate && <Check className="w-4 h-4 text-blue-500" />}</span>
                                                                <span className="font-medium">{rate === 1 ? 'Normal' : rate}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                                {settingsView === 'quality' && (
                                                    <div className="py-2 flex flex-col max-h-[300px] overflow-y-auto custom-scrollbar">
                                                        <div className="px-3 pb-2 mb-2 border-b border-white/10 sticky top-0 bg-black/95 z-10 backdrop-blur-md">
                                                            <button className="flex items-center gap-2 text-[13px] hover:text-white/70 transition-colors py-1 px-2 font-medium" onClick={() => setSettingsView('main')}>
                                                                <ChevronLeft className="w-4 h-4 -ml-1" /> Quality
                                                            </button>
                                                        </div>
                                                        {['Auto', '1080p', '720p', '480p', '360p', '144p'].map(q => (
                                                            <button key={q} className="w-full px-5 py-2.5 hover:bg-white/10 flex items-center gap-2 text-[13px] transition-colors"
                                                                onClick={() => {
                                                                    setQuality(q);
                                                                    setShowSettings(false);
                                                                }}
                                                            >
                                                                <span className="w-5 flex justify-center">{quality === q && <Check className="w-4 h-4 text-blue-500" />}</span>
                                                                <span className="font-medium">{q} {q === '1080p' && <span className="ml-1.5 text-[9px] bg-red-600 px-1 rounded font-bold uppercase tracking-wider py-[1px]">HD</span>}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition-colors focus:outline-none">
                                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Progress Indicators for Reels */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
                        {videos.map((_, i) => (
                            <div key={i} className={`w-1.5 rounded-full transition-all duration-500 shadow-sm ${i === currentIndex ? 'h-8 bg-white/90' : 'h-1.5 bg-white/30'}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Details Section (Name & Description) OUTSIDE WRAPPER */}
            <div className="w-full max-w-5xl px-8 flex flex-col z-20 mt-10">
                <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-5 relative border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
                        className="absolute -top-4 right-6 bg-white/20 hover:bg-white/30 backdrop-blur-md p-1.5 rounded-full text-white transition-colors shadow-lg border border-white/20 z-10"
                    >
                        {showDetails ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>

                    <AnimatePresence>
                        {showDetails ? (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <h3 className="text-[18px] font-bold text-white tracking-wide mb-2 leading-tight flex items-center gap-2">
                                    {video.title}
                                    <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-md uppercase tracking-wide">Playing</span>
                                </h3>
                                <p className="text-[14px] text-white/70 leading-relaxed max-w-4xl">
                                    Scroll up or down anywhere on the screen (like reels) or click the side cards to play previous/next videos in your stack.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="pt-1"
                            >
                                <h3 className="text-[16px] font-bold text-white tracking-wide truncate">{video.title}</h3>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

        </motion.div>
    );
};

const VideosTab = () => {
    const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);

    return (
        <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">My Videos</h1>
                    <p className="text-[14px] text-gray-500 dark:text-zinc-400 mt-1">Manage and preview your recorded videos securely.</p>
                </div>

                <div className="relative w-full md:w-[360px] group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-[18px] w-[18px] text-gray-400 dark:text-zinc-500 group-focus-within:text-[#2b3a8c] dark:group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search videos..."
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl text-[14px] text-gray-800 dark:text-zinc-200 outline-none focus:bg-white dark:focus:bg-zinc-800 focus:border-[#2b3a8c] dark:focus:border-blue-500 focus:ring-4 focus:ring-[#2b3a8c]/10 dark:focus:ring-blue-500/10 transition-all shadow-sm placeholder:text-gray-400 dark:placeholder:text-zinc-500 font-medium"
                    />
                </div>
            </div>


            {/* Cards Container */}
            <div className="grid grid-cols-1 gap-4">
                {mockVideos.map((video, idx) => (
                    <div
                        key={idx}
                        className="group bg-white dark:bg-zinc-900 border border-gray-100/80 dark:border-zinc-800 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-xl hover:shadow-[#2b3a8c]/5 dark:hover:shadow-blue-900/10 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                    >
                        {/* Subtle decorative gradient background on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2b3a8c]/[0.02] dark:from-blue-400/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="flex items-start gap-5 w-full md:w-auto z-10">
                            {/* Icon Wrapper */}
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 dark:from-blue-900/20 to-[#2b3a8c]/10 dark:to-blue-800/10 flex items-center justify-center flex-shrink-0 shadow-inner dark:shadow-none">
                                <Video className="w-6 h-6 text-[#2b3a8c] dark:text-blue-400" strokeWidth={2} />
                            </div>

                            {/* Main Info */}
                            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-[16px] font-bold text-gray-900 dark:text-white truncate">{video.title}</h3>
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-800/30 hidden md:inline-block">Active</span>
                                </div>
                                <div className="flex items-center gap-2 text-[13px] font-medium text-gray-500 dark:text-zinc-400">
                                    <span className="text-gray-700 dark:text-zinc-300 bg-gray-100/50 dark:bg-zinc-800/50 block truncate max-w-[150px] px-2 py-0.5 rounded-md">
                                        MP4 File
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><HardDrive className="w-3.5 h-3.5" /> {video.size}</span>
                                </div>
                            </div>
                        </div>

                        {/* Metadata & Actions */}
                        <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto border-t md:border-t-0 border-gray-100 dark:border-zinc-800 pt-4 md:pt-0 z-10">
                            {/* Stats */}
                            <div className="flex items-center gap-6 text-[13px] font-medium w-full md:w-auto justify-between md:justify-end">
                                <div className="flex flex-col gap-1 items-start md:items-end">
                                    <span className="text-gray-400 dark:text-zinc-500 text-[11px] uppercase tracking-wider font-bold">Duration</span>
                                    <div className="flex items-center gap-1.5 text-gray-900 dark:text-white font-bold bg-gray-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                                        <Clock className="w-3.5 h-3.5 text-[#2b3a8c] dark:text-blue-400" />
                                        <span>{video.duration}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 items-start md:items-end">
                                    <span className="text-gray-400 dark:text-zinc-500 text-[11px] uppercase tracking-wider font-bold">Generated</span>
                                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-zinc-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{video.date}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block w-px h-10 bg-gray-100 dark:bg-zinc-800"></div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-2 w-full md:w-auto">
                                <button onClick={() => setSelectedVideoIndex(idx)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-[13px] font-semibold rounded-xl transition-all shadow-sm">
                                    <Play className="w-4 h-4 fill-current" />
                                    Preview
                                </button>
                                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-700 text-[13px] font-semibold rounded-xl transition-all shadow-sm">
                                    <Settings className="w-4 h-4" />
                                    Manage
                                </button>
                                <button className="p-2.5 text-gray-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors tooltip-trigger" title="Delete Video">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Premium Pagination */}
            <div className="flex items-center justify-between mt-4">
                <span className="text-[13px] font-medium text-gray-500 dark:text-zinc-400">Showing <strong className="text-gray-900 dark:text-white">1-3</strong> of <strong className="text-gray-900 dark:text-white">3</strong> videos</span>
                <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                    <button className="px-4 py-2 text-[13px] font-semibold text-gray-400 dark:text-zinc-500 rounded-xl cursor-not-allowed">Prev</button>
                    <button className="w-9 h-9 flex items-center justify-center text-[13px] font-bold text-white bg-[#2b3a8c] dark:bg-blue-600 rounded-xl shadow-md shadow-[#2b3a8c]/20 dark:shadow-blue-900/20">1</button>
                    <button className="px-4 py-2 text-[13px] font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 text-[#2b3a8c] dark:text-blue-400 rounded-xl transition-all">Next</button>
                </div>
            </div>

            {/* Video Player Overlay */}
            {createPortal(
                <AnimatePresence>
                    {selectedVideoIndex !== null && (
                        <VideoPlayer videos={mockVideos} initialIndex={selectedVideoIndex} onClose={() => setSelectedVideoIndex(null)} />
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default VideosTab;

