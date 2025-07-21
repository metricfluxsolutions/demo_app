
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Layout from '../components/Layout';
import { Role, AttendanceRecord } from '../types';

const DashboardCard: React.FC<{ to: string, icon: string, title: string, description: string, onClick?: () => void }> = ({ to, icon, title, description, onClick }) => (
    <Link to={to} onClick={onClick} className="block bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center">
            <div className="bg-sky-100 p-4 rounded-full">
                <i className={`${icon} text-3xl text-sky-600`}></i>
            </div>
            <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                <p className="text-gray-500 mt-1">{description}</p>
            </div>
        </div>
    </Link>
);

const AttendanceModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { currentUser, addAttendance } = useAppContext();
    const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSuccessMessage(null);
            setError("Fetching location...");
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                    setError(null);
                },
                (err) => {
                    setError(`Error fetching location: ${err.message}`);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }
    }, [isOpen]);

    const handleSubmit = (type: 'checkIn' | 'checkOut') => {
      if (!currentUser || !location) {
          setError("User or location data is missing.");
          return;
      }
      
      setIsSubmitting(true);
      setSuccessMessage(null);

      const record: Partial<AttendanceRecord> = {
          userId: currentUser.id,
          empId: currentUser.empId,
          staffName: currentUser.staffName,
      };

      const now = new Date();

      if (type === 'checkIn') {
          record.checkInTime = now.toISOString();
          record.checkInLocation = location;
      } else {
          record.checkOutTime = now.toISOString();
          record.checkOutLocation = location;
      }

      addAttendance(record);
      
      setTimeout(() => {
          setSuccessMessage(`Successfully ${type === 'checkIn' ? 'checked in' : 'checked out'}!`);
          setIsSubmitting(false);
          setTimeout(onClose, 2000);
      }, 1000);
  };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Attendance Register</h2>
                <div className="space-y-4">
                    <p><strong>Name:</strong> {currentUser?.staffName}</p>
                    <p><strong>Emp ID:</strong> {currentUser?.empId}</p>
                    <p><strong>Date & Time:</strong> {new Date().toLocaleString()}</p>
                    <div>
                        <strong>Location:</strong>
                        {error && <span className="text-yellow-600 ml-2">{error}</span>}
                        {location && <span className="text-green-600 ml-2">Lat: {location.lat.toFixed(4)}, Lon: {location.lon.toFixed(4)}</span>}
                    </div>
                     {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">{successMessage}</div>}
                    <div className="flex justify-end space-x-4 mt-6">
                        <button onClick={onClose} disabled={isSubmitting} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50">Back</button>
                        <button onClick={() => handleSubmit('checkIn')} disabled={!location || isSubmitting} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400">Check-In</button>
                        <button onClick={() => handleSubmit('checkOut')} disabled={!location || isSubmitting} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-400">Check-Out</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const DashboardPage: React.FC = () => {
    const { currentUser } = useAppContext();
    const [isAttendanceModalOpen, setAttendanceModalOpen] = useState(false);

    const adminActions = [
        { to: '/user-management', icon: 'fa-solid fa-users-cog', title: 'User Management', description: 'Create, edit, and manage users' },
        { to: '/create-data', icon: 'fa-solid fa-plus-circle', title: 'Create Data', description: 'Add new customer information' },
        { to: '/report', icon: 'fa-solid fa-chart-bar', title: 'Report', description: 'View and filter all data' },
        { to: '#', icon: 'fa-solid fa-user-clock', title: 'Attendance Register', description: 'Mark your daily attendance', onClick: () => setAttendanceModalOpen(true) },
        { to: '/attendance-report', icon: 'fa-solid fa-calendar-check', title: 'Attendance Report', description: 'Generate staff attendance reports' },
    ];

    const agentActions = [
        { to: '/create-data', icon: 'fa-solid fa-plus-circle', title: 'Create Data', description: 'Add new customer information' },
        { to: '/report', icon: 'fa-solid fa-chart-bar', title: 'Report', description: 'View your submitted data' },
        { to: '#', icon: 'fa-solid fa-user-clock', title: 'Attendance Register', description: 'Mark your daily attendance', onClick: () => setAttendanceModalOpen(true) },
    ];

    const actions = currentUser?.role === Role.ADMIN ? adminActions : agentActions;

    return (
        <Layout>
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {currentUser?.staffName}!</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {actions.map(action => (
                        <DashboardCard key={action.title} {...action} />
                    ))}
                </div>
            </div>
            <AttendanceModal isOpen={isAttendanceModalOpen} onClose={() => setAttendanceModalOpen(false)} />
        </Layout>
    );
};

export default DashboardPage;
