import React, { useState, useEffect, useRef, useMemo } from 'react';

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

    Github,

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

    const [currentView, setCurrentView] = useState('landing');

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [theme, setTheme] = useState('aurora');

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);



    // Navigation Handler

    const navigate = (view) => {

        setCurrentView(view);

        setIsMobileMenuOpen(false);

        window.scrollTo({ top: 0, behavior: 'smooth' });

    };



    const handleLogin = () => {

        setIsAuthenticated(true);

        navigate('dashboard');

    };



    const handleLogout = () => {

        setIsAuthenticated(false);

        navigate('landing');

    };



    return (

        <div data - theme= { theme } className = "relative min-h-screen bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 selection:bg-[rgba(var(--c-primary-rgb),0.2)] overflow-x-hidden transition-colors duration-500" >



            {/* --- FIXED GLOBAL BACKGROUND --- */ }

            < div className = "fixed inset-0 pointer-events-none z-0 overflow-hidden bg-white dark:bg-slate-950" >

                <div className="absolute top-[-10%] right-[5%] w-[70%] h-[90%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-300/80 dark:from-cyan-900/40 via-blue-500/60 dark:via-blue-900/30 to-transparent rounded-full blur-[120px] animate-float" />

                    <div className="absolute top-[-5%] right-[-15%] w-[45%] h-[80%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-400/70 dark:from-fuchsia-900/40 via-pink-400/50 dark:via-pink-900/30 to-transparent rounded-full blur-[140px] animate-float-reverse" />

                        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[60%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-100/60 dark:from-slate-900/60 via-blue-50/40 dark:via-slate-800/40 to-transparent rounded-full blur-[100px] animate-float" />

                            </div>



    {/* GLOBAL STYLES & ANIMATIONS */ }

    <style dangerouslySetInnerHTML={
        {
            __html: `

        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@300;400;500;600;700;800;900&family=RocknRoll+One&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');

        body { font-family: 'Noto Sans Mono', monospace; }

        

        .font-rocknroll { font-family: 'RocknRoll One', sans-serif; letter-spacing: 0.02em; }

        .font-cyber-body { font-family: 'Space Mono', monospace; }



        /* --- THEMES --- */

        :root, [data-theme="aurora"] {

          --c-primary: #2563eb;

          --c-primary-light: #60a5fa;

          --c-primary-dark: #1d4ed8;

          --c-primary-rgb: 37, 99, 235;

          --c-secondary: #db2777;

          --c-secondary-dark: #be185d;

          --c-secondary-rgb: 219, 39, 119;

          --c-accent: #06b6d4;

        }

        [data-theme="dark"] {

          --c-primary: #3b82f6;

          --c-primary-light: #60a5fa;

          --c-primary-dark: #2563eb;

          --c-primary-rgb: 59, 130, 246;

          --c-secondary: #f43f5e;

          --c-secondary-dark: #e11d48;

          --c-secondary-rgb: 244, 63, 94;

          --c-accent: #2dd4bf;

          background-color: #020617;

          color: #f1f5f9;

        }

        [data-theme="sunset"] {

          --c-primary: #ea580c;

          --c-primary-light: #fb923c;

          --c-primary-dark: #c2410c;

          --c-primary-rgb: 234, 88, 12;

          --c-secondary: #e11d48;

          --c-secondary-dark: #be123c;

          --c-secondary-rgb: 225, 29, 72;

          --c-accent: #f59e0b;

        }



        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

        @keyframes popIn { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }

        @keyframes float { 0%, 100% { transform: translate(0px, 0px); } 50% { transform: translate(10px, -20px); } }

        @keyframes swing { 0%, 100% { transform: rotate(1.5deg); } 50% { transform: rotate(-1.5deg); } }

        @keyframes scanner { 0% { transform: translateY(-100%); } 100% { transform: translateY(200%); } }



        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }

        .animate-pop-in { animation: popIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }

        .animate-float { animation: float 14s ease-in-out infinite; }

        .animate-swing { animation: swing 5s ease-in-out infinite; transform-origin: top center; }

        

        .glass-panel {

          background: rgba(255, 255, 255, 0.6);

          backdrop-filter: blur(20px);

          border: 1px solid rgba(255, 255, 255, 0.8);

          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08);

        }

        [data-theme="dark"] .glass-panel {

          background: rgba(15, 23, 42, 0.6);

          border: 1px solid rgba(255, 255, 255, 0.05);

          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.4);

        }

      `}
    } />



        < Navbar currentView = { currentView } navigate = { navigate } isAuthenticated = { isAuthenticated } onLogout = { handleLogout } theme = { theme } setTheme = { setTheme } isMobileMenuOpen = { isMobileMenuOpen } setIsMobileMenuOpen = { setIsMobileMenuOpen } />



            { isAuthenticated && <Sidebar currentView={ currentView } navigate = { navigate } isMobileMenuOpen = { isMobileMenuOpen } isSidebarOpen = { isSidebarOpen } setIsSidebarOpen = { setIsSidebarOpen } />}



<main className={ `relative z-10 pt-24 pb-12 transition-all duration-500 w-full ${isAuthenticated && isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}` }>

    { currentView === 'landing' && <LandingPage navigate={ navigate } />}

{ currentView === 'dashboard' && <Dashboard navigate={ navigate } /> }

{ currentView === 'goal-overview' && <GoalOverview navigate={ navigate } /> }

{ currentView === 'career-roadmap' && <Roadmap /> }

{ currentView === 'saved-paths' && <SavedPaths navigate={ navigate } /> }

{ currentView === 'profile' && <ProfileView navigate={ navigate } /> }

{ currentView === 'settings' && <SettingsView theme={ theme } setTheme = { setTheme } />}

{ currentView === 'assistant' && <AIAssistant /> }

{ currentView === 'login' && <AuthPage onLogin={ handleLogin } /> }

{ currentView === 'analyzer' && <DecisionAnalyzer navigate={ navigate } /> }

{ currentView === 'risk' && <RiskAnalyzer navigate={ navigate } /> }

{ currentView === 'recommendations' && <Recommendations navigate={ navigate } /> }

{ currentView === 'report' && <ReportAnalysis navigate={ navigate } /> }

</main>



{/* Floating AI Chatbot - Visible ONLY after login */ }

{ isAuthenticated && <FloatingChatbot /> }

</div>

  );

}



// --- NAVLINK COMPONENT ---

function NavLink({ active, onClick, text, className }) {

    return (

        <button

      onClick= { onClick }

    className = {`relative px-4 py-2 transition-colors duration-200 font-bold uppercase tracking-widest text-[10px] ${active ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-[var(--c-primary)]'

        } ${className || ''}`
}

    >

    { text }

{
    active && (

        <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[var(--c-primary)] rounded-full animate-pop-in" />

      )
}

</button>

  );

}



// --- NAVIGATION COMPONENT ---

