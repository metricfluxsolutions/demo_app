
import React, { ReactNode, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Role } from '../types';

const Logo: React.FC = () => (
    <div className="flex items-center space-x-2 p-4 border-b border-sky-800">
        <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.06-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93H13v-.93zM13 7h2.87c.45.87.7 1.87.7 2.93H13V7zm0 10v-4h3.57c0 1.06-.25 2.06-.7 2.93H13z" />
        </svg>
        <span className="text-white text-lg font-bold">Radiant Waves</span>
    </div>
);

const NavItem: React.FC<{ to: string; icon: string; label: string; }> = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
            isActive ? 'bg-sky-600 text-white' : 'text-sky-100 hover:bg-sky-700 hover:text-white'
            }`
        }
    >
        <i className={`fa-fw ${icon} mr-3 w-5 text-center`}></i>
        <span>{label}</span>
    </NavLink>
);

const Sidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
    const { currentUser } = useAppContext();
    const isAdmin = currentUser?.role === Role.ADMIN;

    return (
        <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-sky-900 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
            <Logo />
            <nav className="mt-5">
                <NavItem to="/dashboard" icon="fa-solid fa-tachometer-alt" label="Dashboard" />
                {isAdmin && <NavItem to="/user-management" icon="fa-solid fa-users-cog" label="User Management" />}
                <NavItem to="/create-data" icon="fa-solid fa-plus-circle" label="Create Data" />
                <NavItem to="/report" icon="fa-solid fa-chart-bar" label="Report" />
                {isAdmin && <NavItem to="/attendance-report" icon="fa-solid fa-calendar-check" label="Attendance Report" />}
            </nav>
        </div>
    );
};

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const { currentUser, logout } = useAppContext();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="bg-white shadow-md">
            <div className="flex items-center justify-between px-6 py-3">
                <button onClick={onMenuClick} className="text-gray-500 focus:outline-none md:hidden">
                    <i className="fa-solid fa-bars text-2xl"></i>
                </button>
                <div className="flex-1"></div>
                <div className="relative">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 focus:outline-none">
                        <span className="text-gray-700">{currentUser?.staffName}</span>
                        <i className="fa-solid fa-user-circle text-2xl text-gray-600"></i>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                            <a onClick={logout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-sky-100 cursor-pointer">
                                <i className="fa-solid fa-sign-out-alt mr-2"></i>Logout
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar isOpen={sidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
                    {children}
                </main>
            </div>
             {sidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-20 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
        </div>
    );
};

export default Layout;
