import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from './context/AuthContext';
import PathCanvas from './components/PathCanvas';
import RoadmapRenderer from "./components/RoadmapRenderer";
import { 
    getUserRoadmaps, 
    saveRoadmapToFirestore, 
    deleteRoadmap, 
    updateRoadmapProgress,
    saveChatMessage,
    getChatHistory
} from './services/roadmapService';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
console.log("DEBUG: Current API URL is:", API_BASE_URL);
import {
    BrainCircuit,
    Map,
    MessageSquare,
    User,
    Compass,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Sparkles,
    ArrowRight,
    Send,
    Bot,
    Activity,
    Target,
    LineChart,
    Briefcase,
    Layers,
    Mail,
    Lock,
    Telescope,
    TrendingUp,
    DollarSign,
    BookOpen,
    Cloud,
    Loader2,
    GitCompare,
    Scale,
    Zap,
    ThumbsUp,
    AlertTriangle,
    ShieldAlert,
    ShieldCheck,
    Menu,
    X,
    Star,
    FileText,
    PieChart,
    Award,
    BarChart,
    Settings as SettingsIcon,
    LogOut,
    ChevronDown,
    Bookmark,
    Calendar,
    Search,
    Cpu,
    Clock,
    Wrench,
    ArrowLeft,
    Check,
    ArrowDown,
    Trash2,
    ExternalLink,
    Code2,
    Globe,
    Moon,
    Sun,
    Bell,
    Terminal,
    Save,
    Lightbulb,
    Info
} from 'lucide-react';


// --- MAIN APP COMPONENT ---
export default function App() {
    const { isAuthenticated, user, profile, loading, logout } = useAuth();
    const [roadmap, setRoadmap] = useState(null);
    const [currentView, setCurrentView] = useState('landing');
    const [theme, setTheme] = useState('aurora');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Load sidebar state from local storage or default to true
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('decisionIqSidebar');
            return saved !== null ? JSON.parse(saved) : true;
        }
        return true;
    });

    // Save sidebar state to local storage when it changes
    useEffect(() => {
        localStorage.setItem('decisionIqSidebar', JSON.stringify(isSidebarOpen));
    }, [isSidebarOpen]);

    // NEW: Global state to track the user's active career goal path
    const [selectedRoadmap, setSelectedRoadmap] = useState(null);
    const [activeGoalId, setActiveGoalId] = useState('ai');


    // Navigation Handler
    const navigate = (view) => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
        setIsSidebarOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Redirect automatically when Firebase auth state changes
    useEffect(() => {
        if (loading) return;
        if (isAuthenticated && (currentView === 'landing' || currentView === 'login')) {
            setCurrentView('dashboard');
        } else if (!isAuthenticated && currentView !== 'landing' && currentView !== 'login') {
            setCurrentView('landing');
        }
    }, [isAuthenticated, loading]);

    const handleLogout = async () => { await logout(); };

    // Full-screen loader while Firebase resolves the initial session
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Initialising...</span>
            </div>
        </div>
    );

    return (
        <div data-theme={theme}
            className="relative min-h-screen bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 selection:bg-[rgba(var(--c-primary-rgb),0.2)] overflow-x-hidden transition-colors duration-500">

            {/* --- FIXED GLOBAL BACKGROUND --- */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-white dark:bg-slate-950">
                <div
                    className="absolute top-[-10%] right-[5%] w-[70%] h-[90%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-300/60 dark:from-cyan-900/30 via-blue-500/40 dark:via-blue-900/20 to-transparent rounded-full blur-[80px] animate-float" />
                <div
                    className="absolute top-[-5%] right-[-15%] w-[45%] h-[80%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-400/50 dark:from-fuchsia-900/30 via-pink-400/30 dark:via-pink-900/20 to-transparent rounded-full blur-[100px] animate-float-reverse" />
                <div
                    className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[60%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-100/40 dark:from-slate-900/40 via-blue-50/20 dark:via-slate-800/20 to-transparent rounded-full blur-[80px] animate-float" />
            </div>

            {/* GLOBAL STYLES & ANIMATIONS */}
            <style dangerouslySetInnerHTML={{
                __html: ` @import
        url('https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@300;400;500;600;700;800;900&family=RocknRoll+One&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        body { font-family: 'Noto Sans Mono' , monospace; } .font-rocknroll { font-family: 'RocknRoll One' , sans-serif;
        letter-spacing: 0.02em; } .font-cyber-body { font-family: 'Space Mono' , monospace; } /* --- THEMES --- */
        :root, [data-theme="aurora" ] { --c-primary: #2563eb; --c-primary-light: #60a5fa; --c-primary-dark: #1d4ed8;
        --c-primary-rgb: 37, 99, 235; --c-secondary: #db2777; --c-secondary-dark: #be185d; --c-secondary-rgb: 219, 39,
        119; --c-accent: #06b6d4; } [data-theme="dark" ] { --c-primary: #3b82f6; --c-primary-light: #60a5fa;
        --c-primary-dark: #2563eb; --c-primary-rgb: 59, 130, 246; --c-secondary: #f43f5e; --c-secondary-dark: #e11d48;
        --c-secondary-rgb: 244, 63, 94; --c-accent: #2dd4bf; background-color: #020617; color: #f1f5f9; }
        [data-theme="sunset" ] { --c-primary: #ea580c; --c-primary-light: #fb923c; --c-primary-dark: #c2410c;
        --c-primary-rgb: 234, 88, 12; --c-secondary: #e11d48; --c-secondary-dark: #be123c; --c-secondary-rgb: 225, 29,
        72; --c-accent: #f59e0b; } @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity:
        1; transform: translateY(0); } } @keyframes popIn { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1;
        transform: scale(1); } } @keyframes float { 0%, 100% { transform: translate(0px, 0px); } 50% { transform:
        translate(10px, -20px); } } @keyframes swing { 0%, 100% { transform: rotate(1.5deg); } 50% { transform:
        rotate(-1.5deg); } } @keyframes scanner { 0% { transform: translateY(-100%); } 100% { transform:
        translateY(200%); } } .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0; } .animate-pop-in { animation: popIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate-float { animation: float 14s ease-in-out infinite; } .animate-swing { animation: swing 5s ease-in-out
        infinite; transform-origin: top center; }        .glass-panel { background: rgba(255, 255, 255, 0.7); backdrop-filter:
        blur(12px); border: 1px solid rgba(255, 255, 255, 0.8); box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05); }
        [data-theme="dark" ] .glass-panel { background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255,
        0.05); box-shadow: 0 10px 40px -10px rgba(0,0,0,0.3); } `}} />

            <Navbar currentView={currentView} navigate={navigate} isAuthenticated={isAuthenticated} onLogout={handleLogout}
                theme={theme} setTheme={setTheme} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen}
                isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

            {isAuthenticated &&
                <Sidebar currentView={currentView} navigate={navigate} isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />}

            <main className={`relative z-10 pt-24 pb-12 transition-all duration-300 ease-in-out w-full ${isAuthenticated ?
                (isSidebarOpen ? 'md:ml-64 md:w-[calc(100%-16rem)]' : 'md:ml-20 md:w-[calc(100%-5rem)]') : 'ml-0'} px-4 sm:px-6 md:px-8`}>
                {currentView === 'landing' &&
                    <LandingPage navigate={navigate} />}
                {currentView === 'dashboard' &&
                    <Dashboard navigate={navigate} setActiveGoalId={setActiveGoalId} setSelectedRoadmap={setSelectedRoadmap} />}
                {currentView === 'goal-overview' &&
                    <GoalOverview navigate={navigate} setActiveGoalId={setActiveGoalId} />}
                {currentView === 'career-roadmap' &&
                    <Roadmap
                        activeGoalId={activeGoalId}
                        setActiveGoalId={setActiveGoalId}
                        selectedRoadmap={selectedRoadmap}
                    />
                }
                {currentView === 'saved-paths' &&
                    <SavedPaths
                        navigate={navigate}
                        setActiveGoalId={setActiveGoalId}
                        setSelectedRoadmap={setSelectedRoadmap}
                    />}
                {currentView === 'profile' &&
                    <ProfileView navigate={navigate} />}
                {currentView === 'settings' &&
                    <SettingsView theme={theme} setTheme={setTheme} />}
                {currentView === 'assistant' &&
                    <AIAssistant />}
                {currentView === 'login' &&
                    <AuthPage />}
                {currentView === 'analyzer' &&
                    <DecisionAnalyzer
                        navigate={navigate}
                        setActiveGoalId={setActiveGoalId}
                        roadmap={roadmap}
                        setRoadmap={setRoadmap}
                    />}
                {currentView === 'risk' &&
                    <RiskAnalyzer navigate={navigate} />}
                {currentView === 'recommendations' &&
                    <Recommendations navigate={navigate} activeGoalId={activeGoalId} />}
                {currentView === 'report' &&
                    <ReportAnalysis navigate={navigate} activeGoalId={activeGoalId} />}
            </main>

            {/* Floating AI Chatbot - Visible ONLY after login */}
            {isAuthenticated &&
                <FloatingChatbot />}
        </div>
    );
}

// --- NAVLINK COMPONENT ---
function NavLink({ active, onClick, text, className }) {
    return (
        <button onClick={onClick} className={`relative px-4 py-2 transition-colors duration-200 font-bold uppercase
    tracking-widest text-[10px] ${active ? 'text-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-[var(--c-primary)]'} ${className || ''}`}>
            {text}
            {active && (
                <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[var(--c-primary)] rounded-full animate-pop-in" />
            )}
        </button>
    );
}