function Navbar({ currentView, navigate, isAuthenticated, onLogout, theme, setTheme, isMobileMenuOpen, setIsMobileMenuOpen }) {

    const [isProfileOpen, setIsProfileOpen] = useState(false);



    return (

        <nav className= "fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-300 dark:border-slate-800 shadow-sm transition-all duration-300 font-cyber-body" >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >

            <div className="flex justify-between items-center h-20" >

                <div className="flex items-center space-x-8" >

                    <div className="flex items-center space-x-3 cursor-pointer group" onClick = {() => navigate(isAuthenticated ? 'dashboard' : 'landing')
}>

    <div className="bg-slate-900 dark:bg-blue-600 p-2 rounded-sm shadow-[4px_4px_0px_rgba(15,23,42,0.1)] transition-all" >

        <Layers className="w-5 h-5 text-white" />

            </div>

            < span className = "text-xl font-rocknroll tracking-tight text-slate-900 dark:text-white uppercase" >

                Decision < span className = "text-[var(--c-primary)]" > IQ AI </span>

                    </span>

                    </div>

                    </div>



                    < div className = "flex items-center space-x-4" >

                        {!isAuthenticated ? (

                            <div className= "flex items-center space-x-3" >

                            <button onClick={ () => navigate('login') } className = "hidden md:block text-slate-600 dark:text-slate-400 hover:text-[var(--c-primary)] font-bold uppercase text-[11px] tracking-widest" > Sign In </button>

                                < button onClick = {() => navigate('login')} className = "bg-slate-900 dark:bg-blue-600 text-white px-5 py-2 rounded-sm font-bold text-[11px] uppercase tracking-widest" > Register </button>

                                    </div>

            ) : (

    <div className= "relative" >

    <button onClick={ () => setIsProfileOpen(!isProfileOpen) } className = "flex items-center space-x-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-sm transition-all" >

        <User size={ 16 } className = "text-[var(--c-primary)]" />

            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300" > Profile </span>

                < ChevronDown size = { 14} className = "text-slate-500" />

                    </button>

{
    isProfileOpen && (

        <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-sm shadow-xl z-50 py-2 animate-pop-in" >

            <button onClick={ () => { navigate('profile'); setIsProfileOpen(false); } } className = "flex items-center px-4 py-2.5 text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 w-full text-left" > <User size={ 14 } className = "mr-3" /> Profile </button>

                < button onClick = {() => { navigate('settings'); setIsProfileOpen(false); }
} className = "flex items-center px-4 py-2.5 text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 w-full text-left" > <SettingsIcon size={ 14 } className = "mr-3" /> Settings </button>

    < div className = "h-px bg-slate-200 dark:bg-slate-800 my-1" > </div>

        < button onClick = {() => { onLogout(); setIsProfileOpen(false); }} className = "flex items-center px-4 py-2.5 text-[10px] font-bold uppercase text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left" > <LogOut size={ 14 } className = "mr-3" /> Logout </button>

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

function Sidebar({ currentView, navigate, isMobileMenuOpen, isSidebarOpen, setIsSidebarOpen }) {

    return (

        <aside className= {`fixed top-20 left-0 w-64 h-[calc(100vh-5rem)] glass-panel border-r border-slate-200/60 dark:border-slate-800/60 z-40 transform transition-transform duration-500 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isSidebarOpen ? 'md:translate-x-0' : 'md:-translate-x-full'}`
}>

    <button onClick={ () => setIsSidebarOpen(!isSidebarOpen) } className = "hidden md:flex absolute -right-[41px] top-6 w-10 h-14 bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 border-l-0 rounded-r-sm items-center justify-center text-slate-500 hover:text-[var(--c-primary)] transition-all z-50" >

        { isSidebarOpen?<ChevronLeft size = { 20 } /> : <ChevronRight size={ 20 } />}

</button>

    < div className = "flex flex-col p-6 space-y-3 h-full overflow-y-auto" >

        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2" > Navigation </h3>

            < SidebarLink active = { currentView === 'dashboard'} onClick = {() => navigate('dashboard')} icon = {< Activity size = { 18} />} text = "Dashboard" />

                <SidebarLink active={ currentView === 'goal-overview' } onClick = {() => navigate('goal-overview')} icon = {< Target size = { 18} />} text = "Goal Overview" />

                    <SidebarLink active={ currentView === 'career-roadmap' } onClick = {() => navigate('career-roadmap')} icon = {< Map size = { 18} />} text = "Career Roadmap" />

                        <SidebarLink active={ currentView === 'saved-paths' } onClick = {() => navigate('saved-paths')} icon = {< Bookmark size = { 18} />} text = "Saved Paths" />



                            <div className="h-px bg-slate-200/60 dark:bg-slate-800/60 my-2" > </div>

                                < h3 className = "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2 pt-2" > Advanced Tools </h3>

                                    < SidebarLink active = { currentView === 'analyzer'} onClick = {() => navigate('analyzer')} icon = {< GitCompare size = { 18} />} text = "Analyzer" />

                                        <SidebarLink active={ currentView === 'risk' } onClick = {() => navigate('risk')} icon = {< ShieldAlert size = { 18} />} text = "Risk" />

                                            <SidebarLink active={ currentView === 'recommendations' } onClick = {() => navigate('recommendations')} icon = {< Star size = { 18} />} text = "Recommendations" />

                                                <SidebarLink active={ currentView === 'report' } onClick = {() => navigate('report')} icon = {< FileText size = { 18} />} text = "Report" />

                                                    <SidebarLink active={ currentView === 'assistant' } onClick = {() => navigate('assistant')} icon = {< Bot size = { 18} />} text = "AI Guide" />



                                                        <div className="h-px bg-slate-200/60 dark:bg-slate-800/60 my-2" > </div>

                                                            < h3 className = "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2 pt-2" > Account </h3>

                                                                < SidebarLink active = { currentView === 'profile'} onClick = {() => navigate('profile')} icon = {< User size = { 18} />} text = "Profile" />

                                                                    <SidebarLink active={ currentView === 'settings' } onClick = {() => navigate('settings')} icon = {< SettingsIcon size = { 18} />} text = "Settings" />

                                                                        </div>

                                                                        </aside>

  );

}



function SidebarLink({ active, onClick, icon, text }) {

    return (

        <button onClick= { onClick } className = {`flex items-center space-x-3 px-4 py-3.5 rounded-sm transition-all w-full ${active ? 'bg-gradient-to-r from-[var(--c-primary)] to-[var(--c-secondary)] text-white shadow-md transform translate-x-[2px]' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'}`
}>

    { icon }

    < span className = "font-bold uppercase tracking-widest text-[11px]" > { text } </span>

        </button>

  );

}



// --- LANDING PAGE ---

function LandingPage({ navigate }) {

    return (

        <div className= "min-h-[calc(100vh-6rem)] flex flex-col justify-center text-center font-cyber-body pt-8 pb-20" >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full" >

            <div className="flex flex-col items-center justify-center relative z-20 border-y border-slate-300 dark:border-slate-800 py-16 md:py-24" >

                <div className="flex items-center space-x-3 mb-6 animate-fade-in-up" >

                    <div className="w-2 h-2 bg-[var(--c-primary)]" />

                        <h2 className="text-xs md:text-sm font-black tracking-[0.2em] text-[var(--c-primary)] uppercase" > Your Intelligent Career Navigation System </h2>

                            < div className = "w-2 h-2 bg-[var(--c-primary)]" />

                                </div>

                                < h1 className = "text-5xl sm:text-6xl md:text-[6.5rem] lg:text-[8rem] font-rocknroll mb-8 leading-[0.85] text-slate-900 dark:text-white uppercase animate-fade-in-up delay-100 flex flex-col items-center tracking-wide" >

                                    <span>DECISION </span>

                                    < span > IQ AI </span>

                                        </h1>

                                        < p className = "text-sm md:text-base text-slate-600 dark:text-slate-400 mb-10 max-w-2xl font-bold animate-fade-in-up delay-200" >

                                            An AI - powered platform that guides B.Tech students towards suitable career paths using intelligent recommendations, roadmaps, and an AI assistant.

    </p>

        < div className = "flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300" >

            <button onClick={ () => navigate('login') } className = "bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 text-white px-10 py-4 rounded-sm font-bold text-[11px] uppercase tracking-widest shadow-[4px_4px_0px_rgba(234,88,12,1)]" > Get Started </button>

                < button onClick = {() => navigate('goal-overview')
} className = "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 text-slate-900 dark:text-white px-10 py-4 rounded-sm font-bold text-[11px] uppercase tracking-widest" > Learn More </button>

    </div>

    </div>

    </div>

    </div>

  );

}



// --- DASHBOARD COMPONENT ---

function Dashboard({ navigate }) {

    return (

        <div className= "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 relative z-10" >

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4" >

            <div className="animate-fade-in-up" >

                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight" > Welcome Back, Alex 👋</h1>

                    < p className = "text-slate-600 dark:text-slate-400 font-medium" > Based on your patterns, you are highly analytical and goal - oriented.</p>

                        </div>

                        < button onClick = {() => navigate('assistant')
} className = "glass-panel text-[var(--c-primary)] px-5 py-2.5 rounded-sm font-bold text-sm uppercase tracking-wider flex items-center space-x-2 transition-all hover:-translate-y-1" >

    <Sparkles size={ 16 } /><span>Daily Insights</span >

        </button>

        </div>



        < div className = "grid grid-cols-1 lg:grid-cols-3 gap-8" >

            <div className="lg:col-span-2 space-y-8" >

                <div className="glass-panel p-8 relative overflow-hidden animate-fade-in-up delay-100 rounded-sm" >

                    <div className="absolute top-0 right-0 p-8 opacity-10" > <Target size={ 180 } className = "text-[var(--c-primary)]" /> </div>

                        < div className = "relative z-10" >

                            <div className="flex items-center space-x-4 mb-6" >

                                <div className="bg-gradient-to-br from-[var(--c-primary)] to-[var(--c-accent)] p-3 rounded-sm" > <Briefcase className="text-white" size = { 24} /> </div>

                                    < h2 className = "text-2xl font-black text-slate-900 dark:text-white tracking-tight" > Current Goal: AI Engineer </h2>

                                        </div>

                                        < div className = "mb-8 bg-slate-50/80 dark:bg-slate-800/40 p-6 rounded-sm border border-slate-200 dark:border-slate-700" >

                                            <div className="flex justify-between text-xs uppercase font-bold mb-3" > <span className="text-slate-500 dark:text-slate-400" > Overall Progress < /span><span className="text-[var(--c-primary)]">35%</span > </div>

                                                < div className = "w-full bg-slate-200 dark:bg-slate-700 rounded-sm h-3 overflow-hidden" >

                                                    <div className="bg-gradient-to-r from-[var(--c-primary)] to-[var(--c-secondary)] h-3" style = {{ width: '35%' }} />

                                                        </div>

                                                        </div>

                                                        < div className = "grid grid-cols-1 sm:grid-cols-2 gap-4" >

                                                            <button onClick={ () => navigate('career-roadmap') } className = "bg-slate-900 dark:bg-blue-600 text-white py-4 px-4 rounded-sm font-bold uppercase text-xs tracking-wider flex justify-center items-center space-x-2" > <Map size={ 18 } /><span>Full Roadmap</span > </button>

                                                                < button onClick = {() => navigate('assistant')} className = "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-4 px-4 rounded-sm font-bold uppercase text-xs tracking-wider flex justify-center items-center space-x-2 dark:text-white" > <Bot size={ 18 } className = "text-[var(--c-primary)]" /> <span>Ask AI Guide < /span></button >

                                                                    </div>

                                                                    </div>

                                                                    </div>

                                                                    </div>

                                                                    </div>

                                                                    </div>

  );

}



function InsightRow({ label, value, strength, color }) {

    return (

        <div>

        <div className= "flex justify-between text-[10px] mb-2 font-bold uppercase tracking-wider" > <span className="text-slate-500" > { label } < /span><span className="text-slate-900 dark:text-white">{value}</span > </div>

            < div className = "w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden" >

                <div className={ `${color} h-full` } style = {{ width: `${strength}%` }
} />

    </div>

    </div>

  );

}



function MilestoneItem({ title, status }) {

    return (

        <div className= "flex items-start space-x-3 p-3 rounded-sm hover:bg-white/60 dark:hover:bg-slate-800/60 border border-transparent transition-colors group" >

            { status === 'completed' ? <CheckCircle2 className="text-emerald-500 mt-0.5" size = { 18} /> :

    status === 'in-progress' ? <div className="w-4 h-4 rounded-sm border-2 border-[var(--c-primary)] border-t-transparent animate-spin mt-1" /> :

    <div className="w-4 h-4 rounded-sm border-2 border-slate-300 dark:border-slate-700 mt-1" />}

<span className={ `text-[11px] font-semibold ${status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'}` }> { title } </span>

    </div>

  );

}



// --- ROADMAP COMPONENT ---

function Roadmap() {

    const nodes = [

        { id: 's1', title: 'B.Tech', status: 'completed', icon: <Award size={ 18} />, details: { resources: ['University Lectures', 'NPTEL'], certifications: ['Degree'], projects: ['Thesis'], notes: 'Engineering basics.' } },

{ id: 's2', title: 'Programming Basics', status: 'completed', icon: <Cpu size={ 18 } />, details: { resources: ['CS50'], certifications: ['None'], projects: ['Calculator'], notes: 'Loops & Logic.' } },

{ id: 's3', title: 'Python', status: 'completed', icon: <FileText size={ 18 } />, details: { resources: ['Real Python'], certifications: ['PCAP'], projects: ['Scraper'], notes: 'Fast coding.' } },

{ id: 's4', title: 'DSA', status: 'in-progress', icon: <Layers size={ 18 } />, details: { resources: ['NeetCode'], certifications: ['Coursera'], projects: ['Map Implementation'], notes: 'Solving complexity.' } },

{ id: 's5', title: 'Machine Learning', status: 'pending', icon: <BrainCircuit size={ 18 } />, details: { resources: ['Andrew Ng'], certifications: ['None'], projects: ['Predictor'], notes: 'Model training.' } },

{ id: 's6', title: 'AI Engineer', status: 'pending', icon: <Target size={ 18 } />, details: { resources: ['HuggingFace'], certifications: ['AWS ML'], projects: ['RAG Pipeline'], notes: 'Final Goal.' } }

  ];



const [activeNodeId, setActiveNodeId] = useState('s4');

const activeNode = nodes.find(n => n.id === activeNodeId);

const completionPercentage = 42;



return (

    <div className= "max-w-6xl mx-auto px-4 sm:px-6 mt-4 relative z-10 animate-fade-in-up" >

    <div className="text-center mb-12" >

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter" > Career Roadmap </h1>

            < p className = "text-slate-600 dark:text-slate-400 text-lg font-medium" > Detailed trajectory to AI Engineer.</p>

                < div className = "glass-panel p-6 rounded-sm max-w-2xl mx-auto shadow-md border-t-4 border-t-[var(--c-primary)] mt-8" >

                    <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3" > <span className="dark:text-slate-400" > Roadmap Completion < /span><span className="text-[var(--c-primary)]">{completionPercentage}%</span > </div>

                        < div className = "w-full bg-slate-200 dark:bg-slate-800 rounded-sm h-3 overflow-hidden shadow-inner" >

                            <div className="bg-gradient-to-r from-[var(--c-primary)] to-[var(--c-secondary)] h-full transition-all duration-1000" style = {{ width: `${completionPercentage}%` }} />

                                </div>

                                </div>

                                </div>



                                < div className = "grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12" >

                                    <div className="glass-panel p-8 rounded-sm shadow-lg border border-slate-300 dark:border-slate-800" >

                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b pb-3 mb-6" > Interactive Flow </h3>

                                            < div className = "relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-6" >

                                            {
                                                nodes.map((n, i) => (

                                                    <div key= { n.id } onClick = {() => setActiveNodeId(n.id)} className = {`relative pl-8 cursor-pointer transition-all ${activeNodeId === n.id ? 'scale-105' : 'hover:scale-105'}`}>

                                                        <div className={ `absolute -left-[11px] top-1.5 w-5 h-5 rounded-full border-[3px] z-10 ${n.status === 'completed' ? 'bg-emerald-500 border-white dark:border-slate-900' : n.status === 'in-progress' ? 'bg-[var(--c-primary)] border-white dark:border-slate-900 animate-pulse' : 'bg-slate-200 dark:bg-slate-800 border-white dark:border-slate-900'}` } />

                                                            < div className = {`p-4 rounded-sm border transition-all ${activeNodeId === n.id ? 'bg-white dark:bg-slate-800 shadow-md border-[var(--c-primary)]' : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'}`}>

                                                                <div className="flex items-center space-x-3" >

                                                                    <div className={ activeNodeId === n.id ? 'text-[var(--c-primary)]' : 'text-slate-500' }> { n.icon } </div>

                                                                        < span className = {`text-[10px] font-black uppercase tracking-widest ${n.status === 'pending' ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}> { n.title } </span>

                                                                            </div>

                                                                            </div>

                                                                            </div>

            ))}

</div>

    </div>

    < div className = "lg:col-span-2" >

        <div className="glass-panel p-8 rounded-sm shadow-xl border border-slate-300 dark:border-slate-800 h-full" >

            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-8 border-b pb-4" > { activeNode.title } </h2>

                < div className = "grid grid-cols-1 md:grid-cols-2 gap-6" >

                    <DetailsSection icon={
                        <BookOpen size={ 14 } />} title="Resources" list={activeNode.details.resources} / >

                            <DetailsSection icon={
                                <Award size={ 14 } />} title="Certifications" list={activeNode.details.certifications} / >

                                    <div className="md:col-span-2" > <DetailsSection icon={
                                        <Briefcase size={ 14 } />} title="Projects" list={activeNode.details.projects} grid / > </div>

                                            < div className = "md:col-span-2 bg-slate-900 dark:bg-slate-800 text-white p-6 rounded-sm shadow-md" >

                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center" > <FileText size={ 14 } className = "mr-2 text-[var(--c-primary)]" /> Notes </h4>

                                                    < p className = "text-xs leading-relaxed text-slate-300" > { activeNode.details.notes } </p>

                                                        </div>

                                                        </div>

                                                        </div>

                                                        </div>

                                                        </div>

                                                        </div>

  );

        }



        function DetailsSection({ icon, title, list, grid }) {

            return (

                <div className= "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-sm shadow-sm group" >

                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center" > { icon } < span className = "ml-2" > { title } < /span></h4 >

                    <div className={ grid ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-3' }>

                    {
                        list.map((item, i) => (

                            <div key= { i } className = {`flex items-center text-xs font-bold text-slate-700 dark:text-slate-300 ${grid ? 'bg-slate-50 dark:bg-slate-800 p-3 border dark:border-slate-700 rounded-sm' : ''}`} >

                        {!grid && <ChevronRight size={ 14 } className = "mr-1 text-slate-300" />}

        { item }

        </div>

        ))
    }

    </div>

        </div>

  );

}



// --- SAVED PATHS COMPONENT ---

function SavedPaths({ navigate }) {

    const [paths, setPaths] = useState([

        { id: 1, title: 'AI Engineer', date: 'Saved on May 8, 2024', icon: <Bot size={ 24} />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },

{ id: 2, title: 'Data Scientist', date: 'Saved on May 7, 2024', icon: <LineChart size={ 24 } />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },

{ id: 3, title: 'Full Stack Developer', date: 'Saved on May 5, 2024', icon: <Briefcase size={ 24 } />, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' }

  ]);



const removePath = (id, e) => {

    e.stopPropagation();

    setPaths(paths.filter(p => p.id !== id));

};



return (

    <div className= "max-w-5xl mx-auto px-4 sm:px-6 mt-12 relative z-10 animate-fade-in-up" >

    <div className="text-center mb-12" >

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter" > Saved Paths </h1>

            < p className = "text-slate-600 dark:text-slate-400 text-lg font-medium" > Manage your stored career trajectories.</p>

                </div>



                < div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" >

                {
                    paths.map((path) => (

                        <div key= { path.id } onClick = {() => navigate('career-roadmap')} className = "glass-panel p-6 rounded-sm border border-slate-300 dark:border-slate-800 hover:border-[var(--c-primary)] shadow-md transition-all cursor-pointer group flex flex-col" >

                            <div className="flex items-start justify-between mb-6" >

                                <div className={ `p-4 rounded-sm border ${path.border} ${path.bg} ${path.color}` }> { path.icon } </div>

                                    < button onClick = {(e) => removePath(path.id, e)} className = "p-2 text-slate-400 hover:text-red-500 transition-all" > <Trash2 size={ 18 } /></button >

                                        </div>

                                        < h3 className = "text-xl font-black text-slate-900 dark:text-white mb-1" > { path.title } </h3>

                                            < p className = "text-[10px] font-black uppercase text-slate-400 mb-8" > { path.date } </p>

                                                < div className = "mt-auto pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center text-[10px] font-black uppercase text-[var(--c-primary)]" > Open Roadmap < ArrowRight size = { 12} className = "ml-2" /> </div>

                                                    </div>

        ))}

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

            { platform: "GitHub", handle: "@alexj_dev", icon: <Github size={ 16} />, status: "Verified" },

        { platform: "LeetCode", handle: "alex_codes_26", icon: <Code2 size={ 16 } />, status: "Verified"
},

{ platform: "Codeforces", handle: "alex_j", icon: <Globe size={ 16 } />, status: "Active" }

    ]

  };



return (

    <div className= "max-w-4xl mx-auto px-4 sm:px-6 mt-8 relative z-10 animate-fade-in-up" >

    <div className="text-center mb-10" >

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tighter" > User Profile </h1>

            </div>

            < div className = "grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12" >

                <div className="lg:col-span-1 space-y-6" >

                    <div className="glass-panel p-8 rounded-sm border border-slate-300 dark:border-slate-800 text-center relative overflow-hidden" >

                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--c-primary)] to-[var(--c-secondary)]" />

                            <div className="w-24 h-24 bg-slate-900 dark:bg-blue-600 rounded-sm mx-auto mb-6 flex items-center justify-center shadow-lg" > <User size={ 48 } className = "text-white" /> </div>

                                < h2 className = "text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight" > { user.name } </h2>

                                    < p className = "text-[10px] font-black uppercase text-[var(--c-primary)] mb-6" > Verified Student </p>

                                        </div>

                                        < div className = "glass-panel p-6 rounded-sm border border-slate-300 dark:border-slate-800" >

                                            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-5 flex items-center" > <Activity size={ 14 } className = "mr-2" /> Profiles </h3>

                                                < div className = "space-y-3" >

                                                {
                                                    user.codingProfiles.map((p, i) => (

                                                        <div key= { i } className = "flex items-center justify-between p-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-sm" >

                                                        <div className="flex items-center space-x-3" > <div className="text-slate-400" > { p.icon } < /div><span className="text-xs font-bold dark:text-white">{p.platform}</span > </div>

                                                    < span className = "text-[9px] font-black uppercase text-emerald-500" > { p.status } </span>

                                                    </div>

                                                    ))
                                                }

                                                    </div>

                                                    </div>

                                                    </div>

                                                    < div className = "lg:col-span-2 space-y-6" >

                                                        <div className="glass-panel p-8 rounded-sm border border-slate-300 dark:border-slate-800 shadow-lg" >

                                                            <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white border-b dark:border-slate-800 pb-4 mb-8 flex items-center" > <FileText size={ 18 } className = "mr-2 text-[var(--c-primary)]" /> Details </h3>

                                                                < div className = "grid grid-cols-1 md:grid-cols-2 gap-8" >

                                                                    <ProfileField label="Full Name" value = { user.name } />

                                                                        <ProfileField label="Email Address" value = { user.email } />

                                                                            <ProfileField label="Current Branch" value = { user.branch } />

                                                                                <ProfileField label="Completion Year" value = { user.year } />

                                                                                    <div className="md:col-span-2" > <ProfileField label="Active Goal" value = { user.goal } highlight /> </div>

                                                                                        </div>

                                                                                        </div>

                                                                                        </div>

                                                                                        </div>

                                                                                        </div>

  );

}



function ProfileField({ label, value, highlight }) {

    return (

        <div className= "space-y-2" >

        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400" > { label } </label>

            < div className = {`p-4 rounded-sm border dark:border-slate-700 ${highlight ? 'bg-slate-900 dark:bg-blue-900/20 text-white' : 'bg-white dark:bg-slate-800 dark:text-white'}`
}>

    <span className="font-bold text-sm uppercase" > { value } </span>

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

        <div className= "max-w-4xl mx-auto px-4 sm:px-6 mt-12 relative z-10 animate-fade-in-up pb-20" >

        <div className="text-center mb-12" >

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter" > Control Center </h1>

                < p className = "text-slate-600 dark:text-slate-400 text-lg font-medium" > Customize your DecisionIQ engine and account interface.</p>

                    </div>



                    < div className = "grid grid-cols-1 lg:grid-cols-4 gap-8" >

                        {/* Navigation Tabs */ }

                        < div className = "lg:col-span-1 space-y-2" >

                            <SettingsTab active={ activeTab === 'general' } onClick = {() => setActiveTab('general')
} icon = {< SettingsIcon size = { 16} />} label = "General" />

    <SettingsTab active={ activeTab === 'profile' } onClick = {() => setActiveTab('profile')} icon = {< User size = { 16} />} label = "Edit Profile" />

        <SettingsTab active={ activeTab === 'notifications' } onClick = {() => setActiveTab('notifications')} icon = {< Bell size = { 16} />} label = "Notifications" />

            <SettingsTab active={ activeTab === 'connections' } onClick = {() => setActiveTab('connections')} icon = {< Terminal size = { 16} />} label = "Connections" />

                </div>



{/* Content Area */ }

<div className="lg:col-span-3 space-y-8" >



    {/* Section: Theme Settings */ }

    < div className = "glass-panel p-8 rounded-sm border border-slate-300 dark:border-slate-800" >

        <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white mb-6 flex items-center" >

            <Sun size={ 18 } className = "mr-2 text-orange-500" /> Theme Settings

                </h3>

                < div className = "grid grid-cols-2 gap-4" >

                    <button 

                onClick={ () => setTheme('aurora') }

className = {`flex flex-col items-center justify-center p-6 border rounded-sm transition-all ${theme !== 'dark' ? 'border-[var(--c-primary)] bg-[var(--c-primary-rgb)]/5 shadow-md' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'}`}

              >

    <Sun className={ `mb-3 ${theme !== 'dark' ? 'text-[var(--c-primary)]' : 'text-slate-400'}` } />

        < span className = "text-[10px] font-black uppercase tracking-widest" > Light Mode </span>

            </button>

            < button

onClick = {() => setTheme('dark')}

className = {`flex flex-col items-center justify-center p-6 border rounded-sm transition-all ${theme === 'dark' ? 'border-[var(--c-primary)] bg-[var(--c-primary-rgb)]/5 shadow-md' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'}`}

              >

    <Moon className={ `mb-3 ${theme === 'dark' ? 'text-[var(--c-primary)]' : 'text-slate-400'}` } />

        < span className = "text-[10px] font-black uppercase tracking-widest" > Dark Mode </span>

            </button>

            </div>

            </div>



{/* Section: Edit Profile */ }

<div className="glass-panel p-8 rounded-sm border border-slate-300 dark:border-slate-800" >

    <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white mb-6 flex items-center" >

        <User size={ 18 } className = "mr-2 text-[var(--c-primary)]" /> Edit Profile

            </h3>

            < div className = "grid grid-cols-1 md:grid-cols-2 gap-6" >

                <SettingsField label="Full Name" val = { profileData.name } setVal = {(v) => setProfileData({ ...profileData, name: v })} />

                    < SettingsField label = "Email Address" val = { profileData.email } setVal = {(v) => setProfileData({ ...profileData, email: v })} />

                        < SettingsField label = "Branch" val = { profileData.branch } setVal = {(v) => setProfileData({ ...profileData, branch: v })} />

                            < SettingsField label = "Completion Year" val = { profileData.year } setVal = {(v) => setProfileData({ ...profileData, year: v })} />

                                </div>

                                < button className = "mt-8 bg-slate-900 dark:bg-blue-600 text-white px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-widest flex items-center space-x-2 shadow-lg hover:-translate-y-0.5 transition-all" >

                                    <Save size={ 16 } /><span>Update Profile</span >

                                        </button>

                                        </div>



{/* Section: Notification Settings */ }

<div className="glass-panel p-8 rounded-sm border border-slate-300 dark:border-slate-800" >

    <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white mb-6 flex items-center" >

        <Bell size={ 18 } className = "mr-2 text-pink-500" /> Notifications

            </h3>

            < div className = "space-y-4" >

                <NotificationToggle label="Email Alerts" desc = "Receive career match updates via email." active = { notifications.email } toggle = {() => setNotifications({ ...notifications, email: !notifications.email })} />

                    < NotificationToggle label = "Push Notifications" desc = "Get real-time roadmap notifications." active = { notifications.push } toggle = {() => setNotifications({ ...notifications, push: !notifications.push })} />

                        < NotificationToggle label = "Weekly Digest" desc = "Summary of market trends and skill gaps." active = { notifications.weekly } toggle = {() => setNotifications({ ...notifications, weekly: !notifications.weekly })} />

                            </div>

                            </div>



{/* Section: Connect Platforms */ }

<div className="glass-panel p-8 rounded-sm border border-slate-300 dark:border-slate-800" >

    <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white mb-6 flex items-center" >

        <Terminal size={ 18 } className = "mr-2 text-emerald-500" /> Connect Platforms

            </h3>

            < div className = "grid grid-cols-1 md:grid-cols-3 gap-4" >

                <ConnectRow icon={
                    <Github size={ 20 } />} label="GitHub" status="Connected" / >

                        <ConnectRow icon={
                            <Code2 size={ 20 } />} label="LeetCode" status="Connected" / >

                                <ConnectRow icon={
                                    <Terminal size={ 20 } />} label="HackerRank" status="Disconnected" / >

                                        </div>

                                        </div>



                                        </div>

                                        </div>

                                        </div>

  );

        }



        function SettingsTab({ active, onClick, icon, label }) {

            return (

                <button onClick= { onClick } className = {`w-full flex items-center space-x-3 px-4 py-3 rounded-sm font-bold text-xs uppercase tracking-widest transition-all ${active ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`
        }>

            { icon } < span > { label } </span>

            </button>

  );

    }



    function SettingsField({ label, val, setVal }) {

        return (

            <div className= "space-y-2" >

            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest" > { label } </label>

                < input type = "text" value = { val } onChange = {(e) => setVal(e.target.value)
    } className = "w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm p-3 text-sm font-bold text-slate-900 dark:text-white focus:border-[var(--c-primary)] outline-none transition-all shadow-sm" />

        </div>

  );

}



function NotificationToggle({ label, desc, active, toggle }) {

    return (

        <div className= "flex items-center justify-between p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-sm" >

        <div>

        <h4 className="text-xs font-bold dark:text-white" > { label } </h4>

            < p className = "text-[10px] text-slate-500" > { desc } </p>

                </div>

                < button onClick = { toggle } className = {`w-12 h-6 rounded-full relative transition-all duration-300 ${active ? 'bg-[var(--c-primary)]' : 'bg-slate-200 dark:bg-slate-700'}`
}>

    <div className={ `absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'left-7' : 'left-1'}` } />

        </button>

        </div>

  );

}



function ConnectRow({ icon, label, status }) {

    const isConnected = status === "Connected";

    return (

        <div className= "flex flex-col items-center p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm text-center shadow-sm" >

        <div className={ `mb-3 ${isConnected ? 'text-[var(--c-primary)]' : 'text-slate-400'}` }> { icon } </div>

            < h4 className = "text-xs font-bold dark:text-white mb-4" > { label } </h4>

                < button className = {`w-full py-2 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all ${isConnected ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-slate-900 dark:bg-blue-600 text-white shadow-sm'}`
}>

    { isConnected? 'Disconnect': 'Connect' }

    </button>

    </div>

  );

}



// --- GOAL OVERVIEW COMPONENT ---

function GoalOverview({ navigate }) {

    const [viewState, setViewState] = useState('tabs');

    const [activeTab, setActiveTab] = useState('ai');

    const [selectedGoal, setSelectedGoal] = useState(null);

    const [isSaved, setIsSaved] = useState(false);



    const careerDatabase = [

        { id: 'ai', title: 'AI Engineer', icon: <Bot size={ 28} />, salary: '$130k - $180k', demand: 'Very High', duration: '6-8 Months', skills: ['Python', 'PyTorch', 'Neural Networks'], match: 98, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },

{ id: 'ds', title: 'Data Scientist', icon: <LineChart size={ 28 }/>, salary: '$110k - $150k', demand: 'High', duration: '5-7 Months', skills: ['Python', 'SQL', 'Stats'], match: 92, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },

{ id: 'cyb', title: 'Cybersecurity', icon: <ShieldAlert size={ 28 }/>, salary: '$120k - $160k', demand: 'Very High', duration: '6-9 Months', skills: ['Linux', 'Networking', 'Hacking'], match: 75, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },

{ id: 'cld', title: 'Cloud Engineer', icon: <Cloud size={ 28 }/>, salary: '$115k - $155k', demand: 'High', duration: '4-6 Months', skills: ['AWS', 'Docker', 'Kubernetes'], match: 80, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' }

  ];



const handleAI = () => {

    setViewState('analyzing');

    setTimeout(() => { setSelectedGoal(careerDatabase[0]); setViewState('insights'); }, 3000);

};



const handleSave = () => {

    setIsSaved(true);

    setTimeout(() => navigate('dashboard'), 1500);

};



if (viewState === 'analyzing') return (

    <div className= "max-w-3xl mx-auto px-4 mt-32 text-center animate-fade-in-up" >

    <div className="flex flex-col items-center justify-center space-y-6" >

        <div className="relative w-32 h-32 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-full flex items-center justify-center overflow-hidden" >

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(var(--c-primary-rgb),0.2)] to-transparent w-full h-[30px] animate-[scanner_1.5s_linear_infinite]" />

                <Cpu className="text-[var(--c-primary)] animate-pulse" size = { 56} />

                    </div>

                    < h2 className = "text-3xl font-black text-slate-900 dark:text-white uppercase" > Analyzing Profile </h2>

                        < p className = "text-slate-500 font-bold text-sm uppercase flex items-center space-x-2" > <Loader2 size={ 16 } className = "animate-spin text-[var(--c-primary)]" /> <span>Scanning skills...</span></p >

                            </div>

                            </div>

  );



if (viewState === 'insights' && selectedGoal) return (

    <div className= "max-w-4xl mx-auto px-4 sm:px-6 mt-12 relative animate-fade-in-up" >

    <button onClick={ () => setViewState('tabs') } className = "flex items-center space-x-2 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold text-xs uppercase mb-8 transition-colors" > <ArrowLeft size={ 16 } /><span>Back</span > </button>

        < div className = "glass-panel border-t-4 border-t-[var(--c-primary)] p-8 sm:p-10 shadow-xl" >

            <div className="flex justify-between items-center mb-10" >

                <div className="flex items-center space-x-5" >

                    <div className={ `p-4 rounded-sm border ${selectedGoal.border} ${selectedGoal.bg} ${selectedGoal.color}` }> { selectedGoal.icon } </div>

                        < h1 className = "text-3xl font-black text-slate-900 dark:text-white tracking-tighter" > { selectedGoal.title } </h1>

                            </div>

                            < div className = "bg-[rgba(var(--c-primary-rgb),0.1)] px-5 py-2.5 rounded-full font-black text-sm uppercase tracking-widest text-[var(--c-primary-dark)]" > <Sparkles size={ 16 } className = "inline mr-2" /> { selectedGoal.match } % Match </div>

                                </div>

                                < div className = "grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10" >

                                    <StatBox icon={
                                        <DollarSign size={ 16 } />} label="Salary" val={selectedGoal.salary} / >

                                            <StatBox icon={
                                                <TrendingUp size={ 16 } />} label="Demand" val={selectedGoal.demand} / >

                                                    <StatBox icon={
                                                        <Clock size={ 16 } />} label="Duration" val={selectedGoal.duration} / >

                                                            </div>

                                                            < h3 className = "text-[10px] font-black uppercase text-slate-400 border-b dark:border-slate-800 pb-3 mb-6" > Required Skills </h3>

                                                                < div className = "flex flex-wrap gap-3 mb-10" >

                                                                    { selectedGoal.skills.map((s, i) => <div key={ i } className = "bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-sm text-[10px] font-bold shadow-sm flex items-center" > <Wrench size={ 14} className = "mr-2 opacity-50" /> { s } </div>) }

                                                                    </div>

                                                                    < button onClick = { handleSave } disabled = { isSaved } className = {`w-full py-4 rounded-sm font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-3 ${isSaved ? 'bg-emerald-500 text-white' : 'bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 text-white shadow-md'}`
        }>

            { isSaved?<Check size = { 20 } /> : <Bookmark size={ 20 } />}<span>{isSaved ? 'Path Saved' : 'Save Career Path'}</span >

                </button>

                </div>

                </div>

  );



        return (

            <div className= "max-w-5xl mx-auto px-4 sm:px-6 mt-12 relative z-10 animate-fade-in-up" >

            <div className="text-center mb-12" >

                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter" > Goal Overview </h1>

                    < p className = "text-slate-600 dark:text-slate-400 text-lg font-medium" > Set your target manually or let AI decide.</p>

                        </div>

                        < div className = "glass-panel rounded-sm overflow-hidden shadow-xl border border-slate-300 dark:border-slate-800" >

                            <div className="flex border-b dark:border-slate-800" >

                                <TabBtn active={ activeTab === 'ai' } onClick = {() => setActiveTab('ai')
    } icon = {< BrainCircuit size = { 18} />} label = "AI Recommendation" />

        <TabBtn active={ activeTab === 'manual' } onClick = {() => setActiveTab('manual')} icon = {< Search size = { 18} />} label = "Set Goal Manually" />

            </div>

            < div className = "p-8 sm:p-12 text-center" >

                { activeTab === 'ai' ? (

                    <div className= "animate-fade-in-up max-w-lg mx-auto" >

            <div className="inline-flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-full mb-8" > <Target className="w-12 h-12 text-[var(--c-primary)]" /> </div>

                < p className = "text-slate-600 dark:text-slate-400 font-medium mb-10" > We evaluate your skills and activity data against market matrices to find your perfect match.</p>

                    < button onClick = { handleAI } className = "bg-slate-900 dark:bg-blue-600 text-white px-10 py-5 rounded-sm font-bold uppercase text-[11px] tracking-widest shadow-md" > Generate Recommendation </button>

                        </div>

          ) : (

    <div className= "grid grid-cols-1 sm:grid-cols-2 gap-4 text-left" >

    {
        careerDatabase.map(c => (

            <button key= { c.id } onClick = {() => { setSelectedGoal(c); setViewState('insights'); }} className = "flex items-center p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[var(--c-primary)] transition-all group" >

                <div className={ `p-3 border ${c.border} ${c.bg} ${c.color} mr-4` }> { c.icon } </div>

                    < div > <h4 className="font-bold text-slate-900 dark:text-white text-lg" > { c.title } < /h4><p className="text-[10px] font-black uppercase text-slate-400">{c.demand} Demand</p > </div>

                        < ChevronRight size = { 20} className = "ml-auto text-slate-200 dark:text-slate-700 group-hover:text-[var(--c-primary)]" />

                            </button>

              ))}

</div>

          )}

</div>

    </div>

    </div>

  );

}



// --- AUTHENTICATION COMPONENT ---

function AuthPage({ onLogin }) {

    const [isLogin, setIsLogin] = useState(true);

    const [isFlipping, setIsFlipping] = useState(false);

    const [otpSent, setOtpSent] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);



    const handleToggle = (mode) => {

        if (isLogin === mode) return;

        setIsFlipping(true);

        setTimeout(() => { setIsLogin(mode); setOtpSent(false); setIsFlipping(false); }, 800);

    };



    const handleSubmit = (e) => {

        e.preventDefault();

        if (isLogin) {

            onLogin();

        } else {

            if (!otpSent) {

                setIsProcessing(true);

                setTimeout(() => { setOtpSent(true); setIsProcessing(false); }, 1200);

            } else {

                setIsProcessing(true);

                setTimeout(() => { setIsProcessing(false); setIsFlipping(true); setTimeout(() => { setIsLogin(true); setOtpSent(false); setIsFlipping(false); }, 800); }, 1500);

            }

        }

    };



    return (

        <div className= "min-h-[calc(100vh-6rem)] flex flex-col items-center justify-start px-4 sm:px-6 relative z-10 pt-4 pb-12 overflow-y-auto" >

        <div className="w-full max-w-lg flex flex-col items-center animate-swing -mt-24" >

            <div className="flex justify-center w-full h-[140px] sm:h-[200px] -mb-1 z-0 relative" >

                <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-slate-400 to-[var(--c-primary)] shadow-[0_0_8px_rgba(var(--c-primary-rgb),0.6)]" />

                    </div>

                    < div className = "w-full relative z-50" style = {{ perspective: '1200px' }
}>

    <div className="glass-panel rounded-sm p-6 sm:p-10 relative z-50 shadow-xl border border-slate-300 dark:border-slate-800" style = {{ transform: isFlipping ? 'rotateY(90deg)' : 'rotateY(0deg)', transition: 'transform 0.8s ease-in-out, opacity 0.8s ease-in-out', opacity: isFlipping ? 0.3 : 1, transformStyle: 'preserve-3d', background: 'rgba(255, 255, 255, 0.95)' }}>

        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 flex justify-center z-20" > <div className="w-6 h-6 bg-slate-100 border border-slate-300 border-b-0 rounded-t-sm flex items-center justify-center" > <div className="w-2 h-2 bg-slate-800 rounded-full shadow-inner" /> </div></div >

            <div className="relative z-10 pt-2" >

                <div className="text-center mb-8 flex flex-col items-center" >

                    <div className="inline-flex bg-white border border-slate-200 p-3 rounded-sm mb-4 shadow-sm" > <Layers className="w-6 h-6 text-[var(--c-primary)]" /> </div>

                        < h2 className = "text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 uppercase tracking-tighter" > { isLogin? 'Welcome Back': otpSent ? 'Verify Identity' : 'Get Started' } </h2>

                            < p className = "text-slate-500 font-semibold text-xs sm:text-sm mt-1 px-4" > { isLogin? 'Enter your credentials to access the engine.': otpSent ? 'We sent a 6-digit code to your email.' : 'Register to start engineering your career path today.' } </p>

                                </div>

                                < form onSubmit = { handleSubmit } className = "space-y-4" >

                                    { isLogin && (

                                        <>

                                        <AuthField label="Email Address" icon = {< Mail className = "h-4 w-4 text-slate-400" />} type = "email" placeholder = "you@example.com" />

                                            <div className="animate-fade-in-up delay-100" >

                                                <div className="flex items-center justify-between mb-1.5" > <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500" > Password < /label><a href="#" className="text-[10px] font-black text-[var(--c-primary)] hover:underline uppercase tracking-wider">Forgot?</a > </div>

                                                    < div className = "relative" > <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center" > <Lock className="h-4 w-4 text-slate-400" /> </div><input required type="password" className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-sm text-slate-900 font-bold text-sm placeholder-slate-400 focus:outline-none focus:border-[var(--c-primary)] focus:ring-2 focus:ring-[rgba(var(--c-primary-rgb),0.1)] transition-colors shadow-sm" placeholder="••••••••" / > </div>

                                                        </div>

                                                        </>

                )}

{
    !isLogin && !otpSent && (

        <div className="space-y-4 animate-fade-in-up" >

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" >

                <AuthField label="Full Name" icon = {< User className = "h-4 w-4 text-slate-400" />} placeholder = "Alex Johnson" />

                    <AuthField label="Email Address" icon = {< Mail className = "h-4 w-4 text-slate-400" />} type = "email" placeholder = "alex@example.com" />

                        </div>

                        < div className = "grid grid-cols-1 sm:grid-cols-2 gap-4" >

                            <AuthField label="Study Branch" icon = {< BookOpen className = "h-4 w-4 text-slate-400" />} placeholder = "e.g. Computer Science" />

                                <div>

                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5" > Completion Year </label>

                                    < div className = "relative" > <div className="absolute inset-y-0 left-0 pl-3 flex items-center" > <Calendar className="h-4 w-4 text-slate-400" /> </div><select required className="block w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-sm text-slate-900 font-bold text-sm focus:outline-none focus:border-[var(--c-primary)] appearance-none cursor-pointer"><option value="" disabled selected>Select Year</option > <option>2024 < /option><option>2025</option > <option>2026 < /option></select > </div>

                                        </div>

                                        </div>

                                        < div className = "grid grid-cols-1 sm:grid-cols-2 gap-4" >

                                            <AuthField label="Password" icon = {< Lock className = "h-4 w-4 text-slate-400" />} type = "password" placeholder = "••••••••" />

                                                <AuthField label="Confirm Password" icon = {< ShieldCheck className = "h-4 w-4 text-slate-400" />} type = "password" placeholder = "••••••••" />

                                                    </div>

                                                    </div>

                )}

{
    !isLogin && otpSent && (

        <div className="animate-fade-in-up bg-white p-6 rounded-sm border border-slate-200 shadow-inner" >

            <div className="flex justify-between items-center mb-4" > <label className="block text-[11px] font-black uppercase tracking-widest text-slate-700" > Verification Code < /label><button type="button" onClick={() => setOtpSent(false)} className="text-[10px] font-black uppercase text-[var(--c-primary)]">Edit</button > </div>

                < div className = "flex justify-center space-x-2 sm:space-x-3" > { [1, 2, 3, 4, 5, 6].map(i => <input key={ i } required maxLength = { 1} className = "w-10 h-12 text-center text-xl font-black bg-white border border-slate-300 rounded-sm focus:border-[var(--c-primary)]" />) } </div>

                    </div>

                )
}

<div className="pt-2 text-center" >

    <span className="text-slate-500 font-semibold text-xs" > { isLogin? "New to the engine? ": "Already registered? " } </span>

        < button type = "button" onClick = {() => handleToggle(!isLogin)} disabled = { isProcessing } className = "text-[var(--c-primary)] hover:text-slate-900 font-black uppercase tracking-wider text-xs ml-1 disabled:opacity-50" > { isLogin? 'Sign up': 'Sign in' } </button>

            </div>

            < button type = "submit" disabled = { isProcessing } className = "w-full mt-4 flex items-center justify-center space-x-3 bg-slate-900 hover:bg-slate-800 text-white pl-8 pr-2 py-3 rounded-sm font-bold text-xs uppercase tracking-wider transition-all shadow-md group disabled:opacity-70" >

                { isProcessing?<>< Loader2 size = { 16} className = "animate-spin text-[var(--c-primary)]" /> <span>Processing...</span></ > : <>{ isLogin? 'Sign In': otpSent ? 'Verify & Register' : 'Send OTP' } < div className = "bg-white text-slate-900 p-1.5 rounded-sm group-hover:bg-[var(--c-primary)] group-hover:text-white transition-all transform group-hover:translate-x-1" > { otpSent?<CheckCircle2 size = { 14 } /> : <ArrowRight size={ 14 } />}</div > </>}

</button>

    </form>

    </div>

    </div>

    </div>

    </div>

    </div>

  );

}



function AuthField({ label, icon, type = "text", placeholder }) {

    return (

        <div className= "animate-fade-in-up" >

        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5" > { label } </label>

            < div className = "relative" >

                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center" > { icon } </div>

                    < input type = { type } required className = "block w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-sm text-slate-900 font-bold text-sm placeholder-slate-400 focus:outline-none focus:border-[var(--c-primary)] transition-colors" placeholder = { placeholder } />

                        </div>

                        </div>

  );

}



// --- FLOATING AI CHATBOT COMPONENT ---

function FloatingChatbot() {

    const [isOpen, setIsOpen] = useState(false);

    const [messages, setMessages] = useState([{

        role: 'assistant',

        content: "Hi Alex! I'm your career navigator. I've analyzed your B.Tech CSE profile. How can I help you engineering your roadmap today?"

    }]);

    const [input, setInput] = useState('');

    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);



    const suggestedPrompts = [

        "Why learn DSA before ML?",

        "Suggest projects for AI Engineer",

        "Which skills am I missing?",

        "Recommended Certifications"

    ];



    useEffect(() => { if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping, isOpen]);



    const handleSend = (text) => {

        const userMsg = text || input;

        if (!userMsg.trim()) return;



        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

        setInput('');

        setIsTyping(true);



        // AI logic simulation based on user prompts

        setTimeout(() => {

            setIsTyping(false);

            let response = "That's a great question! For a detailed breakdown, check our Path Explorer or the AI Recommendation engine in the Goal Overview.";



            if (userMsg.includes("DSA before ML")) {

                response = "DSA builds the logic required to understand ML algorithms under the hood. Most ML frameworks use data structures for optimization!";

            } else if (userMsg.includes("projects")) {

                response = "For an AI Engineer, I suggest building a RAG (Retrieval-Augmented Generation) pipeline using Python and a vector database like Pinecone.";

            } else if (userMsg.includes("missing")) {

                response = "Based on your CSE branch, you should focus on PyTorch and MLOps deployment to complete your current AI Engineer goal.";

            }



            setMessages(prev => [...prev, { role: 'assistant', content: response }]);

        }, 1500);

    };



    return (

        <>

        {/* Floating Circular Button */ }

        < div className = "fixed bottom-6 right-6 z-[60]" >

            <button 

          onClick={ () => setIsOpen(!isOpen) }

    className = "w-14 h-14 rounded-full bg-gradient-to-r from-[var(--c-primary)] to-[var(--c-secondary)] text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-float"

        >

        { isOpen?<X size = { 24 } /> : <Bot size={ 24 } />
}

</button>

    </div>



{/* Expandable Chat Window */ }

<div className={ `fixed bottom-24 right-6 w-[90vw] sm:w-96 h-[550px] max-h-[80vh] glass-panel rounded-sm z-[60] flex flex-col overflow-hidden shadow-2xl transition-all origin-bottom-right ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'}` }>



    {/* Header */ }

    < div className = "bg-slate-900 p-4 flex items-center justify-between border-b border-slate-800" >

        <div className="flex items-center space-x-3" >

            <div className="bg-blue-600 p-2 rounded-sm" > <Bot className="text-white" size = { 18} /> </div>

                < div >

                <h2 className="text-white font-black text-xs uppercase tracking-widest" > Career Navigator </h2>

                    < div className = "flex items-center space-x-1.5" > <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> <span className="text-[9px] font-bold text-slate-400 uppercase" > Live Assistance < /span></div >

                        </div>

                        </div>

                        < button onClick = {() => setIsOpen(false)} className = "text-slate-400 hover:text-white p-1.5" > <ChevronDown size={ 20 } /></button >

                            </div>



{/* Messages */ }

<div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50 dark:bg-slate-950/50" >

{
    messages.map((msg, index) => (

        <div key= { index } className = {`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-pop-in`} >

    <div className={ `p-3.5 rounded-sm text-xs font-medium shadow-sm transition-all max-w-[85%] ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}` }>

        { msg.content }

        </div>

        </div>

          ))}

{ isTyping && <div className="p-3.5 rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center space-x-1 w-fit" > <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" /> <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-100" /> <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-200" /> </div> }

<div ref={ messagesEndRef } />

    </div>



{/* Suggested Prompts Grid */ }

<div className="px-4 py-3 bg-white/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800" >

    <div className="flex flex-wrap gap-2" >

    {
        suggestedPrompts.map((prompt, i) => (

            <button 

                key= { i } 

                onClick = {() => handleSend(prompt)}

className = "text-[9px] font-black uppercase tracking-widest text-[var(--c-primary)] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-sm hover:bg-[var(--c-primary)] hover:text-white transition-all shadow-sm"

    >

    { prompt }

    </button>

             ))}

</div>

    </div>



{/* Input Box */ }

<div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800" >

    <form onSubmit={ (e) => { e.preventDefault(); handleSend(); } } className = "relative flex items-center" >

        <input 

              type="text"

value = { input }

onChange = {(e) => setInput(e.target.value)}

placeholder = "Ask about your roadmap..."

className = "w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-sm pl-4 pr-12 py-3 text-xs font-bold outline-none focus:border-[var(--c-primary)]"

    />

    <button type="submit" disabled = {!input.trim()} className = "absolute right-1.5 p-2 bg-slate-900 dark:bg-blue-600 text-white rounded-sm disabled:opacity-50 transition-all active:scale-95" >

        <Send size={ 14 } />

            </button>

            </form>

            </div>

            </div>

            </>

  );

}



// --- HIDDEN ROUTE COMPONENTS ---

function DecisionAnalyzer({ navigate }) { return <div className="p-20 text-center uppercase font-black tracking-widest text-slate-400" > Analyzer Module </div>; }

function RiskAnalyzer({ navigate }) { return <div className="p-20 text-center uppercase font-black tracking-widest text-slate-400" > Risk Assessment Module </div>; }

function Recommendations({ navigate }) { return <div className="p-20 text-center uppercase font-black tracking-widest text-slate-400" > Recommendations Module </div>; }

function ReportAnalysis({ navigate }) { return <div className="p-20 text-center uppercase font-black tracking-widest text-slate-400" > Career Health Report Module </div>; }

function AIAssistant() { return <div className="p-20 text-center uppercase font-black tracking-widest text-slate-400" > Full AI Guide Module </div>; }