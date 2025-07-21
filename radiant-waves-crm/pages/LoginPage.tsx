
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Logo: React.FC = () => (
    <div className="flex items-center justify-center space-x-3 mb-8">
        <svg className="w-16 h-16 text-sky-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.06-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93H13v-.93zM13 7h2.87c.45.87.7 1.87.7 2.93H13V7zm0 10v-4h3.57c0 1.06-.25 2.06-.7 2.93H13z" />
        </svg>
        <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800">Radiant Waves</h1>
            <p className="text-sm text-gray-500">Power Solutions</p>
        </div>
    </div>
);


const LoginPage: React.FC = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAppContext();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!login(userId, password)) {
            setError('Invalid User ID or Password.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-sky-700 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <Logo />
                        <div className="divide-y divide-gray-200">
                            <form className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7" onSubmit={handleSubmit}>
                                <div className="relative">
                                    <input
                                        id="userId"
                                        name="userId"
                                        type="text"
                                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                                        placeholder="User ID"
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        autoComplete="username"
                                    />
                                    <label htmlFor="userId" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">User ID</label>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="current-password"
                                    />
                                    <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="rememberMe"
                                            name="rememberMe"
                                            type="checkbox"
                                            className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">Remember me</label>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button type="submit" className="w-full bg-sky-600 text-white rounded-md px-2 py-2.5 hover:bg-sky-700 transition-colors duration-200">
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
             <div className="text-center mt-8 text-gray-500 text-xs">
                © Radiant Waves Power Solutions | Developed by Metric Flux Solutions Pvt Ltd
            </div>
        </div>
    );
};

export default LoginPage;