// --- NAVIGATION COMPONENT ---
function Navbar({ currentView, navigate, isAuthenticated, onLogout, theme, setTheme, isMobileMenuOpen,
    setIsMobileMenuOpen, isSidebarOpen, setIsSidebarOpen }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <nav
            className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-300 dark:border-slate-800 shadow-sm transition-all duration-300 font-cyber-body">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center">
                            {isAuthenticated && (
                                <button onClick={() => {
                                    if (window.innerWidth < 768) { setIsMobileMenuOpen(!isMobileMenuOpen); } else {
                                        setIsSidebarOpen(!isSidebarOpen);
                                    }
                                }}
                                    className="mr-3 p-2 -ml-2 rounded-sm text-slate-500 hover:text-[var(--c-primary)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                                    aria-label="Toggle Menu">
                                    <Menu size={24} />
                                </button>
                            )}
                            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() =>
                                navigate(isAuthenticated ? 'dashboard' : 'landing')}>
                                <div
                                    className="bg-slate-900 dark:bg-blue-600 p-2 rounded-sm shadow-[4px_4px_0px_rgba(15,23,42,0.1)] transition-all">
                                    <Layers className="w-5 h-5 text-white" />
                                </div>
                                <span
                                    className="text-xl font-rocknroll tracking-tight text-slate-900 dark:text-white uppercase hidden sm:block">
                                    Decision<span className="text-[var(--c-primary)]">IQ AI</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {!isAuthenticated ? (
                            <div className="flex items-center space-x-3">
                                <button onClick={() => navigate('login')} className="hidden md:block text-slate-600
                        dark:text-slate-400 hover:text-[var(--c-primary)] font-bold uppercase text-[11px]
                        tracking-widest">Sign In</button>
                                <button onClick={() => navigate('login')} className="bg-slate-900 dark:bg-blue-600 text-white px-5
                        py-2 rounded-sm font-bold text-[11px] uppercase tracking-widest">Register</button>
                            </div>
                        ) : (
                            <div className="relative">
                                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2
                        bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-sm
                        transition-all">
                                    <User size={16} className="text-[var(--c-primary)]" />
                                    <span
                                        className="text-[10px] font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">Profile</span>
                                    <ChevronDown size={14} className="text-slate-500" />
                                </button>
                                {isProfileOpen && (
                                    <div
                                        className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-sm shadow-xl z-50 py-2 animate-pop-in">
                                        <button onClick={() => { navigate('profile'); setIsProfileOpen(false); }} className="flex
                            items-center px-4 py-2.5 text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400
                            hover:bg-slate-100 dark:hover:bg-slate-800 w-full text-left">
                                            <User size={14} className="mr-3" /> Profile
                                        </button>
                                        <button onClick={() => { navigate('settings'); setIsProfileOpen(false); }} className="flex
                            items-center px-4 py-2.5 text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400
                            hover:bg-slate-100 dark:hover:bg-slate-800 w-full text-left">
                                            <SettingsIcon size={14} className="mr-3" /> Settings
                                        </button>
                                        <div className="h-px bg-slate-200 dark:bg-slate-800 my-1"></div>
                                        <button onClick={() => { onLogout(); setIsProfileOpen(false); }} className="flex items-center
                            px-4 py-2.5 text-[10px] font-bold uppercase text-red-500 hover:bg-red-50
                            dark:hover:bg-red-900/20 w-full text-left">
                                            <LogOut size={14} className="mr-3" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

// --- SIDEBAR COMPONENT ---
const Sidebar = React.memo(({ currentView, navigate, isMobileMenuOpen, setIsMobileMenuOpen, isSidebarOpen, setIsSidebarOpen }) => {
    return (
        <>
            {/* Mobile Overlay Backdrop */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside className={`fixed top-20 left-0 h-[calc(100vh-5rem)] glass-panel border-r border-slate-200/60
            dark:border-slate-800/60 z-40 transform transition-all duration-300 ease-in-out flex flex-col
            ${isMobileMenuOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full w-64'} md:translate-x-0
            ${isSidebarOpen ? 'md:w-64' : 'md:w-20'}`}>

                {/* Desktop Mini Toggle Button */}
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="hidden md:flex absolute -right-[12px] top-6 w-6 h-6 bg-white dark:bg-slate-800 border
                border-slate-200 dark:border-slate-700 rounded-full items-center justify-center text-slate-500
                hover:text-[var(--c-primary)] shadow-sm transition-transform hover:scale-110 z-50 focus:outline-none"
                    aria-label={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                    {isSidebarOpen ?
                        <ChevronLeft size={14} /> :
                        <ChevronRight size={14} />}
                </button>

                <div
                    className="flex flex-col py-6 space-y-2 h-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700">
                    <SidebarSection title="Navigation" isSidebarOpen={isSidebarOpen} />
                    <SidebarLink active={currentView === 'dashboard'} onClick={() => navigate('dashboard')} icon={
                        <Activity size={18} />} text="Dashboard" isSidebarOpen={isSidebarOpen} />
                    <SidebarLink active={currentView === 'goal-overview'} onClick={() => navigate('goal-overview')} icon={
                        <Target size={18} />} text="Goal Overview" isSidebarOpen={isSidebarOpen} />
                    <SidebarLink active={currentView === 'career-roadmap'} onClick={() => navigate('career-roadmap')}
                        icon={<Map size={18} />} text="Career Roadmap" isSidebarOpen={isSidebarOpen} />
                    <SidebarLink active={currentView === 'saved-paths'} onClick={() => navigate('saved-paths')}
                        icon={
                            <Bookmark size={18} />} text="Saved Paths" isSidebarOpen={isSidebarOpen} />

                    <div className="h-px bg-slate-200/60 dark:bg-slate-800/60 my-2 mx-4"></div>

                    <SidebarSection title="Advanced Tools" isSidebarOpen={isSidebarOpen} />
                    <SidebarLink active={currentView === 'analyzer'} onClick={() => navigate('analyzer')}
                        icon={<GitCompare size={18} />} text="Path Builder" isSidebarOpen={isSidebarOpen} />
                    <SidebarLink active={currentView === 'risk'} onClick={() => navigate('risk')}
                        icon={<ShieldAlert size={18} />} text="Risk Simulator" isSidebarOpen={isSidebarOpen} />
                    <SidebarLink active={currentView === 'recommendations'} onClick={() => navigate('recommendations')}
                        icon={<Sparkles size={18} />} text="Recommendations" isSidebarOpen={isSidebarOpen} />
                    <SidebarLink active={currentView === 'report'} onClick={() => navigate('report')}
                        icon={<FileText size={18} />} text="Career Health" isSidebarOpen={isSidebarOpen} />
                    <SidebarLink active={currentView === 'assistant'} onClick={() => navigate('assistant')}
                        icon={<Bot size={18} />} text="AI Guide" isSidebarOpen={isSidebarOpen} />

                    <div className="h-px bg-slate-200/60 dark:bg-slate-800/60 my-2 mx-4"></div>

                    <SidebarSection title="Account" isSidebarOpen={isSidebarOpen} />
                    <SidebarLink active={currentView === 'profile'} onClick={() => navigate('profile')}
                        icon={
                            <User size={18} />} text="Profile" isSidebarOpen={isSidebarOpen} />
                    <SidebarLink active={currentView === 'settings'} onClick={() =>
                        navigate('settings')} icon={
                            <SettingsIcon size={18} />} text="Settings" isSidebarOpen={isSidebarOpen} />
                </div>
            </aside>
        </>
    );
});

function SidebarSection({ title, isSidebarOpen }) {
    return (
        <h3 className={`text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4 pt-2 transition-all
    duration-300 whitespace-nowrap overflow-hidden ${isSidebarOpen ? 'opacity-100 w-auto' : 'md:opacity-0 md:w-0'}`}>
            {title}
        </h3>
    );
}

function SidebarLink({ active, onClick, icon, text, isSidebarOpen }) {
    return (
        <button onClick={onClick} title={!isSidebarOpen ? text : undefined} className={`flex items-center mx-3 px-3 py-3
    rounded-sm transition-all duration-300 relative group ${active
                ? 'bg-gradient-to-r from-[var(--c-primary)] to-[var(--c-secondary)] text-white shadow-md transform translate-x-[2px]'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'}
    ${isSidebarOpen ? 'justify-start' : 'md:justify-center'}`}>
            <div className="flex-shrink-0 relative z-10">{icon}</div>
            <span className={`font-bold uppercase tracking-widest text-[11px] whitespace-nowrap overflow-hidden transition-all
        duration-300 ${isSidebarOpen ? 'w-full ml-3 opacity-100' : 'md:w-0 md:ml-0 md:opacity-0 ml-3 opacity-100'}`}>
                {text}
            </span>

            {/* Tooltip for collapsed state (desktop only) */}
            {!isSidebarOpen && (
                <div
                    className="absolute left-14 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 hidden md:block shadow-lg">
                    {text}
                </div>
            )}
        </button>
    );
}

// --- LANDING PAGE ---
function LandingPage({ navigate }) {
    return (
        <div className="min-h-[calc(100vh-6rem)] flex flex-col justify-center text-center font-cyber-body pt-8 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div
                    className="flex flex-col items-center justify-center relative z-20 border-y border-slate-300 dark:border-slate-800 py-16 md:py-24">
                    <div className="flex items-center space-x-3 mb-6 animate-fade-in-up">
                        <div className="w-2 h-2 bg-[var(--c-primary)]" />
                        <h2 className="text-xs md:text-sm font-black tracking-[0.2em] text-[var(--c-primary)] uppercase">Your
                            Intelligent Career Navigation System</h2>
                        <div className="w-2 h-2 bg-[var(--c-primary)]" />
                    </div>
                    <h1
                        className="text-5xl sm:text-6xl md:text-[6.5rem] lg:text-[8rem] font-rocknroll mb-8 leading-[0.85] text-slate-900 dark:text-white uppercase animate-fade-in-up delay-100 flex flex-col items-center tracking-wide">
                        <span>DECISION</span>
                        <span>IQ AI</span>
                    </h1>
                    <p
                        className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-10 max-w-2xl font-bold animate-fade-in-up delay-200">
                        An AI-powered platform that guides B.Tech students towards suitable career paths using intelligent
                        recommendations, roadmaps, and an AI assistant.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                        <button onClick={() => navigate('login')} className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800
                    text-white px-10 py-4 rounded-sm font-bold text-[11px] uppercase tracking-widest
                    shadow-[4px_4px_0px_rgba(234,88,12,1)]">Get Started</button>
                        <button onClick={() => navigate('goal-overview')} className="bg-white dark:bg-slate-800 border
                    border-slate-300 dark:border-slate-700 hover:bg-slate-50 text-slate-900 dark:text-white px-10 py-4
                    rounded-sm font-bold text-[11px] uppercase tracking-widest">Learn More</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- DASHBOARD COMPONENT ---
const Dashboard = React.memo(({ navigate, setActiveGoalId, setSelectedRoadmap }) => {
    const { user, profile } = useAuth();
    const [paths, setPaths] = useState([]);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        async function fetchPaths() {
            if (user) {
                try {
                    const savedPaths = await getUserRoadmaps(user.uid);
                    setPaths(savedPaths);
                } catch (error) {
                    console.error("Failed to fetch roadmaps:", error);
                } finally {
                    setIsFetching(false);
                }
            }
        }
        fetchPaths();
    }, [user]);

    const removePath = async (id, e) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this roadmap?")) {
            try {
                await deleteRoadmap(id);
                setPaths(paths.filter(p => p.id !== id));
            } catch (error) {
                alert("Failed to delete roadmap.");
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
                <div className="animate-fade-in-up">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Welcome
                        Back, {profile?.displayName || user?.displayName || 'Student'} 👋</h1>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">Here are your active career trajectories.</p>
                </div>
                <button onClick={() => navigate('goal-overview')} className="bg-slate-900 dark:bg-blue-600 text-white px-6 py-3
            rounded-sm font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-md
            hover:-translate-y-1">
                    <Target size={18} /><span>Set New Goal</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-100">
                {isFetching ? (
                    <div className="col-span-full flex justify-center py-12">
                         <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : paths.map((path) => (
                    <div key={path.id} onClick={() => { setSelectedRoadmap(path); setActiveGoalId(path.id); navigate('career-roadmap'); }}
                        className="glass-panel p-6 rounded-sm border border-slate-300 dark:border-slate-800
            hover:border-[var(--c-primary)] shadow-md transition-all cursor-pointer group flex flex-col">
                        <div className="flex items-start justify-between mb-6">
                            <div className={`p-4 rounded-sm border bg-blue-50 text-blue-600 border-blue-200`}><Bot size={24} /></div>
                            <button onClick={(e) => removePath(path.id, e)} className="p-2 text-slate-400 hover:text-red-500
                    transition-all">
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">{path.title || path.role}</h3>
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-8">
                            {path.createdAt?.seconds ? new Date(path.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                        </p>
                        <div
                            className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center text-[10px] font-black uppercase text-[var(--c-primary)]">
                            Open Roadmap
                            <ArrowRight size={12} className="ml-2" />
                        </div>
                    </div>
                ))}

                {/* Set New Goal Card */}
                <div onClick={() => navigate('goal-overview')} className="glass-panel p-6 rounded-sm border-2 border-dashed
            border-slate-300 dark:border-slate-700 hover:border-[var(--c-primary)] dark:hover:border-[var(--c-primary)]
            transition-all cursor-pointer group flex flex-col items-center justify-center text-center min-h-[240px]">
                    <div
                        className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-[var(--c-primary)] group-hover:bg-[rgba(var(--c-primary-rgb),0.1)] transition-all mb-4">
                        <Target size={32} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Explore New Paths</h3>
                    <p className="text-[10px] font-black uppercase text-slate-500 px-4">Set a new goal manually or get AI
                        recommendations</p>
                </div>
            </div>
        </div>
    );
});

function InsightRow({ label, value, strength, color }) {
    return (
        <div>
            <div className="flex justify-between text-[10px] mb-2 font-bold uppercase tracking-wider"><span
                className="text-slate-500">{label}</span><span className="text-slate-900 dark:text-white">{value}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className={`${color} h-full`} style={{ width: `${strength}%` }} />
            </div>
        </div>
    );
}

function MilestoneItem({ title, status }) {
    return (
        <div
            className="flex items-start space-x-3 p-3 rounded-sm hover:bg-white/60 dark:hover:bg-slate-800/60 border border-transparent transition-colors group">
            {status === 'completed' ?
                <CheckCircle2 className="text-emerald-500 mt-0.5" size={18} /> :
                status === 'in-progress' ?
                    <div className="w-4 h-4 rounded-sm border-2 border-[var(--c-primary)] border-t-transparent animate-spin mt-1" /> :
                    <div className="w-4 h-4 rounded-sm border-2 border-slate-300 dark:border-slate-700 mt-1" />}
            <span className={`text-[11px] font-semibold ${status === 'completed' ? 'text-slate-400 line-through'
                : 'text-slate-700 dark:text-slate-300'}`}>{title}</span>
        </div>
    );
}

// --- ROADMAP COMPONENT ---
function Roadmap({ activeGoalId, setActiveGoalId, selectedRoadmap }) {
    console.log("activeGoalId:", activeGoalId);
    console.log("selectedRoadmap:", selectedRoadmap);
    const ROADMAP_TEMPLATES = {
        'ai': [
            {
                id: 'ai1', title: 'B.Tech / Math Foundations', status: 'completed', icon:
                    <Award size={18} />
            },
            {
                id: 'ai2', title: 'Python & Data Structures', status: 'completed', icon:
                    <Cpu size={18} />
            },
            {
                id: 'ai3', title: 'Machine Learning Basics', status: 'in-progress', icon:
                    <BrainCircuit size={18} />
            },
            {
                id: 'ai4', title: 'Deep Learning & Neural Networks', status: 'pending', icon:
                    <Layers size={18} />
            },
            {
                id: 'ai5', title: 'NLP & Computer Vision', status: 'pending', icon:
                    <Telescope size={18} />
            },
            {
                id: 'ai6', title: 'AI Engineer', status: 'pending', icon:
                    <Target size={18} />
            }
        ],
        'ds': [
            {
                id: 'ds1', title: 'Statistics & Probability', status: 'completed', icon:
                    <Award size={18} />
            },
            {
                id: 'ds2', title: 'Python & SQL', status: 'completed', icon:
                    <FileText size={18} />
            },
            {
                id: 'ds3', title: 'Data Cleaning & EDA', status: 'in-progress', icon:
                    <LineChart size={18} />
            },
            {
                id: 'ds4', title: 'Machine Learning Models', status: 'pending', icon:
                    <BrainCircuit size={18} />
            },
            {
                id: 'ds5', title: 'Big Data & Deployment', status: 'pending', icon:
                    <Cloud size={18} />
            },
            {
                id: 'ds6', title: 'Data Scientist', status: 'pending', icon:
                    <Target size={18} />
            }
        ],
        'cyb': [
            {
                id: 'cyb1', title: 'Networking Fundamentals', status: 'completed', icon:
                    <Globe size={18} />
            },
            {
                id: 'cyb2', title: 'Linux & OS Security', status: 'completed', icon:
                    <Terminal size={18} />
            },
            {
                id: 'cyb3', title: 'Ethical Hacking', status: 'in-progress', icon:
                    <ShieldAlert size={18} />
            },
            {
                id: 'cyb4', title: 'Cryptography', status: 'pending', icon:
                    <Lock size={18} />
            },
            {
                id: 'cyb5', title: 'Security Auditing', status: 'pending', icon:
                    <FileText size={18} />
            },
            {
                id: 'cyb6', title: 'Cybersecurity Expert', status: 'pending', icon:
                    <Target size={18} />
            }
        ],
        'cld': [
            {
                id: 'cld1', title: 'IT Fundamentals', status: 'completed', icon:
                    <Award size={18} />
            },
            {
                id: 'cld2', title: 'Networking & Linux', status: 'completed', icon:
                    <Terminal size={18} />
            },
            {
                id: 'cld3', title: 'AWS / Azure Basics', status: 'in-progress', icon:
                    <Cloud size={18} />
            },
            {
                id: 'cld4', title: 'Docker & Containers', status: 'pending', icon:
                    <Layers size={18} />
            },
            {
                id: 'cld5', title: 'Kubernetes & CI/CD', status: 'pending', icon:
                    <GitCompare size={18} />
            },
            {
                id: 'cld6', title: 'Cloud Engineer', status: 'pending', icon:
                    <Target size={18} />
            }
        ]
    };

    const TITLE_MAP = {
        'ai': 'AI Engineer',
        'ds': 'Data Scientist',
        'cyb': 'Cybersecurity',
        'cld': 'Cloud Engineer'
    };

    const [nodes, setNodes] = useState([]);

    // Sync roadmap when active goal changes globally
    useEffect(() => {
        // 1. If backend AI roadmap with stages structure exists, use it
        if (selectedRoadmap?.stages?.length > 0) {
            const formattedNodes = [];
            selectedRoadmap.stages.forEach((stage, sIdx) => {
                // Add a stage header node
                formattedNodes.push({
                    id: `stage_${sIdx}`,
                    title: stage.title,
                    status: 'pending',
                    icon: <Layers size={18} />,
                    isStage: true
                });
                // Add topic nodes under each stage
                (stage.topics || []).forEach((topic, tIdx) => {
                    formattedNodes.push({
                        id: `stage_${sIdx}_topic_${tIdx}`,
                        title: topic.name,
                        description: topic.description,
                        status: 'pending',
                        icon: <Target size={18} />
                    });
                });
            });
            setNodes(formattedNodes);
            return;
        }

        // 2. If backend/custom roadmap with nodes structure exists, use it
        if (selectedRoadmap?.nodes?.length > 0) {
            const formattedNodes = selectedRoadmap.nodes.map((node, index) => ({
                id: node.id || index,
                title: node.title || node.label || 'Step',
                description: node.description || '',
                status: node.status || 'pending',
                icon: node.isStage ? <Layers size={18} /> : (node.status === 'completed' ? <CheckCircle2 size={18} /> : <Target size={18} />),
                isStage: !!node.isStage
            }));
            setNodes(formattedNodes);
            return;
        }

        // 3. Otherwise fallback to template roadmap
        const template = ROADMAP_TEMPLATES[activeGoalId] || ROADMAP_TEMPLATES['ai'];
        setNodes(template);

    }, [activeGoalId, selectedRoadmap]);

    // Dynamically calculate completion
    const completionPercentage = Math.round((nodes.filter(n => n.status === 'completed').length / nodes.length) * 100);

    const toggleCompletion = async (id, e) => {
        if (e) e.stopPropagation();
        const updatedNodes = nodes.map(n =>
            n.id === id
                ? { ...n, status: n.status === 'completed' ? 'pending' : 'completed' }
                : n
        );
        setNodes(updatedNodes);

        // If this is a saved roadmap (has an ID that is not a template key)
        if (activeGoalId && !['ai', 'ds', 'cyb', 'cld'].includes(activeGoalId)) {
            try {
                await updateRoadmapProgress(activeGoalId, updatedNodes);
            } catch (error) {
                console.error("Failed to sync progress:", error);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-4 relative z-10 animate-fade-in-up">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">
                    Career Roadmap</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">Detailed trajectory to
                    {TITLE_MAP[activeGoalId] || 'AI Engineer'}.</p>

                {/* ROADMAP SWITCHER TABS */}
                <div className="flex flex-wrap justify-center gap-2 mt-8 animate-fade-in-up">
                    {Object.keys(TITLE_MAP).map(key => (
                        <button key={key} onClick={() => setActiveGoalId(key)}
                            className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
                shadow-sm ${activeGoalId === key
                                    ? `bg-gradient-to-r from-[var(--c-primary)] to-[var(--c-secondary)] text-white border-transparent
                shadow-md`
                                    : `bg-white dark:bg-slate-800 text-slate-500 hover:text-[var(--c-primary)] border border-slate-200
                dark:border-slate-700 hover:border-[var(--c-primary)]`
                                }`}
                        >
                            {TITLE_MAP[key]}
                        </button>
                    ))}
                </div>

                <div
                    className="glass-panel p-6 rounded-sm max-w-2xl mx-auto shadow-md border-t-4 border-t-[var(--c-primary)] mt-8">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3"><span
                        className="dark:text-slate-400">Roadmap Completion</span><span
                            className="text-[var(--c-primary)]">{completionPercentage}%</span></div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-sm h-3 overflow-hidden shadow-inner">
                        <div className="bg-gradient-to-r from-[var(--c-primary)] to-[var(--c-secondary)] h-full transition-all duration-1000"
                            style={{ width: `${completionPercentage}%` }} />
                    </div>
                </div>
            </div>

            <div className="pb-12">
                <div className="glass-panel p-6 sm:p-10 rounded-sm shadow-lg border border-slate-300 dark:border-slate-800">
                    <h3
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b dark:border-slate-800 pb-3 mb-8 text-center">
                        Interactive Flow</h3>
                    <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 sm:ml-8 space-y-8">
                        {nodes.map((n, i) => (
                            <div key={n.id} className="relative pl-8 sm:pl-10 transition-all group">
                                <div className={`absolute -left-[11px] top-5 w-5 h-5 rounded-full border-[3px] z-10
                        ${n.status === 'completed' ? 'bg-emerald-500 border-white dark:border-slate-900' :
                                        n.status === 'in-progress'
                                            ? 'bg-[var(--c-primary)] border-white dark:border-slate-900 animate-pulse'
                                            : 'bg-slate-200 dark:bg-slate-800 border-white dark:border-slate-900'}`} />
                                <div className={`p-6 rounded-sm border transition-all ${n.status === 'completed'
                                    ? 'bg-white/80 dark:bg-slate-800/80 border-emerald-500/30'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-md'}`}>

                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-3 rounded-sm ${n.status === 'completed'
                                                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30'
                                                : 'bg-[rgba(var(--c-primary-rgb),0.1)] text-[var(--c-primary)]'}`}>
                                                {n.icon}
                                            </div>
                                            <span className={`text-xl font-black tracking-tight ${n.status === 'pending'
                                                ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'
                                                }`}>{n.title}</span>
                                        </div>
                                        <button onClick={(e) => toggleCompletion(n.id, e)}
                                            className={`w-full sm:w-auto px-5 py-2.5 rounded-sm font-bold text-[10px] uppercase
                                tracking-widest transition-all flex items-center justify-center space-x-2 ${n.status === 'completed'
                                                    ? `bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/20
                                dark:border-emerald-800 hover:bg-emerald-100`
                                                    : `bg-slate-900 dark:bg-blue-600 text-white shadow-sm hover:-translate-y-0.5
                                hover:shadow-md`
                                                }`}
                                        >
                                            {n.status === 'completed' ?
                                                <CheckCircle2 size={16} /> :
                                                <Check size={16} />}
                                            <span>{n.status === 'completed' ? 'Completed' : 'Mark Complete'}</span>
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SAVED PATHS COMPONENT ---
function SavedPaths({ navigate, setActiveGoalId, setSelectedRoadmap }) {
    const [savedPaths, setSavedPaths] = useState([]);
    useEffect(() => {

        const fetchSavedPaths = async () => {

            try {
                const response = await fetch(
                    `${API_BASE_URL}/saved-roadmaps`
                );

                const data = await response.json();

                setSavedPaths(data);

            } catch (error) {
                console.error("Failed to fetch saved paths:", error);
            }
        };

        fetchSavedPaths();

    }, []);
    const [paths, setPaths] = useState([
        {
            id: 'ai', title: 'AI Engineer', date: 'Saved on May 8, 2024', icon:
                <Bot size={24} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200'
        },
        {
            id: 'ds', title: 'Data Scientist', date: 'Saved on May 7, 2024', icon:
                <LineChart size={24} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200'
        },
        {
            id: 'cld', title: 'Cloud Engineer', date: 'Saved on May 5, 2024', icon:
                <Cloud size={24} />, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200'
        }
    ]);

    const removePath = (id, e) => {
        e.stopPropagation();
        setPaths(paths.filter(p => p.id !== id));
    };

    return (
        <div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-12 relative z-10 animate-fade-in-up">

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">
                        Saved Paths
                    </h1>

                    <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                        Manage your stored career trajectories.
                    </p>
                </div>

                {/* Existing Static Template Paths */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {paths.map((path) => (
                        <div
                            key={path.id}
                            onClick={() => {
                                // Clear any AI-generated roadmap so the template is used
                                setSelectedRoadmap(null);
                                setActiveGoalId(path.id);
                                navigate('career-roadmap');
                            }}
                            className="glass-panel p-6 rounded-sm border border-slate-300 dark:border-slate-800
                        hover:border-[var(--c-primary)] shadow-md transition-all cursor-pointer group flex flex-col"
                        >

                            <div className="flex items-start justify-between mb-6">

                                <div className={`p-4 rounded-sm border ${path.border} ${path.bg} ${path.color}`}>
                                    {path.icon}
                                </div>

                                <button
                                    onClick={(e) => removePath(path.id, e)}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>

                            </div>

                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                                {path.title}
                            </h3>

                            <p className="text-[10px] font-black uppercase text-slate-400 mb-8">
                                {path.date}
                            </p>

                            <div
                                className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800
                            flex items-center text-[10px] font-black uppercase text-[var(--c-primary)]"
                            >
                                Open Roadmap
                                <ArrowRight size={12} className="ml-2" />
                            </div>

                        </div>
                    ))}

                </div>

                {/* Saved AI Roadmaps */}
                {savedPaths.length > 0 && (
                    <>
                        <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mt-12 mb-4">
                            AI-Generated Roadmaps
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {savedPaths.map((path, index) => {
                                const stageCount = path.stages?.length || 0;
                                const topicCount = path.stages?.reduce((acc, s) => acc + (s.topics?.length || 0), 0) || 0;

                                return (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            // Pass the full AI roadmap object so Roadmap component uses it
                                            setSelectedRoadmap(path);
                                            setActiveGoalId(path.role || 'ai');
                                            navigate('career-roadmap');
                                        }}
                                        className="glass-panel p-6 rounded-sm border border-slate-300 dark:border-slate-800
                                        hover:border-[var(--c-primary)] shadow-md transition-all cursor-pointer group flex flex-col"
                                    >

                                        <div className="flex items-start justify-between mb-6">
                                            <div className="p-4 rounded-sm border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                                                <BrainCircuit size={24} />
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-widest bg-[rgba(var(--c-primary-rgb),0.1)] text-[var(--c-primary)] px-2 py-1 rounded-sm">
                                                AI Generated
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                                            {path.role || 'Custom Roadmap'}
                                        </h3>

                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">
                                            {stageCount} Stage{stageCount !== 1 ? 's' : ''} · {topicCount} Topic{topicCount !== 1 ? 's' : ''}
                                        </p>

                                        <div
                                            className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800
                                            flex items-center text-[10px] font-black uppercase text-[var(--c-primary)]"
                                        >
                                            Open Roadmap
                                            <ArrowRight size={12} className="ml-2" />
                                        </div>

                                    </div>
                                );
                            })}

                        </div>
                    </>
                )}

            </div>

        </div>
    );
}

// --- PROFILE PAGE COMPONENT ---
function ProfileView() {
    const user = {
        name: "Alex Johnson",
        email: "alex.johnson@btech.edu",
        branch: "Computer Science & Engineering",
        year: "2026",
        goal: "AI Engineer",
        codingProfiles: [
            {
                platform: "GitHub", handle: "@alexj_dev", icon:
                    <Code2 size={16} />, status: "Verified"
            },
            {
                platform: "LeetCode", handle: "alex_codes_26", icon:
                    <Code2 size={16} />, status: "Verified"
            },
            {
                platform: "Codeforces", handle: "alex_j", icon:
                    <Globe size={16} />, status: "Active"
            }
        ]
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 relative z-10 animate-fade-in-up">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter">
                    User Profile</h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                <div className="lg:col-span-1 space-y-6">
                    <div
                        className="glass-panel p-8 rounded-sm border border-slate-300 dark:border-slate-800 text-center relative overflow-hidden">
                        <div
                            className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--c-primary)] to-[var(--c-secondary)]" />
                        <div
                            className="w-24 h-24 bg-slate-900 dark:bg-blue-600 rounded-sm mx-auto mb-6 flex items-center justify-center shadow-lg">
                            <User size={48} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{user.name}
                        </h2>
                        <p className="text-[10px] font-black uppercase text-[var(--c-primary)] mb-6">Verified Student</p>
                    </div>
                    <div className="glass-panel p-6 rounded-sm border border-slate-300 dark:border-slate-800">
                        <h3 className="text-[10px] font-black uppercase text-slate-400 mb-5 flex items-center">
                            <Activity size={14} className="mr-2" /> Profiles
                        </h3>
                        <div className="space-y-3">
                            {user.codingProfiles.map((p, i) => (
                                <div key={i}
                                    className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-sm">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-slate-400">{p.icon}</div><span
                                            className="text-xs font-bold dark:text-white">{p.platform}</span>
                                    </div>
                                    <span className="text-[9px] font-black uppercase text-emerald-500">{p.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-8 rounded-sm border border-slate-300 dark:border-slate-800 shadow-lg">
                        <h3
                            className="text-sm font-black uppercase text-slate-900 dark:text-white border-b dark:border-slate-800 pb-4 mb-8 flex items-center">
                            <FileText size={18} className="mr-2 text-[var(--c-primary)]" /> Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ProfileField label="Full Name" value={user.name} />
                            <ProfileField label="Email Address" value={user.email} />
                            <ProfileField label="Current Branch" value={user.branch} />
                            <ProfileField label="Completion Year" value={user.year} />
                            <div className="md:col-span-2">
                                <ProfileField label="Active Goal" value={user.goal} highlight />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileField({ label, value, highlight }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
            <div className={`p-4 rounded-sm border dark:border-slate-700 ${highlight
                ? 'bg-slate-900 dark:bg-blue-900/20 text-white' : 'bg-white dark:bg-slate-800 dark:text-white'}`}>
                <span className="font-bold text-sm uppercase">{value}</span>
            </div>
        </div>
    );
}

// --- SETTINGS PAGE COMPONENT ---
function SettingsView({ theme, setTheme }) {
    const [activeTab, setActiveTab] = useState('general');
    const [profileData, setProfileData] = useState({
        name: "Alex Johnson",
        email: "alex.johnson@btech.edu",
        branch: "Computer Science & Engineering",
        year: "2026"
    });

    const [notifications, setNotifications] = useState({ email: true, push: true, weekly: false });

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 relative z-10 animate-fade-in-up pb-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">
                    Control Center</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">Customize your DecisionIQ engine and
                    account interface.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navigation Tabs */}
                <div className="lg:col-span-1 space-y-2">
                    <SettingsTab active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={
                        <SettingsIcon size={16} />} label="General" />
                    <SettingsTab active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={
                        <User size={16} />} label="Edit Profile" />
                    <SettingsTab active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')}
                        icon={
                            <Bell size={16} />} label="Notifications" />
                    <SettingsTab active={activeTab === 'connections'} onClick={() => setActiveTab('connections')}
                        icon={
                            <Terminal size={16} />} label="Connections" />
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-8">

                    {/* Section: Theme Settings */}
                    <div className="glass-panel p-8 rounded-sm border border-slate-300 dark:border-slate-800">
                        <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white mb-6 flex items-center">
                            <Sun size={18} className="mr-2 text-orange-500" /> Theme Settings
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setTheme('aurora')}
                                className={`flex flex-col items-center justify-center p-6 border rounded-sm transition-all
                        ${theme !== 'dark' ? 'border-[var(--c-primary)] bg-[var(--c-primary-rgb)]/5 shadow-md' :
                                        'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'}`}
                            >
                                <Sun className={`mb-3 ${theme !== 'dark' ? 'text-[var(--c-primary)]' : 'text-slate-400'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Light Mode</span>
                            </button>
                            <button onClick={() => setTheme('dark')}
                                className={`flex flex-col items-center justify-center p-6 border rounded-sm transition-all
                        ${theme === 'dark' ? 'border-[var(--c-primary)] bg-[var(--c-primary-rgb)]/5 shadow-md' :
                                        'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'}`}
                            >
                                <Moon className={`mb-3 ${theme === 'dark' ? 'text-[var(--c-primary)]' : 'text-slate-400'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Dark Mode</span>
                            </button>
                        </div>
                    </div>

                    {/* Section: Edit Profile */}
                    <div className="glass-panel p-8 rounded-sm border border-slate-300 dark:border-slate-800">
                        <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white mb-6 flex items-center">
                            <User size={18} className="mr-2 text-[var(--c-primary)]" /> Edit Profile
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SettingsField label="Full Name" val={profileData.name} setVal={(v) =>
                                setProfileData({ ...profileData, name: v })} />
                            <SettingsField label="Email Address" val={profileData.email} setVal={(v) =>
                                setProfileData({ ...profileData, email: v })} />
                            <SettingsField label="Branch" val={profileData.branch} setVal={(v) =>
                                setProfileData({ ...profileData, branch: v })} />
                            <SettingsField label="Completion Year" val={profileData.year} setVal={(v) =>
                                setProfileData({ ...profileData, year: v })} />
                        </div>
                        <button
                            className="mt-8 bg-slate-900 dark:bg-blue-600 text-white px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-widest flex items-center space-x-2 shadow-lg hover:-translate-y-0.5 transition-all">
                            <Save size={16} /><span>Update Profile</span>
                        </button>
                    </div>

                    {/* Section: Notification Settings */}
                    <div className="glass-panel p-8 rounded-sm border border-slate-300 dark:border-slate-800">
                        <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white mb-6 flex items-center">
                            <Bell size={18} className="mr-2 text-pink-500" /> Notifications
                        </h3>
                        <div className="space-y-4">
                            <NotificationToggle label="Email Alerts" desc="Receive career match updates via email."
                                active={notifications.email} toggle={() => setNotifications({
                                    ...notifications, email:
                                        !notifications.email
                                })} />
                            <NotificationToggle label="Push Notifications" desc="Get real-time roadmap notifications."
                                active={notifications.push} toggle={() => setNotifications({
                                    ...notifications, push:
                                        !notifications.push
                                })} />
                            <NotificationToggle label="Weekly Digest" desc="Summary of market trends and skill gaps."
                                active={notifications.weekly} toggle={() => setNotifications({
                                    ...notifications, weekly:
                                        !notifications.weekly
                                })} />
                        </div>
                    </div>

                    {/* Section: Connect Platforms */}
                    <div className="glass-panel p-8 rounded-sm border border-slate-300 dark:border-slate-800">
                        <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white mb-6 flex items-center">
                            <Terminal size={18} className="mr-2 text-emerald-500" /> Connect Platforms
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <ConnectRow icon={<Code2 size={20} />} label="GitHub" status="Connected" />
                            <ConnectRow icon={<Code2 size={20} />} label="LeetCode" status="Connected" />
                            <ConnectRow icon={<Terminal size={20} />} label="HackerRank" status="Disconnected" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function SettingsTab({ active, onClick, icon, label }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm font-bold text-xs
    uppercase tracking-widest transition-all ${active ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            {icon}<span>{label}</span>
        </button>
    );
}

function SettingsField({ label, val, setVal }) {
    return (
        <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{label}</label>
            <input type="text" value={val} onChange={(e) => setVal(e.target.value)} className="w-full bg-white dark:bg-slate-900
    border border-slate-200 dark:border-slate-800 rounded-sm p-3 text-sm font-bold text-slate-900 dark:text-white
    focus:border-[var(--c-primary)] outline-none transition-all shadow-sm" />
        </div>
    );
}

function NotificationToggle({ label, desc, active, toggle }) {
    return (
        <div
            className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-sm">
            <div>
                <h4 className="text-xs font-bold dark:text-white">{label}</h4>
                <p className="text-[10px] text-slate-500">{desc}</p>
            </div>
            <button onClick={toggle} className={`w-12 h-6 rounded-full relative transition-all duration-300 ${active
                ? 'bg-[var(--c-primary)]' : 'bg-slate-200 dark:bg-slate-700'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'left-7' : 'left-1'
                    }`} />
            </button>
        </div>
    );
}

function ConnectRow({ icon, label, status }) {
    const isConnected = status === "Connected";
    return (
        <div
            className="flex flex-col items-center p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm text-center shadow-sm">
            <div className={`mb-3 ${isConnected ? 'text-[var(--c-primary)]' : 'text-slate-400'}`}>{icon}</div>
            <h4 className="text-xs font-bold dark:text-white mb-4">{label}</h4>
            <button className={`w-full py-2 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all
        ${isConnected ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    : 'bg-slate-900 dark:bg-blue-600 text-white shadow-sm'}`}>
                {isConnected ? 'Disconnect' : 'Connect'}
            </button>
        </div>
    );
}

// --- GOAL OVERVIEW COMPONENT ---
function GoalOverview({ navigate, setActiveGoalId }) {
    const [viewState, setViewState] = useState('tabs');
    const [activeTab, setActiveTab] = useState('ai');
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const careerDatabase = [
        {
            id: 'ai', title: 'AI Engineer', icon:
                <Bot size={28} />, salary: '$130k - $180k', demand: 'Very High', duration: '6-8 Months', skills: ['Python', 'PyTorch',
                    'Neural Networks'], match: 98, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200'
        },
        {
            id: 'ds', title: 'Data Scientist', icon:
                <LineChart size={28} />, salary: '$110k - $150k', demand: 'High', duration: '5-7 Months', skills: ['Python', 'SQL',
                    'Stats'], match: 92, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200'
        },
        {
            id: 'cyb', title: 'Cybersecurity', icon:
                <ShieldAlert size={28} />, salary: '$120k - $160k', demand: 'Very High', duration: '6-9 Months', skills: ['Linux',
                    'Networking', 'Hacking'], match: 75, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200'
        },
        {
            id: 'cld', title: 'Cloud Engineer', icon:
                <Cloud size={28} />, salary: '$115k - $155k', demand: 'High', duration: '4-6 Months', skills: ['AWS', 'Docker',
                    'Kubernetes'], match: 80, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200'
        }
    ];

    const handleAI = () => {
        setViewState('analyzing');
        setTimeout(() => { setSelectedGoal(careerDatabase[0]); setViewState('insights'); }, 3000);
    };

    const handleSave = () => {
        setIsSaved(true);
        setActiveGoalId(selectedGoal.id); // Sync global state with selected goal
        setTimeout(() => navigate('career-roadmap'), 1500); // Redirect straight to the newly generated roadmap!
    };

    if (viewState === 'analyzing') return (
        <div className="max-w-3xl mx-auto px-4 mt-32 text-center animate-fade-in-up">
            <div className="flex flex-col items-center justify-center space-y-6">
                <div
                    className="relative w-32 h-32 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-full flex items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(var(--c-primary-rgb),0.2)] to-transparent w-full h-[30px] animate-[scanner_1.5s_linear_infinite]" />
                    <Cpu className="text-[var(--c-primary)] animate-pulse" size={56} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase">Analyzing Profile</h2>
                <p className="text-slate-500 font-bold text-sm uppercase flex items-center space-x-2">
                    <Loader2 size={16} className="animate-spin text-[var(--c-primary)]" /><span>Scanning skills...</span>
                </p>
            </div>
        </div>
    );

    if (viewState === 'insights' && selectedGoal) return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 relative animate-fade-in-up">
            <button onClick={() => setViewState('tabs')} className="flex items-center space-x-2 text-slate-500
        hover:text-slate-900 dark:hover:text-white font-bold text-xs uppercase mb-8 transition-colors">
                <ArrowLeft size={16} /><span>Back</span>
            </button>
            <div className="glass-panel border-t-4 border-t-[var(--c-primary)] p-8 sm:p-10 shadow-xl">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center space-x-5">
                        <div className={`p-4 rounded-sm border ${selectedGoal.border} ${selectedGoal.bg}
                    ${selectedGoal.color}`}>{selectedGoal.icon}</div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{selectedGoal.title}
                        </h1>
                    </div>
                    <div
                        className="bg-[rgba(var(--c-primary-rgb),0.1)] px-5 py-2.5 rounded-full font-black text-sm uppercase tracking-widest text-[var(--c-primary-dark)]">
                        <Sparkles size={16} className="inline mr-2" />{selectedGoal.match}% Match
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    <StatBox icon={<DollarSign size={16} />} label="Salary" val={selectedGoal.salary} />
                    <StatBox icon={<TrendingUp size={16} />} label="Demand" val={selectedGoal.demand} />
                    <StatBox icon={<Clock size={16} />} label="Duration" val={selectedGoal.duration} />
                </div>
                <h3 className="text-[10px] font-black uppercase text-slate-400 border-b dark:border-slate-800 pb-3 mb-6">
                    Required Skills</h3>
                <div className="flex flex-wrap gap-3 mb-10">
                    {selectedGoal.skills.map((s, i) => <div key={i}
                        className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-sm text-[10px] font-bold shadow-sm flex items-center">
                        <Wrench size={14} className="mr-2 opacity-50" />{s}
                    </div>)}
                </div>
                <button onClick={handleSave} disabled={isSaved} className={`w-full py-4 rounded-sm font-bold text-xs uppercase
            tracking-widest transition-all flex items-center justify-center space-x-3 ${isSaved
                        ? 'bg-emerald-500 text-white' : 'bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 text-white shadow-md'}`}>
                    {isSaved ?
                        <Check size={20} /> :
                        <Bookmark size={20} />}<span>{isSaved ? 'Path Saved' : 'Save Career Path'}</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-12 relative z-10 animate-fade-in-up">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">
                    Goal Overview</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">Set your target manually or let AI decide.
                </p>
            </div>
            <div className="glass-panel rounded-sm overflow-hidden shadow-xl border border-slate-300 dark:border-slate-800">
                <div className="flex border-b dark:border-slate-800">
                    <TabBtn active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} icon={
                        <BrainCircuit size={18} />} label="AI Recommendation" />
                    <TabBtn active={activeTab === 'manual'} onClick={() => setActiveTab('manual')} icon={
                        <Search size={18} />} label="Set Goal Manually" />
                </div>
                <div className="p-8 sm:p-12 text-center">
                    {activeTab === 'ai' ? (
                        <div className="animate-fade-in-up max-w-lg mx-auto">
                            <div
                                className="inline-flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-full mb-8">
                                <Target className="w-12 h-12 text-[var(--c-primary)]" />
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 font-medium mb-10">We evaluate your skills and activity
                                data against market matrices to find your perfect match.</p>
                            <button onClick={handleAI}
                                className="bg-slate-900 dark:bg-blue-600 text-white px-10 py-5 rounded-sm font-bold uppercase text-[11px] tracking-widest shadow-md">Generate
                                Recommendation</button>
                        </div>
                    ) : (
                        <div className="animate-fade-in-up w-full">
                            <div className="mb-8 relative max-w-md mx-auto">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search size={18} className="text-slate-400" />
                                </div>
                                <input type="text" placeholder="Search career paths (e.g., Data, Cloud)..." value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200
                    dark:border-slate-700 rounded-sm text-sm font-bold text-slate-900 dark:text-white focus:outline-none
                    focus:border-[var(--c-primary)] focus:ring-1 focus:ring-[var(--c-primary)] transition-all
                    placeholder-slate-400"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                {careerDatabase.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).map(c => (
                                    <button key={c.id} onClick={() => { setSelectedGoal(c); setViewState('insights'); }} className="flex
                        items-center p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800
                        hover:border-[var(--c-primary)] transition-all group">
                                        <div className={`p-3 border ${c.border} ${c.bg} ${c.color} mr-4`}>{c.icon}</div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">{c.title}</h4>
                                            <p className="text-[10px] font-black uppercase text-slate-400">{c.demand} Demand</p>
                                        </div>
                                        <ChevronRight size={20}
                                            className="ml-auto text-slate-200 dark:text-slate-700 group-hover:text-[var(--c-primary)]" />
                                    </button>
                                ))}

                                {careerDatabase.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0
                                    && (
                                        <div className="col-span-1 sm:col-span-2 text-center py-10">
                                            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">No career paths found
                                                matching "{searchQuery}"</p>
                                        </div>
                                    )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Helper components for Goal Overview
function StatBox({ icon, label, val }) {
    return (
        <div
            className="bg-white dark:bg-slate-900 p-4 rounded-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="text-slate-400 mb-2">{icon}</div>
            <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">{label}</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{val}</div>
        </div>
    );
}

function TabBtn({ active, onClick, icon, label }) {
    return (
        <button onClick={onClick} className={`flex-1 flex items-center justify-center space-x-2 py-4 text-xs font-bold uppercase
    tracking-widest transition-all border-b-2 ${active
                ? 'bg-[rgba(var(--c-primary-rgb),0.05)] text-[var(--c-primary)] border-[var(--c-primary)]'
                : 'border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            {icon}<span>{label}</span>
        </button>
    );
}

// --- AUTHENTICATION COMPONENT ---
function AuthPage() {
    const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [isFlipping, setIsFlipping] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [error, setError] = useState('');
    // Controlled fields
    const [email, setEmail]                   = useState('');
    const [password, setPassword]             = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName]                     = useState('');
    const [branch, setBranch]                 = useState('');
    const [gradYear, setGradYear]             = useState('');

    const handleToggle = (toLogin) => {
        if (isLogin === toLogin) return;
        setIsFlipping(true);
        setError('');
        setTimeout(() => { setIsLogin(toLogin); setVerificationSent(false); setIsFlipping(false); }, 800);
    };

    const friendlyError = (code) => {
        const map = {
            'auth/invalid-email':        'Invalid email address.',
            'auth/user-not-found':       'No account found with this email.',
            'auth/wrong-password':       'Incorrect password.',
            'auth/invalid-credential':   'Incorrect email or password.',
            'auth/email-already-in-use': 'An account with this email already exists.',
            'auth/weak-password':        'Password must be at least 6 characters.',
            'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
            'auth/too-many-requests':    'Too many attempts. Please try again later.',
        };
        return map[code] || 'Something went wrong. Please try again.';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsProcessing(true);
        try {
            if (isLogin) {
                await signInWithEmail(email, password);
                // onAuthStateChanged in context picks up the new user → App useEffect navigates
            } else {
                if (password !== confirmPassword) {
                    setError('Passwords do not match.');
                    setIsProcessing(false);
                    return;
                }
                await signUpWithEmail(email, password, name, {
                    branch,
                    gradYear
                }, true);
                setVerificationSent(true);
                setTimeout(() => {
                    setIsFlipping(true);
                    setTimeout(() => { setIsLogin(true); setVerificationSent(false); setIsFlipping(false); }, 800);
                }, 3000);
            }
        } catch (err) {
            setError(friendlyError(err.code));
        } finally {
            setIsProcessing(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setIsProcessing(true);
        try { await signInWithGoogle(); }
        catch (err) { setError(friendlyError(err.code)); }
        finally { setIsProcessing(false); }
    };

    return (
        <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-start px-4 sm:px-6 relative z-10 pt-4 pb-12 overflow-y-auto">
            <div className="w-full max-w-lg flex flex-col items-center animate-swing -mt-24">
                <div className="flex justify-center w-full h-[140px] sm:h-[200px] -mb-1 z-0 relative">
                    <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-slate-400 to-[var(--c-primary)] shadow-[0_0_8px_rgba(var(--c-primary-rgb),0.6)]" />
                </div>
                <div className="w-full relative z-50" style={{ perspective: '1200px' }}>
                    <div className="glass-panel rounded-sm p-6 sm:p-10 relative z-50 shadow-xl border border-slate-300 dark:border-slate-800"
                        style={{ transform: isFlipping ? 'rotateY(90deg)' : 'rotateY(0deg)', transition: 'transform 0.8s ease-in-out, opacity 0.8s ease-in-out', opacity: isFlipping ? 0.3 : 1, transformStyle: 'preserve-3d', background: 'rgba(255,255,255,0.95)' }}>
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex justify-center z-20">
                            <div className="w-6 h-6 bg-slate-100 border border-slate-300 border-b-0 rounded-t-sm flex items-center justify-center">
                                <div className="w-2 h-2 bg-slate-800 rounded-full shadow-inner" />
                            </div>
                        </div>
                        <div className="relative z-10 pt-2">
                            <div className="text-center mb-6 flex flex-col items-center">
                                <div className="inline-flex bg-white border border-slate-200 p-3 rounded-sm mb-4 shadow-sm">
                                    <Layers className="w-6 h-6 text-[var(--c-primary)]" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 uppercase tracking-tighter">
                                    {isLogin ? 'Welcome Back' : verificationSent ? '✓ Check Your Email' : 'Get Started'}
                                </h2>
                                <p className="text-slate-500 font-semibold text-xs sm:text-sm mt-1 px-4">
                                    {isLogin ? 'Enter your credentials to access the engine.'
                                        : verificationSent ? 'A verification link was sent. Check your inbox then sign in.'
                                        : 'Register to start engineering your career path today.'}
                                </p>
                            </div>

                            {/* Error banner */}
                            {error && (
                                <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-4 py-3 rounded-sm animate-fade-in-up">
                                    <AlertTriangle size={14} className="flex-shrink-0" />{error}
                                </div>
                            )}

                            {!verificationSent && (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {isLogin && (
                                        <>
                                            <AuthField label="Email Address" icon={<Mail className="h-4 w-4 text-slate-400" />}
                                                type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                                            <div className="animate-fade-in-up delay-100">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Password</label>
                                                    <a href="#" className="text-[10px] font-black text-[var(--c-primary)] hover:underline uppercase tracking-wider">Forgot?</a>
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center"><Lock className="h-4 w-4 text-slate-400" /></div>
                                                    <input required type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                                                        className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-sm text-slate-900 font-bold text-sm placeholder-slate-400 focus:outline-none focus:border-[var(--c-primary)] focus:ring-2 focus:ring-[rgba(var(--c-primary-rgb),0.1)] transition-colors shadow-sm" />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {!isLogin && (
                                        <div className="space-y-4 animate-fade-in-up">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <AuthField label="Full Name" icon={<User className="h-4 w-4 text-slate-400" />} placeholder="Alex Johnson" value={name} onChange={e => setName(e.target.value)} />
                                                <AuthField label="Email" icon={<Mail className="h-4 w-4 text-slate-400" />} type="email" placeholder="alex@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <AuthField label="Study Branch" icon={<BookOpen className="h-4 w-4 text-slate-400" />} placeholder="e.g. Computer Science" value={branch} onChange={e => setBranch(e.target.value)} />
                                                <div>
                                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Completion Year</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center"><Calendar className="h-4 w-4 text-slate-400" /></div>
                                                        <select required value={gradYear} onChange={e => setGradYear(e.target.value)}
                                                            className="block w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-sm text-slate-900 font-bold text-sm focus:outline-none focus:border-[var(--c-primary)] appearance-none cursor-pointer">
                                                            <option value="" disabled>Select Year</option>
                                                            <option>2024</option><option>2025</option><option>2026</option><option>2027</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <AuthField label="Password" icon={<Lock className="h-4 w-4 text-slate-400" />} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                                                <AuthField label="Confirm Password" icon={<ShieldCheck className="h-4 w-4 text-slate-400" />} type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                                            </div>
                                        </div>
                                    )}
                                    <div className="pt-2 text-center">
                                        <span className="text-slate-500 font-semibold text-xs">{isLogin ? 'New to the engine? ' : 'Already registered? '}</span>
                                        <button type="button" onClick={() => handleToggle(!isLogin)} disabled={isProcessing}
                                            className="text-[var(--c-primary)] hover:text-slate-900 font-black uppercase tracking-wider text-xs ml-1 disabled:opacity-50">
                                            {isLogin ? 'Sign up' : 'Sign in'}
                                        </button>
                                    </div>
                                    <button type="submit" disabled={isProcessing}
                                        className="w-full mt-1 flex items-center justify-center space-x-3 bg-slate-900 hover:bg-slate-800 text-white pl-8 pr-2 py-3 rounded-sm font-bold text-xs uppercase tracking-wider transition-all shadow-md group disabled:opacity-70">
                                        {isProcessing
                                            ? <><Loader2 size={16} className="animate-spin" /><span>Processing...</span></>
                                            : <>{isLogin ? 'Sign In' : 'Create Account'}<div className="bg-white text-slate-900 p-1.5 rounded-sm group-hover:bg-[var(--c-primary)] group-hover:text-white transition-all transform group-hover:translate-x-1"><ArrowRight size={14} /></div></>}
                                    </button>

                                    {/* Google Sign-In divider */}
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">or</span>
                                        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                                    </div>
                                    <button type="button" onClick={handleGoogleSignIn} disabled={isProcessing}
                                        className="w-full flex items-center justify-center gap-3 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider py-3 rounded-sm transition-all shadow-sm disabled:opacity-60">
                                        <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.5 30.2 0 24 0 14.7 0 6.7 5.4 2.7 13.3l7.8 6C12.3 13.1 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.1-10 6.1-17z"/><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.7 10.7l7.8-6z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.3 0-11.7-4.3-13.6-10l-7.8 6C6.7 42.6 14.7 48 24 48z"/></svg>
                                        Continue with Google
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AuthField({ label, icon, type = 'text', placeholder, value, onChange }) {
    return (
        <div className="animate-fade-in-up">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">{label}</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center">{icon}</div>
                <input type={type} required placeholder={placeholder} value={value} onChange={onChange}
                    className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-sm text-slate-900 font-bold text-sm placeholder-slate-400 focus:outline-none focus:border-[var(--c-primary)] focus:ring-2 focus:ring-[rgba(var(--c-primary-rgb),0.1)] transition-colors shadow-sm" />
            </div>
        </div>
    );
}


// --- FLOATING AI CHATBOT COMPONENT ---
const FloatingChatbot = React.memo(() => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{
        role: 'assistant',
        content: `Hi Alex! I'm your career navigator. I've analyzed your B.Tech CSE profile. How can I help you engineering your
roadmap today?`
    }]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (user) {
            async function loadHistory() {
                try {
                    const history = await getChatHistory(user.uid);
                    if (history.length > 0) {
                        setMessages(history);
                    }
                } catch (error) {
                    console.error("Failed to load chat history:", error);
                }
            }
            loadHistory();
        }
    }, [user]);

    useEffect(() => { if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping,
        isOpen]);

    const handleSend = async (text) => {
        const userMsg = text || input;
        if (!userMsg.trim() || !user) return;

        const newUserMsg = { role: 'user', content: userMsg };
        setMessages(prev => [...prev, newUserMsg]);
        setInput('');
        setIsTyping(true);

        // Save user message to Firestore
        await saveChatMessage(user.uid, newUserMsg);

        // ── Real AI Integration ───────────────────────────────────────────
        try {
            const response = await fetch("https://mani-359-deci-iq-api.hf.space/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    decision: userMsg,
                    max_tokens: 600,
                    temperature: 0.4
                })
            });

            if (!response.ok) throw new Error("API Connection Failed");

            const data = await response.json();
            const aiResponse = data.response || "I'm sorry, I'm having trouble processing that right now.";

            const assistantMsg = { role: 'assistant', content: aiResponse };
            setMessages(prev => [...prev, assistantMsg]);
            
            // Save assistant message to Firestore
            await saveChatMessage(user.uid, assistantMsg);

        } catch (error) {
            console.error("AI Error:", error);
            const errorMsg = { role: 'assistant', content: "The career engine is currently cooling down. Please try again in a moment." };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };



    return (
        <>
            {/* Floating Circular Button */}
            <div className="fixed bottom-6 right-6 z-[60]">
                <button onClick={() => setIsOpen(!isOpen)}
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-[var(--c-primary)] to-[var(--c-secondary)]
            text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all
            animate-float"
                >
                    {isOpen ?
                        <X size={24} /> :
                        <Bot size={24} />}
                </button>
            </div>

            {/* Expandable Chat Window */}
            <div className={`fixed bottom-24 right-6 w-[90vw] sm:w-96 h-[550px] max-h-[80vh] glass-panel rounded-sm z-[60] flex
        flex-col overflow-hidden shadow-2xl transition-all origin-bottom-right ${isOpen
                    ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'}`}>

                {/* Header */}
                <div className="bg-slate-900 p-4 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-600 p-2 rounded-sm">
                            <Bot className="text-white" size={18} />
                        </div>
                        <div>
                            <h2 className="text-white font-black text-xs uppercase tracking-widest">Career Navigator</h2>
                            <div className="flex items-center space-x-1.5">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /><span
                                    className="text-[9px] font-bold text-slate-400 uppercase">Live Assistance</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1.5">
                        <ChevronDown size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-pop-in`}>
                            <div className={`p-3.5 rounded-sm text-xs font-medium shadow-sm transition-all max-w-[85%]
                    ${msg.role === 'user' ? 'bg-slate-900 text-white'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isTyping && <div
                        className="p-3.5 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center space-x-1 w-fit">
                        <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-100" />
                        <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-200" />
                    </div>}
                    <div ref={messagesEndRef} />
                </div>

                {/* Decision Message */}
                <div className="px-4 py-3 bg-white/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Decide with your own decisions
                    </p>
                </div>

                {/* Input Box */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center">
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your roadmap..."
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                text-slate-900 dark:text-white rounded-sm pl-4 pr-12 py-3 text-xs font-bold outline-none
                focus:border-[var(--c-primary)]"
                        />
                        <button type="submit" disabled={!input.trim()}
                            className="absolute right-1.5 p-2 bg-slate-900 dark:bg-blue-600 text-white rounded-sm disabled:opacity-50 transition-all active:scale-95">
                            <Send size={14} />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
});

// Map roadmap stages to DAG structure for PathCanvas React Flow
const translateRoadmapToDag = (roadmap, startPoint) => {
    if (!roadmap || !roadmap.stages) return null;
    const nodes = [];

    // Add root node
    nodes.push({
        id: 'root',
        label: startPoint || 'Start Point',
        description: 'Starting point',
        track: 'Start',
        depends_on: []
    });

    let lastStageId = 'root';
    roadmap.stages.forEach((stage, sIdx) => {
        const stageId = `stage_${sIdx}`;
        nodes.push({
            id: stageId,
            label: stage.title,
            description: `Stage ${sIdx + 1}`,
            track: stage.title,
            depends_on: [lastStageId]
        });

        (stage.topics || []).forEach((topic, tIdx) => {
            const topicId = `stage_${sIdx}_topic_${tIdx}`;
            nodes.push({
                id: topicId,
                label: topic.name,
                description: topic.description,
                track: stage.title,
                depends_on: [stageId]
            });
        });

        lastStageId = stageId;
    });

    // Add final goal node
    nodes.push({
        id: 'goal',
        label: roadmap.role || 'Goal',
        description: 'Target Goal',
        track: 'Goal',
        depends_on: [lastStageId]
    });

    return { nodes };
};

// --- PATH GENERATOR & ANALYZER MODULE ---
function DecisionAnalyzer({ navigate, setActiveGoalId, roadmap, setRoadmap }) {
    const { user } = useAuth();
    const [startPoint, setStartPoint] = useState('B.Tech CSE');
    const [endPoint, setEndPoint] = useState('AI Engineer');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const [treeData, setTreeData] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'dag'

    // Tracks the sequence of nodes the user has selected to reach the goal
    const [selectedSequence, setSelectedSequence] = useState([]);

    // =====================================================================
    // API INTEGRATION SECTION: Fetch Hierarchical Paths (Replace Later)
    // =====================================================================
    const handleGenerate = async () => {
        if (!startPoint || !endPoint) return;
        setIsGenerating(true);
        setError(null);
        setTreeData(null);
        setSelectedSequence([]);

        try {
            const response = await fetch(`${API_BASE_URL}/generate-paths`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ start: startPoint, goal: endPoint })
            });

            if (!response.ok) throw new Error("Failed to generate path. Gemma might be overloaded.");

            const data = await response.json();
            if (data.stages) {
                setRoadmap(data);
            } else {
                throw new Error("Invalid response from AI compass.");
            }
        } catch (err) {
            console.error("Failed to fetch path tree:", err);
            setError("The compass is spinning! Could not map this career path. Try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSelectNode = (levelIndex, selectedNode) => {
        // Truncate the current sequence up to the level where the user clicked
        const newSequence = selectedSequence.slice(0, levelIndex);

        // Add the newly selected node to the sequence to render its children in the next column
        newSequence.push(selectedNode);
        setSelectedSequence(newSequence);
    };

    const handleSavePath = async () => {
        if (!roadmap || !user) return;

        try {
            // Transform roadmap for display/storage
            const nodes = [];
            roadmap.stages.forEach((stage, sIdx) => {
                nodes.push({
                    id: `stage_${sIdx}`,
                    title: stage.title,
                    status: 'pending',
                    isStage: true
                });
                (stage.topics || []).forEach((topic, tIdx) => {
                    nodes.push({
                        id: `stage_${sIdx}_topic_${tIdx}`,
                        title: topic.name,
                        description: topic.description,
                        status: 'pending'
                    });
                });
            });

            const roadmapToSave = {
                role: roadmap.role || endPoint,
                nodes: nodes,
                raw: roadmap // Keep the raw data just in case
            };

            const roadmapId = await saveRoadmapToFirestore(user.uid, roadmapToSave);
            console.log("Saved successfully with ID:", roadmapId);
            alert("Roadmap saved successfully to your profile!");
            navigate('dashboard');
        } catch (error) {
            console.error("Save failed:", error);
            alert("Could not save roadmap to Firestore.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-12 relative z-10 animate-fade-in-up pb-20">
            <div className="text-center mb-10 relative">
                {/* Error Message */}
                {error && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[120%] z-20 text-[#ff4444] bg-[rgba(255,0,0,0.1)] p-4 rounded-md border border-[#ff4444] shadow-[0_0_15px_rgba(255,0,0,0.2)] w-full max-w-md animate-pop-in">
                        <span className="font-bold text-sm tracking-widest uppercase">{error}</span>
                    </div>
                )}

                <div
                    className="inline-flex items-center justify-center p-4 bg-slate-900 dark:bg-blue-600 rounded-sm mb-6 shadow-lg">
                    <GitCompare size={32} className="text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">
                    Path Builder</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg font-medium max-w-2xl mx-auto">
                    Input your starting point and target role. Our engine generates all possible hierarchical routes. Choose the
                    steps that fit you best to map out your final roadmap.
                </p>
            </div>

            {/* Input Section */}
            <div className="glass-panel p-6 sm:p-8 rounded-sm shadow-md border border-slate-300 dark:border-slate-800 mb-10">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center">
                            <Map size={14} className="mr-2" /> Input Root
                        </label>
                        <input type="text" value={startPoint} onChange={(e) => setStartPoint(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-sm
                p-3 text-sm font-bold text-slate-900 dark:text-white focus:border-[var(--c-primary)] outline-none
                transition-all"
                        />
                    </div>

                    <div className="md:col-span-1 flex justify-center pb-3 hidden md:flex text-slate-300 dark:text-slate-700">
                        <ArrowRight size={24} />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center">
                            <Target size={14} className="mr-2 text-[var(--c-primary)]" /> Goal Root
                        </label>
                        <input type="text" value={endPoint} onChange={(e) => setEndPoint(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-sm
                p-3 text-sm font-bold text-slate-900 dark:text-white focus:border-[var(--c-primary)] outline-none
                transition-all"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    {roadmap && (
                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={handleSavePath}
                                className="bg-green-600 text-white px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-green-700 transition-all border border-green-400"
                            >
                                Save Path
                            </button>
                        </div>
                    )}
                    <button onClick={handleGenerate} disabled={isGenerating || !startPoint || !endPoint}
                        className="bg-slate-900 dark:bg-blue-600 text-white px-10 py-3.5 rounded-sm font-bold text-xs uppercase tracking-widest flex items-center space-x-3 shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all disabled:opacity-70 disabled:hover:translate-y-0 border border-cyan-500/50">
                        {isGenerating ?
                            <Loader2 size={16} className="animate-spin text-[#0ff]" /> :
                            <GitCompare size={16} className="text-[#0ff]" />}
                        <span className={isGenerating ? "text-[#0ff]" : "text-white"}>{isGenerating ? 'Plotting Course...' : 'Generate Grand Line'}</span>
                    </button>
                </div>

                {/* Futuristic Loading Overlay */}
                {isGenerating && (
                    <div className="absolute top-[150%] left-1/2 -translate-x-1/2 z-20 text-[#0ff] text-center font-mono animate-pulse-slow">
                        <h2 className="text-xl font-black uppercase tracking-widest mb-2 shadow-cyan-500/50 drop-shadow-md">Navigating the Data...</h2>
                        <p className="text-xs opacity-80 uppercase tracking-widest">Gemma 3 is generating the optimal path.</p>
                    </div>
                )}
            </div>

            {/* View Mode Switcher */}
            {roadmap && (
                <div className="flex justify-center space-x-4 mb-8">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-5 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all border ${
                            viewMode === 'list'
                                ? 'bg-slate-900 dark:bg-blue-600 text-white border-transparent shadow-md'
                                : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-[var(--c-primary)] border-slate-200 dark:border-slate-700'
                        }`}
                    >
                        Detailed List
                    </button>
                    <button
                        onClick={() => setViewMode('dag')}
                        className={`px-5 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all border ${
                            viewMode === 'dag'
                                ? 'bg-slate-900 dark:bg-blue-600 text-white border-transparent shadow-md'
                                : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-[var(--c-primary)] border-slate-200 dark:border-slate-700'
                        }`}
                    >
                        Visual Flow Map
                    </button>
                </div>
            )}

            {/* Visual Path Mapping UI (DAG Layout) */}
            {viewMode === 'list' ? (
                <RoadmapRenderer roadmap={roadmap} />
            ) : (
                <PathCanvas treeData={translateRoadmapToDag(roadmap, startPoint)} />
            )}
        </div>
    );
}

// --- HIDDEN ROUTE COMPONENTS ---
function RiskAnalyzer({ navigate }) {
    const [decision, setDecision] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const presetDecisions = [
        "I want to skip system design prep and only focus on DSA for placement.",
        "I'll skip making projects and just grind LeetCode for placements.",
        "I want to learn AI/ML directly without studying Python or basic programming.",
        "I will apply only to remote US startups as a fresh graduate without local backup.",
        "I will focus entirely on Web3/Blockchain development and ignore general software engineering foundations."
    ];

    const handleAnalyze = async (textToAnalyze) => {
        const queryText = textToAnalyze || decision;
        if (!queryText.trim()) return;

        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(`${API_BASE_URL}/analyze-risk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ decision: queryText })
            });

            if (!response.ok) throw new Error("Failed to analyze decision.");
            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            setError("Could not analyze this decision. The server might be offline.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getRiskColor = (level) => {
        switch (level?.toUpperCase()) {
            case 'HIGH': return 'text-red-500 border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
            case 'MEDIUM': return 'text-amber-500 border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.3)]';
            case 'LOW': return 'text-emerald-500 border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
            default: return 'text-blue-500 border-blue-500 bg-blue-500/10';
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 relative z-10 animate-fade-in-up pb-20">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-4 bg-red-600 dark:bg-rose-600 rounded-sm mb-6 shadow-lg">
                    <ShieldAlert size={32} className="text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">
                    Risk Simulator
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg font-medium max-w-2xl mx-auto">
                    Simulate how a career decision will play out over 6 months. Identify pitfalls, uncover root causes, and find safer alternate paths.
                </p>
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-sm border border-slate-300 dark:border-slate-800 mb-8">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3">
                    Select a Preset Career Choice
                </label>
                <div className="flex flex-col gap-2 mb-6">
                    {presetDecisions.map((preset, idx) => (
                        <button
                            key={idx}
                            onClick={() => { setDecision(preset); handleAnalyze(preset); }}
                            className="text-left px-4 py-3 rounded-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:border-[var(--c-primary)] dark:hover:border-[var(--c-primary)] hover:bg-slate-100 dark:hover:bg-slate-800/50 text-xs font-semibold transition-all"
                        >
                            {preset}
                        </button>
                    ))}
                </div>

                <div className="h-px bg-slate-200 dark:bg-slate-800 my-6"></div>

                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3">
                    Or Describe Your Custom Decision
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={decision}
                        onChange={(e) => setDecision(e.target.value)}
                        placeholder="e.g. I will skip coding practice this semester to learn digital marketing"
                        className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-sm p-3.5 text-sm font-semibold text-slate-900 dark:text-white focus:border-[var(--c-primary)] outline-none transition-all"
                    />
                    <button
                        onClick={() => handleAnalyze()}
                        disabled={isAnalyzing || !decision.trim()}
                        className="bg-slate-900 dark:bg-rose-600 text-white px-8 py-3.5 rounded-sm font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 border border-rose-500/50 transition-all hover:-translate-y-0.5"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 size={16} className="animate-spin text-[#0ff]" />
                                <span className="text-[#0ff]">Analyzing...</span>
                            </>
                        ) : (
                            <>
                                <Activity size={16} />
                                <span>Simulate Timeline</span>
                            </>
                        )}
                    </button>
                </div>
                {error && <p className="text-red-500 text-xs font-bold mt-4 uppercase tracking-widest">{error}</p>}
            </div>

            {/* Results Output */}
            {result && (
                <div className="space-y-8 animate-fade-in-up">
                    <div className="glass-panel p-6 sm:p-8 rounded-sm border border-slate-300 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Simulated Decision</span>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">"{result.decision}"</h2>
                        </div>
                        <div className={`px-4 py-2 border rounded-sm text-xs font-black uppercase tracking-widest ${getRiskColor(result.risk_level)}`}>
                            {result.risk_level} Risk
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 glass-panel p-6 sm:p-8 rounded-sm border border-slate-300 dark:border-slate-800 space-y-4">
                            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center border-b dark:border-slate-800 pb-2">
                                <AlertTriangle size={14} className="mr-2 text-rose-500" /> Root Cause Analysis
                            </h3>
                            <p className="text-slate-700 dark:text-slate-300 text-sm font-semibold leading-relaxed">
                                {result.root_cause}
                            </p>
                        </div>
                        <div className="glass-panel p-6 sm:p-8 rounded-sm border border-slate-300 dark:border-slate-800 bg-emerald-500/5 border-emerald-500/20 space-y-4">
                            <h3 className="text-[10px] font-black uppercase text-emerald-500 tracking-widest flex items-center border-b border-emerald-500/10 pb-2">
                                <ShieldCheck size={14} className="mr-2 text-emerald-400" /> Alternate Route
                            </h3>
                            <p className="text-slate-700 dark:text-slate-300 text-xs font-bold leading-relaxed mb-4">
                                {result.alternate_path}
                            </p>
                        </div>
                    </div>

                    <div className="glass-panel p-6 sm:p-10 rounded-sm border border-slate-300 dark:border-slate-800">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b dark:border-slate-800 pb-3 mb-8 text-center">
                            6-Month Timeline Simulation
                        </h3>
                        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 sm:ml-8 space-y-8">
                            {result.months.map((monthText, index) => (
                                <div key={index} className="relative pl-8 sm:pl-10 transition-all group">
                                    <div className={`absolute -left-[11px] top-5 w-5 h-5 rounded-full border-[3px] z-10 bg-rose-500 border-white dark:border-slate-900`} />
                                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 rounded-sm shadow-md hover:border-rose-500/30 transition-all">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-black uppercase tracking-wider text-rose-500">Month {index + 1}</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold leading-relaxed">
                                            {monthText}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
const RECOMMENDATIONS_DB = {
    'ai': {
        title: 'AI Engineer',
        courses: [
            { title: 'Deep Learning Specialization', platform: 'Coursera (Andrew Ng)', rating: '4.9', link: 'https://coursera.org' },
            { title: 'PyTorch for Deep Learning Boot Camp', platform: 'Udemy', rating: '4.7', link: 'https://udemy.com' },
            { title: 'Hugging Face NLP Course', platform: 'Hugging Face (Free)', rating: '5.0', link: 'https://huggingface.co' }
        ],
        projects: [
            { title: 'Retrieval-Augmented Generation (RAG) System', desc: 'Build a private PDF Q&A bot using LangChain, OpenAI API, and Pinecone vector database.' },
            { title: 'Fine-Tune Llama 3 on Custom Dataset', desc: 'Use LoRA/QLoRA technique to fine-tune Llama 3 for specialized domain reasoning.' },
            { title: 'Real-time Object Detection Pipeline', desc: 'Implement YOLOv8 with PyTorch for low-latency video analytics streams.' }
        ],
        certs: [
            { name: 'Google Cloud Professional ML Engineer', level: 'Advanced' },
            { name: 'TensorFlow Developer Certificate', level: 'Intermediate' }
        ]
    },
    'ds': {
        title: 'Data Scientist',
        courses: [
            { title: 'Applied Data Science with Python', platform: 'Coursera (U. Michigan)', rating: '4.8', link: 'https://coursera.org' },
            { title: 'SQL & Database Design Masterclass', platform: 'Udemy', rating: '4.6', link: 'https://udemy.com' },
            { title: 'Data Analysis with Pandas and NumPy', platform: 'Udemy', rating: '4.7', link: 'https://udemy.com' }
        ],
        projects: [
            { title: 'E-Commerce Customer Segmentation', desc: 'Perform RFM analysis and K-means clustering to segment shoppers and optimize marketing.' },
            { title: 'House Price Forecasting Model', desc: 'Develop an XGBoost regression model with hyperparameter tuning to forecast real estate listings.' },
            { title: 'Interactive Finance Dashboard', desc: 'Build a Streamlit dashboard showing real-time stock analytics and correlation heatmaps.' }
        ],
        certs: [
            { name: 'Microsoft Certified: Power BI Data Analyst', level: 'Intermediate' },
            { name: 'Databricks Certified Associate Data Scientist', level: 'Advanced' }
        ]
    },
    'cyb': {
        title: 'Cybersecurity Expert',
        courses: [
            { title: 'CompTIA Security+ (SY0-701) Prep Course', platform: 'Udemy (Jason Dion)', rating: '4.8', link: 'https://udemy.com' },
            { title: 'Google Cybersecurity Professional Certificate', platform: 'Coursera', rating: '4.8', link: 'https://coursera.org' },
            { title: 'Practical Ethical Hacking', platform: 'TCM Academy', rating: '4.9', link: 'https://tcm-sec.com' }
        ],
        projects: [
            { title: 'Network Vulnerability Scanner', desc: 'Write a Python tool leveraging Nmap to scan subnets and flag outdated services.' },
            { title: 'Active Directory Pentesting Lab', desc: 'Build a virtual machine home lab to practice AD poisoning and hash passing.' },
            { title: 'Syslog SIEM Dashboard', desc: 'Set up ELK stack to aggregate firewall logs and trigger alerts on brute force attempts.' }
        ],
        certs: [
            { name: 'CompTIA Security+', level: 'Entry' },
            { name: 'Certified Information Systems Security Professional (CISSP)', level: 'Expert' },
            { name: 'Offensive Security Certified Professional (OSCP)', level: 'Advanced' }
        ]
    },
    'cld': {
        title: 'Cloud Engineer',
        courses: [
            { title: 'AWS Solutions Architect Associate Prep', platform: 'Udemy (Adrian Cantrill)', rating: '4.9', link: 'https://udemy.com' },
            { title: 'Docker and Kubernetes: The Complete Guide', platform: 'Udemy (Stephen Grider)', rating: '4.8', link: 'https://udemy.com' },
            { title: 'Terraform Certified Associate Prep', platform: 'Udemy', rating: '4.7', link: 'https://udemy.com' }
        ],
        projects: [
            { title: 'Multi-Tier Cloud Deployment', desc: 'Deploy a highly-available VPC with autoscaling EC2 web servers and RDS database on AWS.' },
            { title: 'GitOps Kubernetes Pipeline', desc: 'Configure GitHub Actions and ArgoCD to auto-deploy frontend updates to an EKS cluster.' },
            { title: 'Serverless Video Transcoder', desc: 'Use AWS Lambda, S3 triggers, and MediaConvert to automatically encode uploaded files.' }
        ],
        certs: [
            { name: 'AWS Certified Solutions Architect - Associate', level: 'Intermediate' },
            { name: 'HashiCorp Certified: Terraform Associate', level: 'Intermediate' },
            { name: 'Certified Kubernetes Administrator (CKA)', level: 'Advanced' }
        ]
    }
};

function Recommendations({ navigate, activeGoalId }) {
    const goalId = ['ai', 'ds', 'cyb', 'cld'].includes(activeGoalId) ? activeGoalId : 'ai';
    const data = RECOMMENDATIONS_DB[goalId];

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-12 relative z-10 animate-fade-in-up pb-20">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-4 bg-slate-900 dark:bg-blue-600 rounded-sm mb-6 shadow-lg">
                    <Sparkles size={32} className="text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">
                    AI Recommendations
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                    Curated resources, projects, and certifications for target: <span className="text-[var(--c-primary)] font-black uppercase">{data.title}</span>.
                </p>
            </div>

            {/* Grid for Courses and Certs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Courses */}
                <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-sm border border-slate-300 dark:border-slate-800 space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b dark:border-slate-800 pb-3 flex items-center">
                        <BookOpen size={16} className="mr-2 text-[var(--c-primary)]" /> Recommended Courses & Tutorials
                    </h3>
                    <div className="space-y-4">
                        {data.courses.map((course, idx) => (
                            <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm hover:border-[var(--c-primary)]/40 transition-all">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{course.title}</h4>
                                    <p className="text-[10px] font-black uppercase text-slate-400 mt-1">{course.platform}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="text-xs font-black text-amber-500 flex items-center">
                                        <Star size={14} className="mr-1 fill-amber-500" /> {course.rating}
                                    </span>
                                    <a href={course.link} target="_blank" rel="noopener noreferrer" className="p-2 text-[var(--c-primary)] hover:text-white hover:bg-[var(--c-primary)] border border-[var(--c-primary)]/30 rounded-sm transition-all text-[10px] font-black uppercase tracking-wider">
                                        Link <ExternalLink size={10} className="inline ml-1" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Certifications */}
                <div className="glass-panel p-6 sm:p-8 rounded-sm border border-slate-300 dark:border-slate-800 space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b dark:border-slate-800 pb-3 flex items-center">
                        <Award size={16} className="mr-2 text-rose-500" /> Key Certifications
                    </h3>
                    <div className="space-y-4">
                        {data.certs.map((cert, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm flex justify-between items-center">
                                <span className="font-bold text-slate-800 dark:text-slate-300 text-xs">{cert.name}</span>
                                <span className={`px-2 py-1 rounded-sm text-[8px] font-black uppercase tracking-wider border ${
                                    cert.level === 'Advanced' || cert.level === 'Expert'
                                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                        : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                }`}>
                                    {cert.level}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hands-on Projects */}
            <div className="glass-panel p-6 sm:p-8 rounded-sm border border-slate-300 dark:border-slate-800 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b dark:border-slate-800 pb-3 flex items-center">
                    <Code2 size={16} className="mr-2 text-emerald-500" /> Recommended Hands-On Projects
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.projects.map((proj, idx) => (
                        <div key={idx} className="p-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm hover:border-emerald-500/30 transition-all flex flex-col justify-between">
                            <div className="space-y-3">
                                <h4 className="font-black text-slate-900 dark:text-white text-base leading-snug">{proj.title}</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold leading-relaxed">{proj.desc}</p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-[9px] font-black uppercase text-emerald-500 flex items-center cursor-pointer">
                                Add to Portfolio
                                <ArrowRight size={10} className="ml-1.5" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
const READINESS_DB = {
    'ai': {
        title: 'AI Engineer',
        score: 75,
        skills: [
            { name: 'Python Basics', status: 'completed' },
            { name: 'Linear Algebra & Calculus', status: 'completed' },
            { name: 'Scikit-Learn & ML basics', status: 'completed' },
            { name: 'Neural Networks (PyTorch)', status: 'in-progress' },
            { name: 'NLP & LLM Tuning', status: 'pending' },
            { name: 'MLOps Deployment', status: 'pending' }
        ],
        actions: [
            { task: 'Complete PyTorch basics course', priority: 'Critical', desc: 'Required for neural network understanding.' },
            { task: 'Build and deploy a simple RAG application', priority: 'High', desc: 'Adds critical portfolio project weight.' },
            { task: 'Study CAP Theorem & HLD basics', priority: 'Medium', desc: 'Frequently tested in Tier-1 placements.' }
        ]
    },
    'ds': {
        title: 'Data Scientist',
        score: 82,
        skills: [
            { name: 'Stats & Probability', status: 'completed' },
            { name: 'Python & Pandas', status: 'completed' },
            { name: 'SQL Query Tuning', status: 'completed' },
            { name: 'Regression & Classification', status: 'completed' },
            { name: 'Feature Engineering', status: 'in-progress' },
            { name: 'Big Data (Spark/Hadoop)', status: 'pending' }
        ],
        actions: [
            { task: 'Learn Feature Selection methodologies', priority: 'High', desc: 'Required for dataset accuracy refinement.' },
            { task: 'Build interactive stock data dashboard', priority: 'Medium', desc: 'Demonstrates data visualization fluency.' },
            { task: 'Practice SQL joins & window functions', priority: 'Critical', desc: 'Highly tested in initial technical screens.' }
        ]
    },
    'cyb': {
        title: 'Cybersecurity Expert',
        score: 55,
        skills: [
            { name: 'Networking Basics', status: 'completed' },
            { name: 'Linux Commands & Shell', status: 'completed' },
            { name: 'OWASP Top 10 vulnerabilities', status: 'in-progress' },
            { name: 'Active Directory Pentesting', status: 'pending' },
            { name: 'Cryptography & TLS', status: 'pending' },
            { name: 'SIEM aggregation (Splunk)', status: 'pending' }
        ],
        actions: [
            { task: 'Get CompTIA Security+ certified', priority: 'Critical', desc: 'Standard entry barrier for security operations center roles.' },
            { task: 'Build a private AD lab and compromise it', priority: 'High', desc: 'Hands-on practice with lateral movement mechanisms.' },
            { task: 'Learn Bash/Python automation scripting', priority: 'Medium', desc: 'Useful for automated parsing of firewalls.' }
        ]
    },
    'cld': {
        title: 'Cloud Engineer',
        score: 65,
        skills: [
            { name: 'Linux & OS foundations', status: 'completed' },
            { name: 'AWS core services (VPC, EC2)', status: 'completed' },
            { name: 'Docker Containerization', status: 'in-progress' },
            { name: 'Kubernetes Orchestration', status: 'pending' },
            { name: 'CI/CD pipeline configuration', status: 'pending' },
            { name: 'Infrastructure as Code (Terraform)', status: 'pending' }
        ],
        actions: [
            { task: 'Dockerize local web application', priority: 'Critical', desc: 'Fundamental step to understand image configuration.' },
            { task: 'Configure GitHub Actions CI/CD to AWS', priority: 'High', desc: 'Demonstrates build & deployment automation.' },
            { task: 'Study Terraform state & modules', priority: 'Medium', desc: 'Industry-standard infrastructure provisioning.' }
        ]
    }
};

function ReportAnalysis({ navigate, activeGoalId }) {
    const goalId = ['ai', 'ds', 'cyb', 'cld'].includes(activeGoalId) ? activeGoalId : 'ai';
    const report = READINESS_DB[goalId];

    const getPriorityColor = (prio) => {
        switch (prio) {
            case 'Critical': return 'bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.15)]';
            case 'High': return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
            case 'Medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
            default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-12 relative z-10 animate-fade-in-up pb-20">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-4 bg-slate-900 dark:bg-blue-600 rounded-sm mb-6 shadow-lg">
                    <FileText size={32} className="text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">
                    Career Health Report
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                    Diagnostic check-up of your readiness profile for: <span className="text-[var(--c-primary)] font-black uppercase">{report.title}</span>.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {/* Score Panel */}
                <div className="glass-panel p-6 sm:p-8 rounded-sm border border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Readiness Index</h3>
                    <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                        <div className="absolute inset-0 rounded-full border-8 border-slate-200 dark:border-slate-800"></div>
                        <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-[var(--c-primary)] border-r-[var(--c-primary)] transform -rotate-45"></div>
                        <span className="text-4xl font-black text-slate-900 dark:text-white">{report.score}%</span>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-500">Tier-2 Ready</span>
                </div>

                {/* Skill diagnostics */}
                <div className="md:col-span-2 glass-panel p-6 sm:p-8 rounded-sm border border-slate-300 dark:border-slate-800 space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b dark:border-slate-800 pb-3 flex items-center">
                        <Activity size={16} className="mr-2 text-cyan-500" /> Skill Audit Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {report.skills.map((skill, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-300">{skill.name}</span>
                                <span className={`px-2 py-1 rounded-sm text-[8px] font-black uppercase tracking-wider border ${
                                    skill.status === 'completed'
                                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                        : skill.status === 'in-progress'
                                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                        : 'bg-slate-500/10 text-slate-400 border-slate-700'
                                }`}>
                                    {skill.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Prescribed Actions */}
            <div className="glass-panel p-6 sm:p-8 rounded-sm border border-slate-300 dark:border-slate-800 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b dark:border-slate-800 pb-3 flex items-center">
                    <AlertTriangle size={16} className="mr-2 text-rose-500" /> Prioritized Action Items
                </h3>
                <div className="space-y-4">
                    {report.actions.map((act, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1">
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{act.task}</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">{act.desc}</p>
                            </div>
                            <span className={`px-3 py-1 border rounded-sm text-[8px] font-black uppercase tracking-widest ${getPriorityColor(act.priority)}`}>
                                {act.priority}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
function AIAssistant() {
    const { user } = useAuth();
    const [messages, setMessages] = useState([{
        role: 'assistant',
        content: "Hi! I'm your career navigator. Ask me anything about skills, learning resources, project ideas, or preparation strategies."
    }]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (user) {
            async function loadHistory() {
                try {
                    const history = await getChatHistory(user.uid);
                    if (history.length > 0) {
                        setMessages(history);
                    }
                } catch (error) {
                    console.error("Failed to load chat history:", error);
                }
            }
            loadHistory();
        }
    }, [user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSend = async (text) => {
        const userMsg = text || input;
        if (!userMsg.trim() || !user) return;

        const newUserMsg = { role: 'user', content: userMsg };
        setMessages(prev => [...prev, newUserMsg]);
        setInput('');
        setIsTyping(true);

        await saveChatMessage(user.uid, newUserMsg);

        try {
            const response = await fetch("https://mani-359-deci-iq-api.hf.space/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    decision: userMsg,
                    max_tokens: 600,
                    temperature: 0.4
                })
            });

            if (!response.ok) throw new Error("API Connection Failed");

            const data = await response.json();
            const aiResponse = data.response || "I'm sorry, I'm having trouble processing that right now.";

            const assistantMsg = { role: 'assistant', content: aiResponse };
            setMessages(prev => [...prev, assistantMsg]);
            await saveChatMessage(user.uid, assistantMsg);
        } catch (error) {
            console.error("AI Error:", error);
            const errorMsg = { role: 'assistant', content: "The career engine is currently cooling down. Please try again in a moment." };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const suggestedPrompts = [
        "Why is CAP theorem important in System Design?",
        "Suggest hands-on projects for Cloud Engineering.",
        "What is the difference between supervised and unsupervised learning?",
        "What certifications are valuable for a Cybersecurity path?"
    ];

    return (
        <div className="max-w-5xl mx-auto mt-4 relative z-10 h-[calc(100vh-10rem)] flex flex-col glass-panel border border-slate-300 dark:border-slate-800 rounded-sm shadow-xl overflow-hidden font-cyber-body">
            {/* Header */}
            <div className="bg-slate-900 p-5 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center space-x-4">
                    <div className="bg-blue-600 p-2.5 rounded-sm">
                        <Bot className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-white font-black text-sm uppercase tracking-widest">Full AI Guide</h2>
                        <div className="flex items-center space-x-1.5">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase">Live Guide Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/50 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-pop-in`}>
                        <div className={`flex items-start space-x-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                            <div className={`p-2 rounded-sm ${msg.role === 'user' ? 'bg-slate-900 dark:bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={`p-4 rounded-sm border text-sm font-semibold leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-slate-900 dark:bg-blue-600 border-slate-805 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-300'}`}>
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start animate-pulse">
                        <div className="flex items-start space-x-3">
                            <div className="p-2 rounded-sm bg-slate-200 dark:bg-slate-800 text-slate-500">
                                <Bot size={16} />
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-sm text-xs font-bold uppercase tracking-widest text-slate-400">
                                Navigator is planning...
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts Grid */}
            <div className="p-4 bg-slate-100/50 dark:bg-slate-950/20 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[9px] font-black uppercase text-slate-400 block mb-2">Suggested Inquiries</span>
                <div className="flex flex-wrap gap-2">
                    {suggestedPrompts.map((prompt, idx) => (
                        <button key={idx} onClick={() => handleSend(prompt)} className="bg-white dark:bg-slate-900 hover:border-[var(--c-primary)] dark:hover:border-[var(--c-primary)] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all">
                            {prompt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Bar */}
            <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask the Decision IQ career engine..."
                        className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-sm p-4 text-sm font-semibold text-slate-900 dark:text-white focus:border-[var(--c-primary)] outline-none transition-all"
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={!input.trim()}
                        className="bg-slate-900 dark:bg-blue-600 text-white p-4 rounded-sm hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 transition-all border border-blue-500/30"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}